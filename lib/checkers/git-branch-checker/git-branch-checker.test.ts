import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import { join } from 'path';
import * as execModule from '../../utils/exec-sync';
import { exec } from '../../utils/exec-sync';
import { ValidationError } from '../common/checker-interface';
import { gitBranchChecker } from './index';

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
  const testingRepo = join(tempFolder, 'testing-repo-for-release-checker');
  exec(`npm run rimraf -- ${testingRepo} `);
  exec('git clone https://github.com/hdorgeval/testing-repo-for-release-checker.git');
  process.chdir(testingRepo);

  // remove any errors and warnings in Checker
  gitBranchChecker.errors = undefined;
  gitBranchChecker.warnings = undefined;
  gitBranchChecker.hasErrors = undefined;
  gitBranchChecker.hasWarnings = undefined;
});
afterEach(() => {
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});
test('It should not run when git is not installed', () => {
  // Given
  const checker = gitBranchChecker;
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

test('It should not run when HEAD is detached', () => {
  // Given
  const checker = gitBranchChecker;
  exec('git checkout --detach');

  // When
  const result = checker.canRun && checker.canRun();
  const explanation = checker.whyCannotRun && checker.whyCannotRun();

  // Then
  expect(result).toBe(false);
  expect(explanation).toContain('HEAD is detached');
});

test('It should run when git is installed and HEAD is not detached', () => {
  // Given
  const checker = gitBranchChecker;

  // When
  const result = checker.canRun && checker.canRun();

  // Then
  expect(result).toBe(true);
});

test('It should run without error when current branch is master', () => {
  // Given
  const checker = gitBranchChecker;

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  expect(result).toEqual([]);
});

test('It should run without error when current branch is release', () => {
  // Given
  const checker = gitBranchChecker;
  exec('git branch foo');
  exec('git branch bar');
  exec('git branch release');
  exec('git checkout release');

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  expect(result).toEqual([]);
});

test('It should run with error when current branch is foo', () => {
  // Given
  const checker = gitBranchChecker;
  exec('git branch foo');
  exec('git branch bar');
  exec('git branch release');
  exec('git checkout foo');

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  const expectedVaidationError: ValidationError = {
    reason: `Current branch is 'foo', but it should be 'master' or 'release'.`,
    severity: 'error',
  };
  expect(result).toEqual([expectedVaidationError]);
});
