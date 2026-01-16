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

import fs from 'node:fs';
import { get } from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { listOfPMCs, listOfCommitters } from './app/tokens/member';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.resolve(__dirname, 'assets', 'avatars');
const AVATAR_SIZE = 256;

const avatars = new Set<string>([
  ...listOfPMCs.map(member => member.avatarId),
  ...listOfCommitters.map(member => member.avatarId)
]);

function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    get(
      url,
      {
        headers: {
          // GitHub requires a user agent for avatar fetches.
          'User-Agent': 'paimon-website-avatar-downloader'
        }
      },
      res => {
        if (res.statusCode && res.statusCode >= 400) {
          return reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
        }

        const data: Uint8Array[] = [];
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => resolve(Buffer.concat(data)));
      }
    ).on('error', err => reject(err));
  });
}

async function downloadAvatar(avatarId: string): Promise<void> {
  const url = `https://avatars.githubusercontent.com/u/${avatarId}?s=${AVATAR_SIZE}`;
  const targetPath = path.join(OUTPUT_DIR, `${avatarId}.png`);

  if (fs.existsSync(targetPath)) {
    return;
  }

  const buffer = await fetchBuffer(url);
  await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.promises.writeFile(targetPath, buffer);
}

// Download avatars from GitHub if not already present, and save them to /src/assets/avatars/
export async function loadAvatars(): Promise<void> {
  const ids = Array.from(avatars.values());

  const results = await Promise.allSettled(ids.map(id => downloadAvatar(id)));
  const failures = results
    .map((result, index) => ({ result, id: ids[index] }))
    .filter(({ result }) => result.status === 'rejected');

  if (failures.length > 0) {
    const message = failures.map(({ id, result }) => `${id}: ${(result as PromiseRejectedResult).reason}`).join('\n');
    throw new Error(`Failed to download ${failures.length} avatar(s):\n${message}`);
  }
}

if (process.argv[1] === __filename) {
  loadAvatars()
    .then(() => console.log('Avatar download complete.'))
    .catch(err => {
      console.error(err);
      process.exitCode = 1;
    });
}
