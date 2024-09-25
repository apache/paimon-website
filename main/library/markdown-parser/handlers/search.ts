import { ResolvedArticle } from '../models/article';
import { Profile } from '../models/profile';
import { getDirectoryPath } from '../utils/directory';
import { mkdirSync, writeFileSync } from 'fs';
import { isAfter } from 'date-fns';
import { Search } from '../models/search';
import fs from 'fs';
const { search } = getDirectoryPath();

export function processSearch(articles: ResolvedArticle[], profiles: Profile[]): void {
  if (fs.existsSync(search)) {
    fs.rmSync(search, { force: true, recursive: true });
  }
  mkdirSync(search, { recursive: true });

  let content: Search[] = [];
  const articleUrls = articles.map(item => ({
    title: 'article',
    name: item.name,
    result: `/article/detail/${item.id}`,
    date: item.date
  }));
  const authorUrls = profiles.map(item => ({
    title: 'author',
    name: item.name,
    result: `/author/${item.id}`,
    date: null
  }));
  content.push(...articleUrls, ...authorUrls);

  //排序
  content = content.sort((a, b) => {
    if (a.date === null && b.date !== null) {
      return 1;
    } else if (b.date === null && a.date !== null) {
      return -1;
    } else if (a.date === null && b.date === null) {
      return 1;
    } else {
      return isAfter(a.date, b.date) ? -1 : 1;
    }
  });
  writeFileSync(`${search}/list.json`, JSON.stringify(content));
}
