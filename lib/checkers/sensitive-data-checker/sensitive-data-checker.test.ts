import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as execModule from '../../utils/exec-sync';
import { exec } from '../../utils/exec-sync';
import { NpmVersionInfo } from '../../utils/npm-infos';
import { PackageDotJson } from '../../utils/read-package-json';
import { createPackageAndReadAsJson, NpmPackageInfos, sensitiveDataChecker } from './index';

let nativeProcessArgv: string[];
let tempFolder: string;
let nativeCwd: string;
let execSpy: jest.Mock<(command: string) => string>;

beforeAll(() => {
  nativeCwd = process.cwd();
  nativeProcessArgv = process.argv;
  tempFolder = join(__dirname, 'tmp');
  exec(`npm run rimraf -- ${tempFolder}`);
  mkdirSync(tempFolder);
});
beforeEach(() => {
  process.chdir(tempFolder);

  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '1.0.0', scripts: {} };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  execSpy = jest.spyOn(execModule, 'exec').mockImplementation(() => {
    const npmInfo: NpmVersionInfo = { npm: '5.9.0', node: '9.2.0' };
    return JSON.stringify(npmInfo, null, 2);
  });
});
afterEach(() => {
  execSpy.mockRestore();
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});
test('It should run when npm version >= 5.9.0', () => {
  // Given
  const checker = sensitiveDataChecker;

  // When
  const result = checker.canRun && checker.canRun();

  // Then
  expect(result).toBe(true);
});

test('It should not run when npm version < 5.9.0', () => {
  // Given
  const checker = sensitiveDataChecker;

  execSpy = jest.spyOn(execModule, 'exec').mockImplementation(() => {
    const npmInfo: NpmVersionInfo = { npm: '5.8.0', node: '8.6.0' };
    return JSON.stringify(npmInfo, null, 2);
  });

  // When
  const result = checker.canRun && checker.canRun();
  const explanation = checker.whyCannotRun && checker.whyCannotRun();

  // Then
  expect(result).toBe(false);
  expect(explanation).toContain('Cannot check sensitive and non-essential data because');
});

test('It should create a package file and read it as json', () => {
  // Given
  execSpy.mockRestore();
  const checker = sensitiveDataChecker;
  const testFileContent = 'foo';
  const testFilepath = join(tempFolder, 'foo.test.js');
  writeFileSync(testFilepath, testFileContent);

  // When
  const result = checker.canRun && checker.canRun() && createPackageAndReadAsJson();

  // Then
  const expectedResult = [
    {
      entryCount: 2,
      filename: 'testing-repo-1.0.0.tgz',
      files: [{ path: 'package.json' }, { path: 'foo.test.js' }],
      id: 'testing-repo@1.0.0',
      name: 'testing-repo',
      version: '1.0.0',
    },
  ] as Array<Partial<NpmPackageInfos>>;
  // tslint:disable-next-line:no-unused-expression
  checker.canRun && checker.canRun() && expect(result).toMatchObject(expectedResult);
});
