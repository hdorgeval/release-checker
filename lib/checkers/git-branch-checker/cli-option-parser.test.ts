import { getCliOptions } from '../../cli-options/cli-options-parser';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],
  'npm run release-checker -- --branch': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '--branch',
  ],
  'npm run release-checker -- -b': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '-b',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],
  'npx release-checker --branch': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--branch',
  ],
  'npx release-checker -b': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker', '-b'],

  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
  'release-checker --branch': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--branch'],
  'release-checker -b': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '-b'],
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
  expect(options['--branch']).toBe(false);
});

test('It should set default options on command `release-checker` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--branch']).toBe(false);
});

test('It should set default options on command `npm run release-checker` ', () => {
  // Given
  process.argv = argv['npm run release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--branch']).toBe(false);
});

test('It should parse --branch on command `release-checker --branch` ', () => {
  // Given
  process.argv = argv['release-checker --branch'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--branch']).toBe(true);
});

test('It should parse --branch on command `release-checker -b` ', () => {
  // Given
  process.argv = argv['release-checker -b'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--branch']).toBe(true);
});

test('It should parse --branch on command `npm run release-checker -- --branch` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- --branch'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--branch']).toBe(true);
});

test('It should parse --branch on command `npm run release-checker -- -b` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- -b'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--branch']).toBe(true);
});

test('It should parse --branch on command `npx release-checker --branch` ', () => {
  // Given
  process.argv = argv['npx release-checker --branch'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--branch']).toBe(true);
});

test('It should parse --branch on command `npx release-checker -b` ', () => {
  // Given
  process.argv = argv['npx release-checker -b'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--branch']).toBe(true);
});
