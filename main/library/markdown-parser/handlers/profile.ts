import * as fs from 'fs';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { parseProfileFromBuffer, Profile } from '../models/profile';
import { parse as parseFileName } from 'path';
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
