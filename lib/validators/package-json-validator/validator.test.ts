import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from '../../utils/exec-sync';
import { packageJsonValidator } from './index';

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
test('It should always run', () => {
  // Given
  const validator = packageJsonValidator;

  // When
  const result = validator.canRun && validator.canRun();

  // Then
  expect(result).toBe(true);
});

test('It should throw an exception when package.json is missing', () => {
  // Given
  const validator = packageJsonValidator;

  // When
  // Then
  const expectedError = new Error(`package.json file is missing in '${tempFolder}' `);
  expect(() => validator.run && validator.run()).toThrowError(expectedError);
});

test('It should throw an exception when package.json is badly formed', () => {
  // Given
  const validator = packageJsonValidator;
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, '<bad json>');

  // When
  // Then
  const expectedError = new Error(`package.json file in '${tempFolder}' is badly formed`);
  expect(() => validator.run && validator.run()).toThrowError(expectedError);
});
