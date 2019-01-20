import { getCliOptions } from './cli-options-parser';
import { usage } from './usage';

const argv = {
  'npm run release-checker': [
    '/usr/local/bin/node',
    '/Users/user_name/projects/release-checker/build/bin/release-checker',
  ],

  'npx release-checker': ['/usr/local/bin/node', '/Users/user_name/.npm/_npx/49244/bin/release-checker'],
  'release-checker': ['/usr/local/bin/node', '/usr/local/bin/release-checker'],
};

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
