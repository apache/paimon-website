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
import { isAfter } from 'date-fns';

import * as fs from 'fs';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { parse as parseFileName } from 'path';

import { buildBriefArticleList, parseArticleFromBuffer, resolveArticle, ResolvedArticle } from '../models/article';
import { Profile } from '../models/profile';
import { getDirectoryPath } from '../utils/directory';

const { articleSource, articleDist } = getDirectoryPath();

export function processArticles(profiles: Profile[]): ResolvedArticle[] {
  if (fs.existsSync(articleDist)) {
    fs.rmSync(articleDist, { force: true, recursive: true });
  }
  mkdirSync(articleDist, { recursive: true });

  let articles: ResolvedArticle[] = [];
  let preArticle: Partial<ResolvedArticle>;

  if (!fs.existsSync(articleSource)) {
    mkdirSync(articleSource, { recursive: true });
  }
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
