import { getCliOptions } from '../../cli-options/cli-options-parser';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],
  'npm run release-checker -- --test': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '--test',
  ],
  'npm run release-checker -- -t': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '-t',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],
  'npx release-checker --test': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--test',
  ],
  'npx release-checker -t': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker', '-t'],

  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
  'release-checker --test': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--test'],
  'release-checker -t': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '-t'],
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
  expect(options['--test']).toBe(false);
});

test('It should set default options on command `release-checker` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--test']).toBe(false);
});

test('It should set default options on command `npm run release-checker` ', () => {
  // Given
  process.argv = argv['npm run release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--test']).toBe(false);
});

test('It should parse --test on command `release-checker --test` ', () => {
  // Given
  process.argv = argv['release-checker --test'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--test']).toBe(true);
});

test('It should parse --test on command `release-checker -t` ', () => {
  // Given
  process.argv = argv['release-checker -t'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--test']).toBe(true);
});

test('It should parse --test on command `npm run release-checker -- --test` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- --test'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--test']).toBe(true);
});

test('It should parse --test on command `npm run release-checker -- -t` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- -t'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--test']).toBe(true);
});

test('It should parse --test on command `npx release-checker --test` ', () => {
  // Given
  process.argv = argv['npx release-checker --test'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--test']).toBe(true);
});

test('It should parse --test on command `npx release-checker -t` ', () => {
  // Given
  process.argv = argv['npx release-checker -t'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--test']).toBe(true);
});
