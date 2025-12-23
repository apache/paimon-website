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
import { writeFileSync } from 'fs';

import { ResolvedArticle } from '../models/article';
import { BriefRelease } from '../models/document';
import { getDirectoryPath } from '../utils/directory';

const { dist } = getDirectoryPath();

export function processRoutes(articles: ResolvedArticle[], releases: BriefRelease[]): void {
  const articleUrls = articles.map(item => `/blog/${item.id}`);
  const releaseUrls = releases.map(item => `/releases/${item.version}`);
  const homeUrls = ['/', '/blog', '/downloads', '/roadmap', '/releases'];
  const content = [...homeUrls, ...articleUrls, ...releaseUrls].join('\n');
  writeFileSync(`${dist}/routes.txt`, content);
}
