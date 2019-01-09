import * as execModule from './exec-sync';
import { currentNpmVersion, getCurrentNpmVersion, NpmVersionInfo } from './npm-infos';

test('It should get current npm version', () => {
  // Given

  // When
  const result = getCurrentNpmVersion();

  // Then
  expect(result).toMatch(/\d*\.\d*\.\d*/);
});

test('It should throw an error when result of command `npm version --json` is not parseable', () => {
  // Given
  // When
  const spy = jest.spyOn(global.JSON, 'parse').mockImplementation(() => {
    throw new Error('yo');
  });

  // Then
  const expectedError = new Error(`Cannot parse the result of command 'npm version --json'`);
  expect(() => getCurrentNpmVersion()).toThrowError(expectedError);
  spy.mockRestore();
});

test('It should use json formatter of command `npm pack` when npm version is 5.9.0', () => {
  // Given
  const spy = jest.spyOn(execModule, 'exec').mockImplementation(() => {
    const npmInfo: NpmVersionInfo = { npm: '5.9.0', node: '9.2.0' };
    return JSON.stringify(npmInfo, null, 2);
  });

  // When
  const result = currentNpmVersion()
    .canReportInJson()
    .packCommand();

  // Then
  expect(result).toBe(true);
  spy.mockRestore();
});

test('It should not use json formatter of command `npm pack` when npm version is 5.8.0', () => {
  // Given
  const spy = jest.spyOn(execModule, 'exec').mockImplementation(() => {
    const npmInfo: NpmVersionInfo = { npm: '5.8.0', node: '9.2.0' };
    return JSON.stringify(npmInfo, null, 2);
  });
  // When
  const result = currentNpmVersion()
    .canReportInJson()
    .packCommand();

  // Then
  expect(result).toBe(false);
  spy.mockRestore();
});
