import { getCliOptions, no } from '../../cli-options/cli-options-parser';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],
  'npm run release-checker -- --tag': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '--tag',
  ],
  'npm run release-checker -- -T': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
    '-T',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],
  'npx release-checker --skip-T': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--skip-T',
  ],
  'npx release-checker --skip-tag': [
    '/usr/local/bin/node',
    '/Users/user_name/.npm/_npx/49244/bin/release-checker',
    '--skip-tag',
  ],
  'npx release-checker --tag': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker', '--tag'],
  'npx release-checker -T': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker', '-T'],

  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
  'release-checker --tag': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '--tag'],
  'release-checker -T': ['/usr/local/bin/node', '/usr/local/bin/release-checker', '-T'],
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
  expect(options['--tag']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should skip on command `npx release-checker --skip-tag` ', () => {
  // Given
  process.argv = argv['npx release-checker --skip-tag'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(false);
  expect(options['--skip-tag']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should skip on command `npx release-checker --skip-T` ', () => {
  // Given
  process.argv = argv['npx release-checker --skip-T'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(false);
  expect(options['--skip-T']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should set default options on command `release-checker` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should set default options on command `npm run release-checker` ', () => {
  // Given
  process.argv = argv['npm run release-checker'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(false);
  expect(no(options).hasBeenSet()).toBe(true);
});

test('It should parse --tag on command `release-checker --tag` ', () => {
  // Given
  process.argv = argv['release-checker --tag'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --tag on command `release-checker -T` ', () => {
  // Given
  process.argv = argv['release-checker -T'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --tag on command `npm run release-checker -- --tag` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- --tag'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --tag on command `npm run release-checker -- -T` ', () => {
  // Given
  process.argv = argv['npm run release-checker -- -T'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --tag on command `npx release-checker --tag` ', () => {
  // Given
  process.argv = argv['npx release-checker --tag'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});

test('It should parse --tag on command `npx release-checker -T` ', () => {
  // Given
  process.argv = argv['npx release-checker -T'];

  // When
  const options = getCliOptions();

  // Then
  expect(options['--tag']).toBe(true);
  expect(no(options).hasBeenSet()).toBe(false);
});
