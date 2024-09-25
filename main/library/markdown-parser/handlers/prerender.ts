import { ResolvedArticle } from '../models/article';
import { Profile } from '../models/profile';
import { getDirectoryPath } from '../utils/directory';
import { writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const { dist, distRoot } = getDirectoryPath();

export class tabList {
  type: string;
  city: tab[];
}

export class tab {
  type?: string;
  num?: number;
}

export function processRoutes(articles: ResolvedArticle[], profiles: Profile[]): void {
  const articleUrls = articles.map(item => `/article/detail/${item.id}`);
  const articleUrlHome: string[] = [];
  const authorUrls = profiles.map(item => `/author/${item.id}`);
  const homeUrls = ['/', '/article'];
  const content = [...homeUrls, ...articleUrls, ...articleUrlHome, ...authorUrls].join('\n');
  writeFileSync(`${dist}/routes.txt`, content);
  processSitemap(homeUrls, [...articleUrls, ...articleUrlHome, ...authorUrls]);
}

export function processSitemap(homeUrls: string[], innerUrls: string[]): void {
  const innerLinks = innerUrls.map(url => ({ url, changefreq: 'daily', priority: 0.5 }));
  const homeLinks = homeUrls.map(url => ({ url, changefreq: 'always', priority: 1 }));

  const sitemapStream = new SitemapStream({ hostname: 'https://paimon.apache.org/' });

  streamToPromise(Readable.from([...innerLinks, ...homeLinks]).pipe(sitemapStream))
    .then(data => data.toString())
    .then(d => writeFileSync(`${distRoot}/sitemap.xml`, d));
}
