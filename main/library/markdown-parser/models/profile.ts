import { generateUUID } from '../utils/uuid';
import { parse } from 'yaml';
import { pickRandom } from '../utils/pick-random';
import { Configuration } from '../config';

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
