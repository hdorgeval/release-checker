import { readFileSync } from 'fs';
import { join } from 'path';
export interface PackageDotJson {
  name: string;
  version: string;
  scripts: ScriptsSection;
}

export interface ScriptsSection {
  [index: string]: string;
}

export function read(filename: string) {
  return {
    inDirectory(directory: string) {
      return {
        asJson(): PackageDotJson {
          const content = readFileSync(join(directory, filename)).toString();
          return JSON.parse(content);
        },
      };
    },
  };
}
