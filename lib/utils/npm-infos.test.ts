import { getCurrentNpmVersion } from './npm-infos';

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
  jest.spyOn(global.JSON, 'parse').mockImplementation(() => {
    throw new Error('yo');
  });

  // Then
  const expectedError = new Error(`Cannot parse the result of command 'npm version --json'`);
  expect(() => getCurrentNpmVersion()).toThrowError(expectedError);
});
