import { mkdirSync } from 'fs';
import { join } from 'path';
import { exec } from '../../utils/exec-sync';
import { findInstallPathOfDependency, getProductionDepenciesOf } from './npm-dependencies';

let nativeProcessArgv: string[];
let tempFolder: string;
let nativeCwd: string;
let testingRepo: string;

beforeAll(() => {
  nativeCwd = process.cwd();
  nativeProcessArgv = process.argv;
  tempFolder = join(__dirname, 'tmp');
  exec(`npm run rimraf -- ${tempFolder}`);
  mkdirSync(tempFolder);
});
beforeEach(() => {
  process.chdir(tempFolder);
  testingRepo = join(tempFolder, 'testing-repo-for-release-checker');
  exec(`npm run rimraf -- ${testingRepo} `);
  exec('git clone https://github.com/hdorgeval/testing-repo-for-release-checker.git');
  process.chdir(testingRepo);
});
afterEach(() => {
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});

test('It should get empty prod dependencies', () => {
  // Given

  // When
  const result = getProductionDepenciesOf('package.json').inDirectory(testingRepo);

  // Then
  expect(result).toEqual([]);
});

test('It should get prod dependency', () => {
  // Given
  exec('npm install --save micromatch');

  // When
  const result = getProductionDepenciesOf('package.json').inDirectory(testingRepo);

  // Then
  expect(result).toEqual(['micromatch']);
});

test('It should get prod dependencies', () => {
  // Given
  exec('npm install --save micromatch @types/micromatch');

  // When
  const result = getProductionDepenciesOf('package.json').inDirectory(testingRepo);

  // Then
  expect(result).toEqual(['@types/micromatch', 'micromatch']);
});

test('It should get install path of direct dependency', () => {
  // Given
  exec('npm install --save micromatch');

  // When
  const result = findInstallPathOfDependency('micromatch').startingFrom(testingRepo);

  // Then
  const expectedPath = join(testingRepo, 'node_modules', 'micromatch');
  expect(result).toBe(expectedPath);
});

test('It should get install path of direct scoped-dependency', () => {
  // Given
  exec('npm install --save @types/micromatch');

  // When
  const result = findInstallPathOfDependency('@types/micromatch').startingFrom(testingRepo);

  // Then
  const expectedPath = join(testingRepo, 'node_modules', '@types', 'micromatch');
  expect(result).toBe(expectedPath);
});

test('It should raise an error when dependency is not found', () => {
  // Given

  // When

  // Then
  const expectedError = new Error(`cannot find install path of dependency 'foobar' in directory '${testingRepo}'`);
  expect(() => findInstallPathOfDependency('foobar').startingFrom(testingRepo)).toThrow(expectedError);
});
