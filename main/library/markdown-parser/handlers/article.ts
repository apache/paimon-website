import * as fs from 'fs';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { parse as parseFileName } from 'path';
import { getDirectoryPath } from '../utils/directory';
import { buildBriefArticleList, parseArticleFromBuffer, resolveArticle, ResolvedArticle } from '../models/article';
import { Profile } from '../models/profile';
import { isAfter } from 'date-fns';

const { articleSource, articleDist } = getDirectoryPath();

export function processArticles(profiles: Profile[]): ResolvedArticle[] {
  if (fs.existsSync(articleDist)) {
    fs.rmSync(articleDist, { force: true, recursive: true });
  }
  mkdirSync(articleDist, { recursive: true });

  let articles: ResolvedArticle[] = [];
  let preArticle: Partial<ResolvedArticle>;

  readdirSync(articleSource).forEach(file => {
    const { name } = parseFileName(file);
    const article = parseArticleFromBuffer(name, readFileSync(`${articleSource}/${name}.md`));
    const resolvedArticle = resolveArticle(article, profiles);
    articles.push(resolvedArticle);
  });

  articles = articles
    .sort((a, b) => {
      if (a.date && b.date) {
        return isAfter(a.date, b.date) ? -1 : 1;
      } else {
        return 0;
      }
    })
    .reduce((pre, cur, index) => {
      const resolvedSimpleArticle = { id: cur.id, name: cur.name };
      cur.pre = preArticle;

      preArticle = resolvedSimpleArticle;
      if (index > 0) {
        pre[index - 1].next = resolvedSimpleArticle;
      }

      pre.push(cur);
      return pre;
    }, []);

  articles.forEach(article => {
    writeFileSync(`${articleDist}/${article.id}.json`, JSON.stringify(article));
  });

  const briefArticleList = buildBriefArticleList(articles);
  writeFileSync(`${articleDist}/list.json`, JSON.stringify(briefArticleList));
  return articles;
}
