import { getCliOptions, no } from '../../cli-options/cli-options-parser';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],
  'npm run release-checker -- --uncommited-files': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '--uncommited-files',
  ],
  'npm run release-checker -- -c': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '-c',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],
  'npx release-checker --skip-c': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--skip-c',
  ],
  'npx release-checker --skip-uncommited-files': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--skip-uncommited-files',
  ],
  'npx release-checker --uncommited-files': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--uncommited-files',
  ],
  'npx release-checker -c': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker', '-c'],

  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
  'release-checker --uncommited-files': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--uncommited-files'],
  'release-checker -c': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '-c'],
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
  expect(options['--uncommited-files']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should skip on command `npx release-checker --skip-uncommited-files` ', () => {
  // Given
  process.argv = argv['npx release-checker --skip-uncommited-files'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(false);
  expect(options['--skip-uncommited-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should skip on command `npx release-checker --skip-c` ', () => {
  // Given
  process.argv = argv['npx release-checker --skip-c'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(false);
  expect(options['--skip-c']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should set default options on command `release-checker` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should set default options on command `npm run release-checker` ', () => {
  // Given
  process.argv = argv['npm run release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should parse --uncommited-files on command `release-checker --uncommited-files` ', () => {
  // Given
  process.argv = argv['release-checker --uncommited-files'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --uncommited-files on command `release-checker -c` ', () => {
  // Given
  process.argv = argv['release-checker -c'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --uncommited-files on command `npm run release-checker -- --uncommited-files` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- --uncommited-files'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --uncommited-files on command `npm run release-checker -- -c` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- -c'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --uncommited-files on command `npx release-checker --uncommited-files` ', () => {
  // Given
  process.argv = argv['npx release-checker --uncommited-files'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --uncommited-files on command `npx release-checker -c` ', () => {
  // Given
  process.argv = argv['npx release-checker -c'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--uncommited-files']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});
