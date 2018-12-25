import { allKeysAreUndefindIn, getCliOptions } from "./cli-options-parser";

const argv = {
  'npm run release-checker -- --help': [ 
      '/usr/local/bin/node',
      '/Users/user_name/projects/release-checker/build/bin/release-checker',
      '--help' ],
      
  'npx release-checker': [ 
            '/usr/local/bin/node',
            '/Users/user_name/.npm/_npx/49244/bin/release-checker'],

  'npx release-checker --help': [ 
      '/usr/local/bin/node',
      '/Users/user_name/.npm/_npx/49244/bin/release-checker',
      '--help' ],
  

  "release-checker": [ '/usr/local/bin/node', '/usr/local/bin/release-checker' ],

  "release-checker --help --foo=far": [ 
        '/usr/local/bin/node',
        '/usr/local/bin/release-checker',
        '--help',
        '--foo=far' ],
}

describe('CLI options parsing', () => {
  let nativeProcessArgv: string[];

  beforeEach(() => {
    nativeProcessArgv = process.argv;
  });
  afterEach(() => {
    process.argv = nativeProcessArgv;
  });

  test('It should detect no options on command `npx release-checker` ', () => {
    // Given
    process.argv = argv['npx release-checker']

    // When
    const options = getCliOptions();
    const commandLineHasNoOption = allKeysAreUndefindIn(options);

    // Then
    expect(commandLineHasNoOption).toBe(true);
  });

  test('It should detect no options on command `release-checker` ', () => {
    // Given
    process.argv = argv['release-checker']

    // When
    const options = getCliOptions();
    const commandLineHasNoOption = allKeysAreUndefindIn(options);

    // Then
    expect(commandLineHasNoOption).toBe(true);
  });

  test('It should detect that an option has been set on command `npx release-checker --help` ', () => {
    // Given
    process.argv = argv['npx release-checker --help']

    // When
    const options = getCliOptions();
    const commandLineHasNoOption = allKeysAreUndefindIn(options);

    // Then
    expect(commandLineHasNoOption).toBe(false);
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
