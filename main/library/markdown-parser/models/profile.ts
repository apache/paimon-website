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
import { parse } from 'yaml';

import { Configuration } from '../config';
import { pickRandom } from '../utils/pick-random';
import { generateUUID } from '../utils/uuid';

export class Profile {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly title: string | null,
    readonly detail: string | null,
    readonly image: string | null,
    readonly blog: string | null,
    readonly github: string | null,
    readonly exist: boolean
  ) {}
}

/**
 * parse profile from yaml
 * @param name
 * @param buffer
 */
export function parseProfileFromBuffer(name: string, buffer: Buffer): Profile {
  const { title, profile, image, blog, github } = parse(String(buffer)) || {};
  const id = generateUUID(name);
  return new Profile(id, name, title, profile, image || pickRandom(Configuration.image.profile), blog, github, true);
}

/**
 * create profile with name if not inside profileCollection
 * @param name
 * @param profileCollection
 * @returns
 */
export function resolveProfile(name: string, profileCollection: Profile[]): Profile {
  const targetProfile = profileCollection.find(p => p.name.includes(name));
  if (targetProfile) {
    return targetProfile;
  } else {
    const id = generateUUID(name);
    return new Profile(id, name, null, null, null, null, null, false);
  }
}
