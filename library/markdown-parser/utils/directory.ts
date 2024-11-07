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
import { resolve } from 'path';
import * as process from 'process';

import { Configuration } from '../config';

export const getDirectoryPath = (): {
  source: string;
  dist: string;
  distRoot: string;
  articleDist: string;
  profileDist: string;
  articleSource: string;
  downloadsSource: string;
  releasesSource: string;
  docsDist: string;
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
    articleDist: resolve(dist, Configuration.directory.article),
    profileDist: resolve(dist, Configuration.directory.profile),
    articleSource: resolve(source, Configuration.directory.article),
    downloadsSource: resolve(source, 'docs'),
    releasesSource: resolve(source, 'docs', Configuration.directory.release),
    docsDist: resolve(distRoot, `./assets/docs`),
    profileSource: resolve(source, Configuration.directory.profile)
  };
};
