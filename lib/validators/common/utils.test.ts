import { ensureThatValidator } from './utils';
import { Validator } from './validator-interface';

describe('Validators utils', () => {
  test('It should not throw an error when validator has the `canRun` method defined that returns true` ', () => {
    // Given
    const validator: Partial<Validator> = {
      canRun: () => true,
    };

    // When
    // Then
    expect(() => ensureThatValidator(validator).canRun()).not.toThrow();
  });

  test('It should throw an error when validator has `canRun` method undefined` ', () => {
    // Given
    const validator: Partial<Validator> = { canRun: undefined, id: 'validaotr-id' };
    const methodName = 'canRun';
    // When
    // Then
    expect(() => ensureThatValidator(validator).canRun()).toThrow(
      new Error(`Missing method ${methodName}() in Validator '${validator.id}'`),
    );
  });
});
