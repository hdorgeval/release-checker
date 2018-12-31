import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from './exec-sync';
import { PackageDotJson, read } from './read-package-json';
import { addScriptInPackageDotJsonOfCurrentWorkingDirectory } from './update-package-json';

let nativeProcessArgv: string[];
let tempFolder: string;
let nativeCwd: string;

beforeAll(() => {
  nativeCwd = process.cwd();
  nativeProcessArgv = process.argv;
  tempFolder = join(__dirname, 'tmp');
  exec(`npm run rimraf -- ${tempFolder}`);
  mkdirSync(tempFolder);
});
beforeEach(() => {
  process.chdir(tempFolder);
});
afterEach(() => {
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});

test('It should add script when scripts section does not exist` ', () => {
  // Given
  const pkg: Partial<PackageDotJson> = {
    name: 'testing-repo',
    version: '1.0.0',
  };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  addScriptInPackageDotJsonOfCurrentWorkingDirectory('foo', 'bar');

  // Then
  const result = read('package.json')
    .inDirectory(process.cwd())
    .asJson();
  expect(result).toHaveProperty('scripts');
  expect(result.scripts).toHaveProperty('foo');
  expect(result.scripts.foo).toBe('bar');
});

test('It should add script when scripts section exists` ', () => {
  // Given
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '1.0.0', scripts: {} };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  addScriptInPackageDotJsonOfCurrentWorkingDirectory('foo', 'bar');

  // Then
  const result = read('package.json')
    .inDirectory(process.cwd())
    .asJson();
  expect(result).toHaveProperty('scripts');
  expect(result.scripts).toHaveProperty('foo');
  expect(result.scripts.foo).toBe('bar');
});

test('It should change script when script exists in scripts section` ', () => {
  // Given
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '1.0.0', scripts: { foo: 'bar' } };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  addScriptInPackageDotJsonOfCurrentWorkingDirectory('foo', 'yo');

  // Then
  const result = read('package.json')
    .inDirectory(process.cwd())
    .asJson();
  expect(result).toHaveProperty('scripts');
  expect(result.scripts).toHaveProperty('foo');
  expect(result.scripts.foo).toBe('yo');
});
