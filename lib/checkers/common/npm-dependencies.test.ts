import { mkdirSync } from 'fs';
import { ModuleInfo } from 'license-checker';
import { join } from 'path';
import { exec } from '../../utils/exec-sync';
import {
  addLicenceInfoIn,
  DependencyInfo,
  findInstallPathOfDependency,
  getLicencesFrom,
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
    licences: [],
    name: '@types/micromatch',
    path: join(testingRepo, 'node_modules', '@types', 'micromatch'),
    version: '3.1.0',
  };

  const expectedRootDependency2: DependencyInfo = {
    graph: ['micromatch'],
    licences: [],
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
    licences: [],
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
    licences: [],
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

test('It should get licenses of prod dependencies graph', () => {
  // Given
  exec('npm install --save micromatch');

  // When
  const results = getProductionDependenciesGraphOf('package.json')
    .inDirectory(testingRepo)
    .withMaxLevels(100);
  addLicenceInfoIn(results);

  // Then
  const expectedRootDependency1: DependencyInfo = {
    graph: ['micromatch'],
    licences: ['MIT'],
    name: 'micromatch',
    path: join(testingRepo, 'node_modules', 'micromatch'),
    version: '3.1.10',
  };

  expect(results.length).toBe(900);
  expect(results[0]).toEqual(expectedRootDependency1);
});

test('It should get licences extracted by licenses-checker ', () => {
  // Given
  const moduleInfo1 = { licenses: 'MIT' } as ModuleInfo;
  const moduleInfo2 = { licenses: ['MIT'] } as ModuleInfo;
  const moduleInfo3 = { licenses: ['MIT', 'ISC'] } as ModuleInfo;
  const moduleInfo4 = { licenses: undefined } as ModuleInfo;
  const moduleInfo5 = { licenses: [] } as ModuleInfo;

  // When
  const result1 = getLicencesFrom(moduleInfo1);
  const result2 = getLicencesFrom(moduleInfo2);
  const result3 = getLicencesFrom(moduleInfo3);
  const result4 = getLicencesFrom(moduleInfo4);
  const result5 = getLicencesFrom(moduleInfo5);

  // Then
  expect(result1).toEqual(['MIT']);
  expect(result2).toEqual(['MIT']);
  expect(result3).toEqual(['MIT', 'ISC']);
  expect(result4).toEqual(['unknown']);
  expect(result5).toEqual(['unknown']);
});

test('It should get licenses of prod dependencies graph for release-checker', () => {
  // Given
  exec('npm install --save release-checker');

  // When
  const results = getProductionDependenciesGraphOf('package.json')
    .inDirectory(testingRepo)
    .withMaxLevels(100);
  addLicenceInfoIn(results);

  // Then
  const expectedRootDependency1: Partial<DependencyInfo> = {
    graph: ['release-checker'],
    licences: ['ISC'],
    name: 'release-checker',
    path: join(testingRepo, 'node_modules', 'release-checker'),
  };

  expect(results.length).toBe(907);
  expect(results[0]).toMatchObject(expectedRootDependency1);

  results.forEach((result) => {
    expect(['MIT', 'ISC', 'BSD-3-Clause']).toContain(result.licences[0]);
  });
});

test('It should get licenses of prod dependencies graph for testcafe-hammerhead', () => {
  // Given
  exec('npm install --save testcafe-hammerhead');

  // When
  const results = getProductionDependenciesGraphOf('package.json')
    .inDirectory(testingRepo)
    .withMaxLevels(100);
  addLicenceInfoIn(results);

  // Then
  const expectedRootDependency1: Partial<DependencyInfo> = {
    graph: ['testcafe-hammerhead'],
    licences: ['MIT'],
    name: 'testcafe-hammerhead',
    path: join(testingRepo, 'node_modules', 'testcafe-hammerhead'),
  };

  expect(results.length).toBe(49);
  expect(results[0]).toMatchObject(expectedRootDependency1);

  results.forEach((result) => {
    expect(['MIT', 'MIT*', 'ISC', 'BSD', 'BSD*', 'BSD-3-Clause', 'Apache-2.0']).toContain(result.licences[0]);
  });
});

test('It should get licenses of prod dependencies graph for react', () => {
  // Given
  exec('npm install --save react');

  // When
  const results = getProductionDependenciesGraphOf('package.json')
    .inDirectory(testingRepo)
    .withMaxLevels(100);
  addLicenceInfoIn(results);

  // Then
  const expectedRootDependency1: Partial<DependencyInfo> = {
    graph: ['react'],
    licences: ['MIT'],
    name: 'react',
    path: join(testingRepo, 'node_modules', 'react'),
  };

  expect(results.length).toBe(13);
  expect(results[0]).toMatchObject(expectedRootDependency1);

  results.forEach((result) => {
    expect(result.licences.length).toBe(1);
    expect(['MIT', 'MIT*', 'ISC', 'BSD', 'BSD*', 'BSD-3-Clause', 'Apache-2.0']).toContain(result.licences[0]);
  });
});

test('It should skip optional prod dependencies', () => {
  // Given
  exec('npm install --save trianglify');

  // When
  const results = getProductionDependenciesGraphOf('package.json')
    .inDirectory(testingRepo)
    .withMaxLevels(100);
  addLicenceInfoIn(results);

  // Then
  const expectedRootDependency1: Partial<DependencyInfo> = {
    graph: ['trianglify'],
    licences: ['GPL-3.0'],
    name: 'trianglify',
    path: join(testingRepo, 'node_modules', 'trianglify'),
  };

  expect(results.length).toBe(102);
  expect(results[0]).toMatchObject(expectedRootDependency1);

  results.forEach((result) => {
    expect([
      'MIT',
      'MIT*',
      'ISC',
      'BSD',
      'BSD*',
      'BSD-2-Clause',
      'BSD-3-Clause',
      'BSD-3-Clause OR MIT',
      'Apache-2.0',
      'GPL-3.0',
      'WTFPL',
      'AFLv2.1',
      'Unlicense',
    ]).toContain(result.licences[0]);
  });
});
