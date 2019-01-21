import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import { join } from 'path';
import * as execModule from '../../utils/exec-sync';
import { exec } from '../../utils/exec-sync';
import { getCurrentBranch, gitIsInstalled, headIsDetached, headIsNotDetached } from './git';

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
});
afterEach(() => {
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});

test('It should check that git is not installed', () => {
  // Given
  const spy = jest.spyOn(execModule, 'execOrThrow').mockImplementation(() => {
    const executionResult = execSync('foobar --version', { encoding: 'utf8' });
    return executionResult.toString();
  });

  // When
  const result = gitIsInstalled();

  // Then
  expect(result).toBe(false);
  spy.mockRestore();
});

test('It should check that HEAD is detached', () => {
  // Given
  exec('git checkout --detach');

  // When
  const result = headIsDetached();

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

test('It should detect that current branch is release', () => {
  // Given
  exec('git branch foo');
  exec('git branch bar');
  exec('git branch release');
  exec('git checkout release');

  // When
  const result = getCurrentBranch();

  // Then
  expect(result).toEqual('release');
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

test('It should throw an error when git command failed', () => {
  // Given
  const spy = jest.spyOn(execModule, 'exec').mockImplementation(() => {
    return 'git command failed';
  });

  // When
  // Then
  expect(() => getCurrentBranch()).toThrowError('git command failed');
  spy.mockRestore();
});

test('It should check that HEAD is not detached when current branch is master', () => {
  // Given

  // When
  const result = headIsNotDetached();

  // Then
  expect(result).toEqual(true);
});
