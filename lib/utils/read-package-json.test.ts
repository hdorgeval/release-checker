import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from './exec-sync';
import { ensureThat, jsonPackage, PackageDotJson } from './read-package-json';

let nativeProcessArgv: string[];
let tempFolder: string;
let nativeCwd: string;

beforeAll(() => {
  nativeCwd = process.cwd();
  nativeProcessArgv = process.argv;
  tempFolder = join(__dirname, 'tmp1');
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

test('It should ensure that package.json is not missing` ', () => {
  // Given package.json is missing

  // When
  // Then
  const expectedError = new Error(`package.json file is missing in '${tempFolder}' `);
  expect(() =>
    ensureThat('package.json')
      .inDirectory(tempFolder)
      .canBeRead()
      .asString(),
  ).toThrowError(expectedError);
});

test('It should ensure that package.json is readable as JSON` ', () => {
  // Given
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, '<bad json>');

  // When
  // Then
  const expectedError = new Error(`package.json file in '${tempFolder}' is badly formed`);
  expect(() =>
    ensureThat('package.json')
      .inDirectory(tempFolder)
      .canBeRead()
      .asJson(),
  ).toThrowError(expectedError);
});

test('It should detect that package.json has specific script` ', () => {
  // Given
  const pkg: Partial<PackageDotJson> = {
    name: 'testing-repo',
    scripts: { prepublish: 'echo "running pre-publish script..."' },
    version: '1.0.0',
  };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = jsonPackage()
    .inDirectory(tempFolder)
    .hasScript('prepublish');

  // Then
  expect(result).toBe(true);
});

test('It should detect that package.json has not a specific script` ', () => {
  // Given
  const pkg: Partial<PackageDotJson> = {
    name: 'testing-repo',
    scripts: { foo: 'bar' },
    version: '1.0.0',
  };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = jsonPackage()
    .inDirectory(tempFolder)
    .hasScript('bar');

  // Then
  expect(result).toBe(false);
});

test('It should detect that package.json has no script at all` ', () => {
  // Given
  const pkg: Partial<PackageDotJson> = {
    name: 'testing-repo',
    version: '1.0.0',
  };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = jsonPackage()
    .inDirectory(tempFolder)
    .hasScript('test');

  // Then
  expect(result).toBe(false);
});
