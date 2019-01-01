import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from './exec-sync';
import { ensureThat } from './read-package-json';

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
