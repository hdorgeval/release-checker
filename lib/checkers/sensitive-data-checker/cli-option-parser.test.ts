import { getCliOptions } from '../../cli-options/cli-options-parser';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],
  'npm run release-checker -- --sensitivedata': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '--sensitivedata',
  ],
  'npm run release-checker -- -s': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '-s',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],
  'npx release-checker --sensitivedata': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--sensitivedata',
  ],
  'npx release-checker -s': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker', '-s'],

  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
  'release-checker --sensitivedata': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--sensitivedata'],
  'release-checker -s': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '-s'],
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
  expect(options['--sensitivedata']).toBe(false);
});

test('It should set default options on command `release-checker` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--sensitivedata']).toBe(false);
});

test('It should set default options on command `npm run release-checker` ', () => {
  // Given
  process.argv = argv['npm run release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--sensitivedata']).toBe(false);
});

test('It should parse --sensitivedata on command `release-checker --sensitivedata` ', () => {
  // Given
  process.argv = argv['release-checker --sensitivedata'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--sensitivedata']).toBe(true);
});

test('It should parse --sensitivedata on command `release-checker -s` ', () => {
  // Given
  process.argv = argv['release-checker -s'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--sensitivedata']).toBe(true);
});

test('It should parse --sensitivedata on command `npm run release-checker -- --sensitivedata` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- --sensitivedata'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--sensitivedata']).toBe(true);
});

test('It should parse --sensitivedata on command `npm run release-checker -- -s` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- -s'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--sensitivedata']).toBe(true);
});

test('It should parse --sensitivedata on command `npx release-checker --sensitivedata` ', () => {
  // Given
  process.argv = argv['npx release-checker --sensitivedata'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--sensitivedata']).toBe(true);
});

test('It should parse --sensitivedata on command `npx release-checker -s` ', () => {
  // Given
  process.argv = argv['npx release-checker -s'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--sensitivedata']).toBe(true);
});
