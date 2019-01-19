import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import { join } from 'path';
import * as execModule from '../../utils/exec-sync';
import { exec } from '../../utils/exec-sync';
import { getCurrentBranch, gitBranchChecker } from './index';

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
  process.chdir(tempFolder);
  exec('git clone https://github.com/hdorgeval/testing-repo-for-release-checker.git');
  process.chdir(testingRepo);
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

test('It should detect that current branch is master', () => {
  // Given

  // When
  const result = getCurrentBranch();

  // Then
  expect(result).toBe('master');
});

test('It should detect that current branch is foo', () => {
  // Given
  exec('git branch foo');
  exec('git branch bar');
  exec('git checkout foo');

  // When
  const result = getCurrentBranch();

  // Then
  expect(result).toBe('foo');
});

test('It should detect that HEAD is detached', () => {
  // Given
  exec('git checkout --detach');

  // When
  const result = getCurrentBranch();

  // Then
  expect(result).toContain('HEAD detached at');
});
