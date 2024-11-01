/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { decode } from 'html-entities';
import marked, { Token, Tokens } from 'marked';

import { Profile, resolveProfile } from './profile';
import { Configuration } from '../config';
import { getValidDate } from '../utils/date';
import { githubSlugger, parseMarkdownToHTML, parseMarkdownWithYAML } from '../utils/markdown';
import { pickRandom } from '../utils/pick-random';
import { generateUUID } from '../utils/uuid';

type ExtendToken = Token & { tokens: ExtendToken[] };
export type ExtendTokensList = ExtendToken[];
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
    readonly date: string,
    readonly content: string,
    readonly languages: string[] // 'zh' | 'en'
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
    readonly authors: Profile[],
    readonly toc: TOC[],
    readonly date: Date | null,
    readonly languages: string[]
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
    const { authors, categories, date, __content, languages } = parseMarkdownWithYAML(buffer);
    const categoriesString = categories?.map((c: string | number) => c.toString()) || [];
    return new Article(name, categoriesString, authors || [], date, __content, languages);
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
  const { name, content, categories, authors, date, languages } = article;
  checkArticleData(name, authors);
  const tokensList = new marked.Lexer().lex(content) as unknown as ExtendTokensList;

  const contentString = parseMarkdownToHTML(content);
  const toc = generateTOC(tokensList);
  const image = getThumbnail(tokensList) || pickRandom(Configuration.image.article);
  const id = generateUUID(name);
  const abstract = generateAbstract(tokensList, Configuration.article.abstract.minLength);
  const resolvedAuthors = (authors || []).map(author => resolveProfile(author, profileCollection));
  const validDate = getValidDate(name, date);
  return new ResolvedArticle(
    id,
    name,
    abstract,
    image,
    contentString,
    categories,
    resolvedAuthors,
    toc,
    validDate,
    languages
  );
}

function checkArticleData(name: string, authors: string[]): void {
  if (authors && !Array.isArray(authors)) {
    throw new Error(`${name}: authors should be array`);
  }
}

/**
 * generate abstract from markdown tokens, recursive when result less than minLength
 * @param tokensList
 * @param minLength
 */
function generateAbstract(tokensList: ExtendTokensList, minLength: number): string {
  let abstractContent = '';
  tokensList.forEach(token => {
    if (abstractContent.length < minLength) {
      if (token.type === 'heading') {
        return;
      } else if (token.type === 'text') {
        abstractContent += decode(token.text);
      } else if (token.tokens) {
        abstractContent += generateAbstract(token.tokens, minLength);
      }
    }
  });
  return abstractContent;
}

/**
 * generate toc from markdown tokens, recursive when result less than maxDepth
 * @param tokensList
 */
export function generateTOC(tokensList: ExtendTokensList): TOC[] {
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
  let imageUrl: string | null = null;
  tokensList.forEach(token => {
    if (!imageUrl) {
      if (token.type === 'image' && token.href) {
        imageUrl = token.href;
      } else if (token.tokens) {
        imageUrl = getThumbnail(token.tokens);
      }
    }
  });
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
