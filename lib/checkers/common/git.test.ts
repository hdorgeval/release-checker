import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as execModule from '../../utils/exec-sync';
import { exec } from '../../utils/exec-sync';
import { removeFile } from '../../utils/fs';
import { PackageDotJson } from '../../utils/read-package-json';
import {
  getCurrentBranch,
  getLatestTaggedCommit,
  getUncommitedFiles,
  getUntrackedFiles,
  gitIsInstalled,
  headIsDetached,
  headIsNotDetached,
} from './git';

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

test('It should detect there is no untracked file', () => {
  // Given

  // When
  const result = getUntrackedFiles();

  // Then
  expect(result).toEqual([]);
});

test('It should detect there are untracked files', () => {
  // Given
  writeFileSync(join(testingRepo, 'foo.txt'), 'foo');
  writeFileSync(join(testingRepo, 'bar.txt'), 'bar');
  mkdirSync(join(testingRepo, 'lib'));
  writeFileSync(join(testingRepo, 'lib', 'foobar.txt'), 'foobar');
  // When
  const result = getUntrackedFiles();

  // Then
  expect(result).toEqual(['bar.txt', 'foo.txt', 'lib/foobar.txt']);
});

test('It should not detect uncommited files as untracked files', () => {
  // Given
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '2.0.0', scripts: { prepublish: 'yo' } };
  const pkgFilepath = join(testingRepo, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = getUntrackedFiles();

  // Then
  expect(result).toEqual([]);
});

test('It should take only untracked files', () => {
  // Given
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '2.0.0', scripts: { prepublish: 'yo' } };
  const pkgFilepath = join(testingRepo, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  writeFileSync(join(testingRepo, 'foo.txt'), 'foo');
  writeFileSync(join(testingRepo, 'bar.txt'), 'bar');
  mkdirSync(join(testingRepo, 'lib'));
  writeFileSync(join(testingRepo, 'lib', 'foobar.txt'), 'foobar');

  // When
  const result = getUntrackedFiles();

  // Then
  expect(result).toEqual(['bar.txt', 'foo.txt', 'lib/foobar.txt']);
});

test('It should detect uncommited modified files', () => {
  // Given
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '2.0.0', scripts: { prepublish: 'yo' } };
  const pkgFilepath = join(testingRepo, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = getUncommitedFiles();

  // Then
  expect(result).toEqual(['package.json']);
});

test('It should not detect untracked files as uncommited', () => {
  // Given
  writeFileSync(join(testingRepo, 'foo.txt'), 'foo');

  // When
  const result = getUncommitedFiles();

  // Then
  expect(result).toEqual([]);
});

test('It should detect uncommited deleted files', () => {
  // Given
  removeFile('package.json').fromDirectory(testingRepo);

  // When
  const result = getUncommitedFiles();

  // Then
  expect(result).toEqual(['package.json']);
});

test('It should detect uncommited added files', () => {
  // Given
  writeFileSync(join(testingRepo, 'foo.txt'), 'foo');
  exec('git add foo.txt');

  // When
  const result = getUncommitedFiles();

  // Then
  expect(result).toEqual(['foo.txt']);
});

test('It should detect there is no tagged commit', () => {
  // Given

  // When
  const result = getLatestTaggedCommit();

  // Then
  expect(result).toBe('');
});

test('It should detect the latest tagged commit', () => {
  // Given
  exec('git tag -a v1.0.0  -m yo');

  // When
  const result = getLatestTaggedCommit();

  // Then
  const expectedLastCommit = exec('git rev-list --all  --max-count=1');
  expect(result).toBe(expectedLastCommit);
});
