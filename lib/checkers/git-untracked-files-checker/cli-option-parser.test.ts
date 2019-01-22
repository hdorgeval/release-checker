import { getCliOptions, no } from '../../cli-options/cli-options-parser';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],
  'npm run release-checker -- --untracked-files': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '--untracked-files',
  ],
  'npm run release-checker -- -u': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '-u',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],
  'npx release-checker --untracked-files': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--untracked-files',
  ],
  'npx release-checker -u': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker', '-u'],

  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
  'release-checker --untracked-files': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--untracked-files'],
  'release-checker -u': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '-u'],
};

let nativeProcessArgv: string[];

beforeEach(() => {
  nativeProcessArgv = process.argv;
});
afterEach(() => {
  process.argv = nativeProcessArgv;
});

test('It should set default options on command `npx release-checker` ', () => {
  // Given
  process.argv = argv['npx release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should set default options on command `release-checker` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should set default options on command `npm run release-checker` ', () => {
  // Given
  process.argv = argv['npm run release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should parse --untracked-files on command `release-checker --untracked-files` ', () => {
  // Given
  process.argv = argv['release-checker --untracked-files'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --untracked-files on command `release-checker -u` ', () => {
  // Given
  process.argv = argv['release-checker -u'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --untracked-files on command `npm run release-checker -- --untracked-files` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- --untracked-files'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --untracked-files on command `npm run release-checker -- -u` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- -u'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --untracked-files on command `npx release-checker --untracked-files` ', () => {
  // Given
  process.argv = argv['npx release-checker --untracked-files'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --untracked-files on command `npx release-checker -u` ', () => {
  // Given
  process.argv = argv['npx release-checker -u'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--untracked-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});
