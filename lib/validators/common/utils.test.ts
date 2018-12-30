import { ReleaseCheckerOptions } from '../../cli-options/cli-options-parser';
import {
  all,
  ensureThatValidator,
  filter,
  runValidator,
  setCatchedError,
  setErrors,
  showValidationErrorsOf,
} from './utils';
import { Validator } from './validator-interface';

test('It should not throw an error when validator has a `canRun` method defined that returns true` ', () => {
  // Given
  const validator: Partial<Validator> = {
    canRun: () => true,
    run: () => [],
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
  const validator: Partial<Validator> = { canRun: undefined, id: 'validator-id' };
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

test('It should inject validation errors in validator` ', () => {
  // Given
  const validator: Partial<Validator> = { canRun: () => false, hasErrors: false };
  const error1 = { reason: 'error 1 from validator' };
  const error2 = { reason: 'error 2 from validator' };
  const error3 = { reason: 'error 3 from validator' };
  const validationErrors = [error1, error2, error3];

  // When
  setErrors(validationErrors).in(validator);

  // Then
  expect(validator.errors).toBeDefined();
  expect(validator.hasErrors).toBe(true);
  expect(Array.isArray(validator.errors)).toBe(true);
  expect(validator.errors && validator.errors.length).toBe(3);
  expect(validator.errors && validator.errors[0]).toEqual(error1);
  expect(validator.errors && validator.errors[1]).toEqual(error2);
  expect(validator.errors && validator.errors[2]).toEqual(error3);
});

test('It should inject catched errors in validator` ', () => {
  // Given
  const validator: Partial<Validator> = { canRun: () => false, hasErrors: false };
  const error = new Error('error 1 from validator');
  const validationerrorFromError = {
    reason: error.message,
  };

  // When
  setCatchedError(error).in(validator);

  // Then
  expect(validator.errors).toBeDefined();
  expect(validator.hasErrors).toBe(true);
  expect(Array.isArray(validator.errors)).toBe(true);
  expect(validator.errors && validator.errors.length).toBe(1);
  expect(validator.errors && validator.errors[0]).toEqual(validationerrorFromError);
});

test('It should run validator with success when validator returns no error` ', () => {
  // Given
  const validator: Partial<Validator> = {
    canRun: () => true,
    hasErrors: false,
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runValidator(validator);

  // Then
  expect(validator.hasErrors).toBe(false);
  expect(output[0]).toContain(`[v] ${validator.statusToDisplayWhileValidating}`);
});

test('It should run validator with failure when validator has no run method` ', () => {
  // Given
  const validator: Partial<Validator> = {
    canRun: () => true,
    hasErrors: false,
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runValidator(validator);

  // Then
  expect(validator.hasErrors).toBe(true);
  expect(output[0]).toContain(`[x] ${validator.statusToDisplayWhileValidating}`);
});

test('It should run validator with failure when validator returns a validation error` ', () => {
  // Given
  const error1 = { reason: 'error 1 from validator' };
  const validator: Partial<Validator> = {
    canRun: () => true,
    hasErrors: false,
    run: () => [error1],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runValidator(validator);

  // Then
  expect(validator.hasErrors).toBe(true);
  expect(Array.isArray(validator.errors)).toBe(true);
  expect(validator.errors && validator.errors.length).toBe(1);
  expect(validator.errors && validator.errors[0]).toEqual(error1);
  expect(output[0]).toContain(`[x] ${validator.statusToDisplayWhileValidating}`);
});

test('It should run validator with failure when validator throws an unexpected error` ', () => {
  // Given
  const validator: Partial<Validator> = {
    canRun: () => true,
    hasErrors: false,
    run: () => {
      throw new Error('unexpected error from validator');
    },
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runValidator(validator);

  // Then
  expect(validator.hasErrors).toBe(true);
  expect(Array.isArray(validator.errors)).toBe(true);
  expect(validator.errors && validator.errors.length).toBe(1);
  expect(validator.errors && validator.errors[0]).toEqual({ reason: 'unexpected error from validator' });
  expect(output[0]).toContain(`[x] ${validator.statusToDisplayWhileValidating}`);
});

test('It should filter validators from command-line options` ', () => {
  // Given
  const validator1: Partial<Validator> = { hasErrors: false, cliOption: '--opt1' };
  const validator2: Partial<Validator> = { hasErrors: false };

  const validators = [validator1, validator2];
  const options: ReleaseCheckerOptions = {
    '--help': false,
    '--opt1': true,
    '--package.json': true,
  };

  // When
  const result = filter(validators).from(options);

  // Then
  expect(result.length).toBe(1);
  expect(result[0]).toEqual(validator1);
});
