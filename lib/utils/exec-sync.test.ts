import { exec } from './exec-sync';

let nativeProcessArgv: string[];

beforeEach(() => {
  nativeProcessArgv = process.argv;
});
afterEach(() => {
  process.argv = nativeProcessArgv;
});

test('It should execute command `npm version --json` ', () => {
  // Given
  const command = 'npm version --json';

  // When
  const commandOutput = exec(command);
  const result = JSON.parse(commandOutput);

  // Then
  expect(result).toHaveProperty('npm');
  expect(result).toHaveProperty('node');
  expect(result).toHaveProperty('modules');
});

test('It should not execute command `npm yo --json` ', () => {
  // Given
  const command = 'npm yo --json';

  // When
  const result = exec(command);

  // Then
  expect(result).toContain('Command failed');
  expect(result).toContain(command);
});
