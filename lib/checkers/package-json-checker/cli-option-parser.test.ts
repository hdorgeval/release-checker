import { getCliOptions } from '../../cli-options/cli-options-parser';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],
  'npm run release-checker -- --package.json': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '--package.json',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],
  'npx release-checker --package.json': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--package.json',
  ],

  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
  'release-checker --package.json': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--package.json'],
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
  expect(options['--package.json']).toBe(true);
});

test('It should set default options on command `release-checker` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--package.json']).toBe(true);
});

test('It should set default options on command `npm run release-checker` ', () => {
  // Given
  process.argv = argv['npm run release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--package.json']).toBe(true);
});

test('It should parse --package.json on command `release-checker --package.json` ', () => {
  // Given
  process.argv = argv['release-checker --package.json'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--package.json']).toBe(true);
});

test('It should parse --package.json on command `npm run release-checker -- --package.json` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- --package.json'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--package.json']).toBe(true);
});

test('It should parse --package.json on command `npx release-checker --package.json` ', () => {
  // Given
  process.argv = argv['npx release-checker --package.json'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--package.json']).toBe(true);
});
