import { writeFileSync } from 'fs';
import { join } from 'path';
import { read } from './read-package-json';

export function addScriptInPackageDotJsonOfCurrentWorkingDirectory(key: string, script: string): void {
  const pkg = read('package.json')
    .inDirectory(process.cwd())
    .asJson();
  pkg.scripts = pkg.scripts || {};
  pkg.scripts[key] = script;
  writeFileSync(join(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2));
}
