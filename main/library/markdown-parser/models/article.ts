import { Profile, resolveProfile } from './profile';
import { generateUUID } from '../utils/uuid';
import { getValidDate } from '../utils/date';
import { githubSlugger, parseMarkdownToHTML, parseMarkdownWithYAML } from '../utils/markdown';
import { Configuration } from '../config';
import marked, { Token, Tokens } from 'marked';
import { pickRandom } from '../utils/pick-random';
import { pinyin } from 'pinyin-pro';
import { decode } from 'html-entities';

type ExtendToken = Token & { tokens: ExtendToken[] };
type ExtendTokensList = ExtendToken[];
export interface TOC {
  depth: number;
  text: string;
  id: string | null;
}

/**
 * Raw data parsed from yaml & markdown
 */
export class Article {
  constructor(
    readonly name: string,
    readonly categories: string[],
    readonly authors: string[],
    readonly editors: string[],
    readonly date: string,
    readonly content: string
  ) {}
}

/**
 * Resolved article used to render in web
 */
export class ResolvedArticle {
  public pre?: Partial<ResolvedArticle>;
  public next?: Partial<ResolvedArticle>;

  constructor(
    readonly id: string,
    readonly name: string,
    readonly abstract: string,
    readonly thumbnail: string,
    readonly content: string,
    readonly categories: string[],
    readonly categoriesCN: string[],
    readonly authors: Profile[],
    readonly editors: Profile[],
    readonly toc: TOC[],
    readonly date: Date | null
  ) {}
}

export type BriefArticle = Omit<ResolvedArticle, 'content'>;

/**
 * parse article from buffer with yaml & markdown
 * @param name
 * @param buffer
 */
export function parseArticleFromBuffer(name: string, buffer: Buffer): Article {
  try {
    const { authors, editors, categories, date, __content } = parseMarkdownWithYAML(buffer);
    const categoriesString = categories?.map((c: string | number) => c.toString()) || [];
    return new Article(name, categoriesString, authors || [], editors || [], date, __content);
  } catch (e) {
    console.log(e);
    throw new Error(name);
  }
}

/**
 * Correct and add more properties to article
 * @param article
 * @param profileCollection
 */
export function resolveArticle(article: Article, profileCollection: Profile[]): ResolvedArticle {
  const { name, content, categories, authors, editors, date } = article;
  checkArticleData(name, authors, editors);
  const tokensList = new marked.Lexer().lex(content) as unknown as ExtendTokensList;

  const contentString = parseMarkdownToHTML(content);
  const toc = generateTOC(tokensList);
  const image = getThumbnail(tokensList) || pickRandom(Configuration.image.article);
  const id = generateUUID(name);
  const abstract = generateAbstract(tokensList, Configuration.article.abstract.minLength);
  const resolvedAuthors = (authors || []).map(author => resolveProfile(author, profileCollection));
  const resolvedEditors = (editors || []).map(editor => resolveProfile(editor, profileCollection));
  const validDate = getValidDate(name, date);
  const categoriesCN = categories.map(item => pinyin(item, { toneType: 'none' }).replace(/\s*/g, ''));
  return new ResolvedArticle(
    id,
    name,
    abstract,
    image,
    contentString,
    categories,
    categoriesCN,
    resolvedAuthors,
    resolvedEditors,
    toc,
    validDate
  );
}

function checkArticleData(name: string, authors: string[], editors: string[]): void {
  if (authors && !Array.isArray(authors)) {
    throw new Error(`${name}: authors should be array`);
  }
  if (editors && !Array.isArray(editors)) {
    throw new Error(`${name}: editors should be array`);
  }
}

/**
 * generate abstract from markdown tokens, recursive when result less than minLength
 * @param tokensList
 * @param minLength
 */
function generateAbstract(tokensList: ExtendTokensList, minLength: number): string {
  let abstractContent = '';
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < tokensList.length; i++) {
    if (abstractContent.length < minLength) {
      const token = tokensList[i];
      if (token.type === 'heading') {
        continue;
      } else if (token.type === 'text') {
        abstractContent += decode(token.text);
      } else if (token.tokens) {
        abstractContent += generateAbstract(token.tokens, minLength);
      }
    }
  }
  return abstractContent;
}

/**
 * generate toc from markdown tokens, recursive when result less than maxDepth
 * @param tokensList
 */
function generateTOC(tokensList: ExtendTokensList): TOC[] {
  githubSlugger.reset();
  return (
    tokensList.filter(token => token.type === 'heading' && token.depth > 1 && token.depth <= 3) as Tokens.Heading[]
  ).map(item => {
    return {
      depth: item.depth,
      text: item.text,
      id: githubSlugger.slug(item.text)
    };
  });
}

/**
 * get first image url from markdown tokens as thumbnail
 * @param tokensList
 */
function getThumbnail(tokensList: ExtendTokensList): string | null {
  let imageUrl = null;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < tokensList.length; i++) {
    if (!imageUrl) {
      const token = tokensList[i];
      if (token.type === 'image' && token.href) {
        imageUrl = token.href;
      } else if (token.tokens) {
        imageUrl = getThumbnail(token.tokens);
      }
    } else {
      break;
    }
  }
  return imageUrl;
}

/**
 * Build list without content
 * @param articles
 */
export function buildBriefArticleList(articles: ResolvedArticle[]): BriefArticle[] {
  return articles.map(article => {
    const { ...rest } = article;
    return rest;
  });
}
