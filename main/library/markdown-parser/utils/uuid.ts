import md5 from 'md5';

export function generateUUID(source: string): string {
  return md5(source) as string;
}
