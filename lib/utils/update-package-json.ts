import { writeFileSync } from 'fs';
import { join } from 'path';
import { read } from './read-package-json';

export function addScript(script: string) {
  return {
    withKey(key: string) {
      return {
        inside(filename: string) {
          return {
            ofDirectory(directory: string) {
              const pkg = read(filename)
                .inDirectory(directory)
                .asJson();
              pkg.scripts = pkg.scripts || {};
              pkg.scripts[key] = script;
              writeFileSync(join(directory, filename), JSON.stringify(pkg, null, 2));
            },
          };
        },
      };
    },
  };
}
