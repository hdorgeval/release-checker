import { all, ensureThatValidator } from './utils';
import { Validator } from './validator-interface';

describe('Validators utils', () => {
  test('It should not throw an error when validator has a `canRun` method defined that returns true` ', () => {
    // Given
    const validator: Partial<Validator> = {
      canRun: () => true,
    };

    // When
    // Then
    expect(() => ensureThatValidator(validator).canRun()).not.toThrow();
  });

  test('It should throw an error when validator has a `canRun` method defined that returns false and has a method whyCannotRun` ', () => {
    // Given
    const validator: Partial<Validator> = { canRun: () => false, whyCannotRun: () => 'Cannot do this because of that' };

    // When
    // Then
    expect(() => ensureThatValidator(validator).canRun()).toThrow(
      new Error(`${validator.whyCannotRun && validator.whyCannotRun()}`),
    );
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

  test('It should check if all validators has passed` ', () => {
    // Given
    const validator1: Partial<Validator> = { hasErrors: false };
    const validator2: Partial<Validator> = { hasErrors: false };
    const validator3: Partial<Validator> = { hasErrors: false };
    const validator4: Partial<Validator> = { hasErrors: false };
    const validators = [validator1, validator2, validator3, validator4];

    // When
    const result = all(validators).hasPassed();

    // Then
    expect(result).toBe(true);
  });

  test('It should detect that one validator has failed` ', () => {
    // Given
    const validator1: Partial<Validator> = { hasErrors: false };
    const validator2: Partial<Validator> = { hasErrors: false };
    const validator3: Partial<Validator> = { hasErrors: true };
    const validator4: Partial<Validator> = { hasErrors: false };
    const validators = [validator1, validator2, validator3, validator4];

    // When
    const result = all(validators).hasPassed();

    // Then
    expect(result).toBe(false);
  });
});
