import { resolve } from 'path';
import { Configuration } from '../config';
import * as process from 'process';

export const getDirectoryPath = (): {
  source: string;
  dist: string;
  distRoot: string;
  search: string;
  articleDist: string;
  profileDist: string;
  articleSource: string;
  profileSource: string;
} => {
  const processwd = process.cwd();
  const source = resolve(processwd, `../../${Configuration.directory.source}`);
  const distRoot = resolve(processwd, `../../src`);
  const dist = resolve(distRoot, `./assets/${Configuration.directory.dist}`);
  return {
    source,
    dist,
    distRoot,
    search: resolve(dist, Configuration.directory.search),
    articleDist: resolve(dist, Configuration.directory.article),
    profileDist: resolve(dist, Configuration.directory.profile),
    articleSource: resolve(source, Configuration.directory.article),
    profileSource: resolve(source, Configuration.directory.profile)
  };
};
