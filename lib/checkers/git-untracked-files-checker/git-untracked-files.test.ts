import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as execModule from '../../utils/exec-sync';
import { exec } from '../../utils/exec-sync';
import { PackageDotJson } from '../../utils/read-package-json';
import { ValidationError } from '../common/checker-interface';
import { gitUntrackedFilesChecker } from './index';

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

  // remove any errors and warnings in Checker
  gitUntrackedFilesChecker.errors = undefined;
  gitUntrackedFilesChecker.warnings = undefined;
  gitUntrackedFilesChecker.hasErrors = undefined;
  gitUntrackedFilesChecker.hasWarnings = undefined;
});
afterEach(() => {
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});
test('It should not run when git is not installed', () => {
  // Given
  const checker = gitUntrackedFilesChecker;
  const spy = jest.spyOn(execModule, 'execOrThrow').mockImplementation(() => {
    const executionResult = execSync('foobar --version', { encoding: 'utf8' });
    return executionResult.toString();
  });

  // When
  const result = checker.canRun && checker.canRun();
  const explanation = checker.whyCannotRun && checker.whyCannotRun();

  // Then
  expect(result).toBe(false);
  expect(explanation).toContain('git not found');
  spy.mockRestore();
});

test('It should run when git is installed', () => {
  // Given
  const checker = gitUntrackedFilesChecker;

  // When
  const result = checker.canRun && checker.canRun();

  // Then
  expect(result).toBe(true);
});

test('It should run without error when there is no untracked file', () => {
  // Given
  const checker = gitUntrackedFilesChecker;

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  expect(result).toEqual([]);
});

test('It should run without error when there are only uncommited files', () => {
  // Given
  const checker = gitUntrackedFilesChecker;
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '2.0.0', scripts: { prepublish: 'yo' } };
  const pkgFilepath = join(testingRepo, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  expect(result).toEqual([]);
});

test('It should run with error when there are untracked files', () => {
  // Given
  const checker = gitUntrackedFilesChecker;
  writeFileSync(join(testingRepo, 'foo.txt'), 'foo');
  writeFileSync(join(testingRepo, 'bar.txt'), 'bar');
  mkdirSync(join(testingRepo, 'lib'));
  writeFileSync(join(testingRepo, 'lib', 'foobar.txt'), 'foobar');

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  const expectedErrors: ValidationError[] = [];
  const error1: ValidationError = { reason: `File 'bar.txt' is untracked`, severity: 'error' };
  const error2: ValidationError = { reason: `File 'foo.txt' is untracked`, severity: 'error' };
  const error3: ValidationError = { reason: `File 'lib/foobar.txt' is untracked`, severity: 'error' };
  expectedErrors.push(error1);
  expectedErrors.push(error2);
  expectedErrors.push(error3);
  expect(result).toEqual(expectedErrors);
});
