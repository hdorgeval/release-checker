import { mkdirSync } from 'fs';
import { join } from 'path';
import { exec } from '../../utils/exec-sync';
import {
  DependencyInfo,
  findInstallPathOfDependency,
  getProductionDepenciesOf,
  getProductionDependenciesGraphOf,
  getProductionDependenciesInfosOf,
} from './npm-dependencies';

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

test('It should get prod dependencies infos', () => {
  // Given
  exec('npm install --save micromatch @types/micromatch');

  // When
  const result = getProductionDependenciesInfosOf('package.json').inDirectory(testingRepo);

  // Then
  const expectedRootDependency1: DependencyInfo = {
    graph: ['@types/micromatch'],
    name: '@types/micromatch',
    path: join(testingRepo, 'node_modules', '@types', 'micromatch'),
    version: '3.1.0',
  };

  const expectedRootDependency2: DependencyInfo = {
    graph: ['micromatch'],
    name: 'micromatch',
    path: join(testingRepo, 'node_modules', 'micromatch'),
    version: '3.1.10',
  };
  const expectedResult = [expectedRootDependency1, expectedRootDependency2];
  expect(result).toEqual(expectedResult);
});

test('It should get prod dependencies graph', () => {
  // Given
  exec('npm install --save micromatch');

  // When
  const results = getProductionDependenciesGraphOf('package.json')
    .inDirectory(testingRepo)
    .withMaxLevels(100);

  // Then
  const expectedRootDependency1: DependencyInfo = {
    graph: ['micromatch'],
    name: 'micromatch',
    path: join(testingRepo, 'node_modules', 'micromatch'),
    version: '3.1.10',
  };

  expect(results.length).toBe(900);
  expect(results[0]).toEqual(expectedRootDependency1);
});

test('It should get prod dependencies graph', () => {
  // Given
  exec('npm install --save @types/micromatch');

  // When
  const results = getProductionDependenciesGraphOf('package.json')
    .inDirectory(testingRepo)
    .withMaxLevels(100);

  // Then
  const expectedRootDependency1: DependencyInfo = {
    graph: ['@types/micromatch'],
    name: '@types/micromatch',
    path: join(testingRepo, 'node_modules', '@types', 'micromatch'),
    version: '3.1.0',
  };

  expect(results.length).toBe(2);
  expect(results[0]).toEqual(expectedRootDependency1);
});

test('It should throw an error when dependency graph is greater than expected', () => {
  // Given
  exec('npm install --save micromatch');

  // When
  // Then
  const expectedError = new Error(`The dependency graph is too deep: it has more than 5 levels`);
  expect(() =>
    getProductionDependenciesGraphOf('package.json')
      .inDirectory(testingRepo)
      .withMaxLevels(5),
  ).toThrow(expectedError);
});
