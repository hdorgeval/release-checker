import { getCliOptions } from "./cli-options-parser";

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
    process.argv = [ '/usr/local/bin/node',
    '/Users/HDO/VSCodeProjects/release-checker/build/bin/release-checker',
    '--help' ];

    // When
    const options = getCliOptions();

    // Then
    expect(options["--help"]).toBe(true);
  });
});
