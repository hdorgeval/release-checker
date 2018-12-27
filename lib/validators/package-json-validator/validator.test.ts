import { packageJsonValidator } from './index';

describe('package.json validator', () => {
  test('It should always run` ', () => {
    // Given
    const validator = packageJsonValidator;

    // When
    const result = validator.canRun && validator.canRun();

    // Then
    expect(result).toBe(true);
  });

  test('It should throw an exception when not implemented` ', () => {
    // Given
    const validator = packageJsonValidator;

    // When
    // Then
    expect(() => validator.run && validator.run()).toThrowError(new Error('Validator not implemented'));
  });
});
