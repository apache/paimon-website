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

import * as fs from 'fs';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { parse as parseFileName } from 'path';

import { BriefRelease, parseDocumentFromBuffer, ResolvedDocument, resolveDocument } from '../models/document';
import { getDirectoryPath } from '../utils/directory';

const { downloadsSource, releasesSource, docsDist } = getDirectoryPath();

export function processDocuments(): { releases: BriefRelease[] } {
  if (fs.existsSync(docsDist)) {
    fs.rmSync(docsDist, { force: true, recursive: true });
  }
  mkdirSync(docsDist, { recursive: true });

  if (!fs.existsSync(releasesSource)) {
    mkdirSync(releasesSource, { recursive: true });
  }

  const releases: ResolvedDocument[] = [];
  const downloads = parseDocumentFromBuffer('downloads', readFileSync(`${downloadsSource}/downloads.md`));
  const resolvedDownloads = resolveDocument(downloads);
  writeFileSync(`${docsDist}/downloads.json`, JSON.stringify(resolvedDownloads));

  readdirSync(releasesSource).forEach(file => {
    const { name } = parseFileName(file);
    const release = parseDocumentFromBuffer(name, readFileSync(`${releasesSource}/${name}.md`));
    const resolvedRelease = resolveDocument(release);
    releases.push(resolvedRelease);
  });

  releases.forEach(release => writeFileSync(`${docsDist}/${release.version}.json`, JSON.stringify(release)));

  // sort by weight
  const briefReleases = releases
    .sort((a, b) => b.weight - a.weight)
    .map(release => new BriefRelease(release.title, release.version));

  writeFileSync(`${docsDist}/releases.json`, JSON.stringify(briefReleases));

  return { releases: briefReleases };
}
