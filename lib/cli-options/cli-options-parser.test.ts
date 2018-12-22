import { getCliOptions } from "./cli-options-parser";

const argv = {
  'npm run release-checker -- --help': [ 
      '/usr/local/bin/node',
      '/Users/user_name/projects/release-checker/build/bin/release-checker',
      '--help' ],

  'npx release-checker --help': [ 
      '/usr/local/bin/node',
      '/Users/user_name/.npm/_npx/49244/bin/release-checker',
      '--help' ],
}

describe('CLI options parsing', () => {
  let nativeProcessArgv: string[];

  beforeEach(() => {
    nativeProcessArgv = process.argv;
  });
  afterEach(() => {
    process.argv = nativeProcessArgv;
  });

  test('It should parse --help on command `npm run release-checker -- --help` ', () => {
    // Given
    process.argv = argv['npm run release-checker -- --help'];

    // When
    const options = getCliOptions();

    // Then
    expect(options["--help"]).toBe(true);
  });

  test('It should parse --help on command `npx release-checker --help` ', () => {
    // Given
    process.argv = argv['npx release-checker --help']

    // When
    const options = getCliOptions();

    // Then
    expect(options["--help"]).toBe(true);
  });
});
