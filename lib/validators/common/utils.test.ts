import { all, ensureThatValidator, showValidationErrorsOf } from './utils';
import { Validator } from './validator-interface';

test('It should not throw an error when validator has a `canRun` method defined that returns true` ', () => {
  // Given
  const validator: Partial<Validator> = {
    canRun: () => true,
  };

  // When
  // Then
  expect(() => ensureThatValidator(validator).canRun()).not.toThrow();
});

test('It should throw an error when validator has a `canRun` method that returns false and has a method whyCannotRun` ', () => {
  // Given
  const validator: Partial<Validator> = { canRun: () => false, whyCannotRun: () => 'Cannot do this because of that' };

  // When
  // Then
  expect(() => ensureThatValidator(validator).canRun()).toThrow(
    new Error(`${validator.whyCannotRun && validator.whyCannotRun()}`),
  );
});

test('It should throw an error when validator has a `canRun` method that returns false but method whyCannotRun is undefined` ', () => {
  // Given
  const validator: Partial<Validator> = { canRun: () => false };

  // When
  // Then
  expect(() => ensureThatValidator(validator).canRun()).toThrow(
    new Error("Missing method whyCannotRun() in Validator '{}'"),
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

test('It should show validation errors` ', () => {
  // Given
  const error1 = { reason: 'error 1 from validator2' };
  const error2 = { reason: 'error 2 from validator3' };
  const error3 = { reason: 'error 3 from validator3' };
  const validator1: Partial<Validator> = { hasErrors: false };
  const validator2: Partial<Validator> = { hasErrors: true, errors: [error1] };
  const validator3: Partial<Validator> = {
    errors: [error2, error3],
    hasErrors: true,
  };
  const validator4: Partial<Validator> = { hasErrors: false };
  const validators = [validator1, validator2, validator3, validator4];

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  showValidationErrorsOf(validators);

  // Then
  expect(output.length).toBe(3);
  expect(output[0]).toContain(error1.reason);
  expect(output[1]).toContain(error2.reason);
  expect(output[2]).toContain(error3.reason);
});
