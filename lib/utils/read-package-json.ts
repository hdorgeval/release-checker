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
        asString(): string {
          return readFileSync(join(directory, filename)).toString();
        },
      };
    },
  };
}

export function ensureThat(filename: string) {
  return {
    inDirectory(directory: string) {
      return {
        canBeRead() {
          return {
            asString() {
              try {
                read(filename)
                  .inDirectory(directory)
                  .asString();
              } catch (error) {
                throw new Error(`${filename} file is missing in '${directory}' `);
              }
            },
            asJson() {
              try {
                read(filename)
                  .inDirectory(directory)
                  .asJson();
              } catch (error) {
                throw new Error(`${filename} file in '${directory}' is badly formed`);
              }
            },
          };
        },
      };
    },
  };
}
