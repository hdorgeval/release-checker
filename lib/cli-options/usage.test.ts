import { getCliOptions } from './cli-options-parser';
import { argv } from './cli-options-parser.test';
import { usage } from './usage';

let nativeProcessArgv: string[];

beforeEach(() => {
  nativeProcessArgv = process.argv;
});
afterEach(() => {
  process.argv = nativeProcessArgv;
});

test('It should show all cli options in usage` ', () => {
  // Given
  process.argv = argv['release-checker'];

  // When
  const options = getCliOptions();

  // Then
  for (const option in options) {
    if (option === '--package.json') {
      continue;
    }
    expect(usage).toContain(option);
  }
});
