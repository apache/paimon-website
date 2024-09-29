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

import { parseProfileFromBuffer, Profile } from '../models/profile';
import { getDirectoryPath } from '../utils/directory';

const { profileSource, profileDist } = getDirectoryPath();

export function processProfiles(): Profile[] {
  if (fs.existsSync(profileDist)) {
    fs.rmSync(profileDist, { force: true, recursive: true });
  }
  mkdirSync(profileDist, { recursive: true });

  const profiles: Profile[] = [];

  readdirSync(profileSource).forEach(file => {
    const { name } = parseFileName(file);
    const profile = parseProfileFromBuffer(name, readFileSync(`${profileSource}/${name}.yaml`));
    writeFileSync(`${profileDist}/${profile.id}.json`, JSON.stringify(profile));
    profiles.push(profile);
  });

  writeFileSync(`${profileDist}/list.json`, JSON.stringify(profiles));
  return profiles;
}
