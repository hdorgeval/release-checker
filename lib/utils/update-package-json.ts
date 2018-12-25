import { writeFileSync } from 'fs';
import { join } from 'path';
import { readPackageDotJsonInCurrentWorkingDirectory } from './read-package-json';

export function addScriptInPackageDotJsonOfCurrentWorkingDirectory(key: string, script: string): void {
  const pkg = readPackageDotJsonInCurrentWorkingDirectory();
  if (!pkg) {
    return;
  }
  pkg.scripts = pkg.scripts || {};
  pkg.scripts[key] = script;
  writeFileSync(join(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2));
}
