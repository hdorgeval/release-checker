import { getCliOptions } from './cli-options-parser';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],
  'npm run release-checker -- --help': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '--help',
  ],
  'npm run release-checker -- -h': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '-h',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],

  'npx release-checker --help': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--help',
  ],

  'npx release-checker -h': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker', '-h'],

  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
  'release-checker --help': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--help'],
  'release-checker --help --foo=far': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--help', '--foo=far'],
  'release-checker -h': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '-h'],
  'release-checker -h -foo=far': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '-h', '-foo=far'],
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
  expect(options['--help']).toBe(false);
});

test('It should set default options on command `release-checker` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--package.json']).toBe(true);
  expect(options['--help']).toBe(false);
});

test('It should set default options on command `npm run release-checker` ', () => {
  // Given
  process.argv = argv['npm run release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--package.json']).toBe(true);
  expect(options['--help']).toBe(false);
});

test('It should parse --help on command `release-checker --help` ', () => {
  // Given
  process.argv = argv['release-checker --help'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--help']).toBe(true);
});

test('It should parse --help on command `release-checker -h` ', () => {
  // Given
  process.argv = argv['release-checker -h'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--help']).toBe(true);
});

test('It should parse --help on command `npm run release-checker -- --help` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- --help'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--help']).toBe(true);
});

test('It should parse --help on command `npm run release-checker -- -h` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- -h'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--help']).toBe(true);
});

test('It should parse --help on command `npx release-checker --help` ', () => {
  // Given
  process.argv = argv['npx release-checker --help'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--help']).toBe(true);
});

test('It should parse --help on command `npx release-checker -h` ', () => {
  // Given
  process.argv = argv['npx release-checker -h'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--help']).toBe(true);
});
