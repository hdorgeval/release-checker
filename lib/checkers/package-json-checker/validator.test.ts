import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from '../../utils/exec-sync';
import { PackageDotJson } from '../../utils/read-package-json';
import { ValidationError } from '../common/checker-interface';
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

test('It should return a validation error when name section of package.json is undefined', () => {
  // Given
  const validator = packageJsonValidator;
  const pkg: Partial<PackageDotJson> = { version: '1.0.0', scripts: {} };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = validator.run && validator.run();

  // Then
  const expectedValidationError: ValidationError = { reason: 'package.json has no name defined', severity: 'error' };
  expect(Array.isArray(result)).toBe(true);
  expect(result && result.length).toBe(1);
  expect(result && result[0]).toEqual(expectedValidationError);
});

test('It should return a validation error when version section of package.json is undefined', () => {
  // Given
  const validator = packageJsonValidator;
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', scripts: {} };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = validator.run && validator.run();

  // Then
  const expectedValidationError: ValidationError = { reason: 'package.json has no version defined', severity: 'error' };
  expect(Array.isArray(result)).toBe(true);
  expect(result && result.length).toBe(1);
  expect(result && result[0]).toEqual(expectedValidationError);
});

test('It should return no validation error when package.json is valid', () => {
  // Given
  const validator = packageJsonValidator;
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '1.0.0', scripts: {} };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = validator.run && validator.run();

  // Then
  expect(Array.isArray(result)).toBe(true);
  expect(result && result.length).toBe(0);
});
