import { ReleaseCheckerOptions } from '../../cli-options/cli-options-parser';
import { Checker, ValidationError, ValidationWarning } from './checker-interface';
import { all, ensureThatChecker, filter, runChecker, setCatchedError, setErrors, setWarnings } from './utils';

test('It should not throw an error when checker has a `canRun` method defined that returns true` ', () => {
  // Given
  const checker: Partial<Checker> = {
    canRun: () => true,
    run: () => [],
  };

  // When
  // Then
  expect(() => ensureThatChecker(checker).canRun()).not.toThrow();
});

test('It should throw an error when checker has a `canRun` method that returns false and has a method whyCannotRun` ', () => {
  // Given
  const checker: Partial<Checker> = { canRun: () => false, whyCannotRun: () => 'Cannot do this because of that' };

  // When
  // Then
  expect(() => ensureThatChecker(checker).canRun()).toThrow(
    new Error(`${checker.whyCannotRun && checker.whyCannotRun()}`),
  );
});

test('It should throw an error when checker has a `canRun` method that returns false but method `whyCannotRun` is undefined` ', () => {
  // Given
  const checker: Partial<Checker> = { canRun: () => false };

  // When
  // Then
  expect(() => ensureThatChecker(checker).canRun()).toThrow(new Error("Missing method whyCannotRun() in Checker '{}'"));
});

test('It should throw an error when checker has `canRun` method undefined` ', () => {
  // Given
  const checker: Partial<Checker> = { canRun: undefined, id: 'checker-id' };
  const methodName = 'canRun';
  // When
  // Then
  expect(() => ensureThatChecker(checker).canRun()).toThrow(
    new Error(`Missing method ${methodName}() in Checker '${checker.id}'`),
  );
});

test('It should determine that all checkers has passed` ', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false };
  const checker2: Partial<Checker> = { hasErrors: false };
  const checker3: Partial<Checker> = { hasErrors: false };
  const checker4: Partial<Checker> = { hasErrors: false };
  const checker5: Partial<Checker> = { hasErrors: false, hasWarnings: true };
  const checkers = [checker1, checker2, checker3, checker4, checker5];

  // When
  const result = all(checkers).hasPassed();

  // Then
  expect(result).toBe(true);
});

test('It should pass when there are only warnings` ', () => {
  // Given
  const validator1: Partial<Checker> = { hasWarnings: true };
  const validator2: Partial<Checker> = { hasWarnings: true };
  const validator3: Partial<Checker> = { hasWarnings: true };
  const validators = [validator1, validator2, validator3];

  // When
  const result = all(validators).hasPassed();

  // Then
  expect(result).toBe(true);
});

test('It should detect that one validator has failed` ', () => {
  // Given
  const validator1: Partial<Checker> = { hasErrors: false };
  const validator2: Partial<Checker> = { hasErrors: false };
  const validator3: Partial<Checker> = { hasErrors: true };
  const validator4: Partial<Checker> = { hasErrors: false };
  const validators = [validator1, validator2, validator3, validator4];

  // When
  const result = all(validators).hasPassed();

  // Then
  expect(result).toBe(false);
});

test('It should inject validation errors in validator` ', () => {
  // Given
  const validator: Partial<Checker> = { canRun: () => false, hasErrors: false };
  const error1: ValidationError = { reason: 'error 1 from validator', severity: 'error' };
  const error2: ValidationError = { reason: 'error 2 from validator', severity: 'error' };
  const error3: ValidationError = { reason: 'error 3 from validator', severity: 'error' };
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

test('It should inject validation warnings in validator` ', () => {
  // Given
  const validator: Partial<Checker> = { canRun: () => false, hasErrors: false };
  const warning1: ValidationWarning = { reason: 'error 1 from validator', severity: 'warning' };
  const warning2: ValidationWarning = { reason: 'error 2 from validator', severity: 'warning' };
  const warning3: ValidationWarning = { reason: 'error 3 from validator', severity: 'warning' };
  const validationWarnings = [warning1, warning2, warning3];

  // When
  setWarnings(validationWarnings).in(validator);

  // Then
  expect(validator.errors).toBeUndefined();
  expect(validator.warnings).toBeDefined();
  expect(validator.hasErrors).toBe(false);
  expect(validator.hasWarnings).toBe(true);
  expect(Array.isArray(validator.warnings)).toBe(true);
  expect(validator.warnings && validator.warnings.length).toBe(3);
  expect(validator.warnings && validator.warnings[0]).toEqual(warning1);
  expect(validator.warnings && validator.warnings[1]).toEqual(warning2);
  expect(validator.warnings && validator.warnings[2]).toEqual(warning3);
});

test('It should inject catched errors in validator` ', () => {
  // Given
  const validator: Partial<Checker> = { canRun: () => false, hasErrors: false };
  const error = new Error('error 1 from validator');
  const validationerrorFromError: ValidationError = {
    reason: error.message,
    severity: 'error',
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
  const validator: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(validator);

  // Then
  expect(validator.hasErrors).toBe(false);
  expect(output[0]).toContain(`[v] ${validator.statusToDisplayWhileValidating}`);
});

test('It should run validator with warning when validator has no run method` ', () => {
  // Given
  const validator: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(validator);

  // Then
  expect(validator.hasErrors).toBe(false);
  expect(validator.hasWarnings).toBe(true);
  expect(output[0]).toContain(`[!] ${validator.statusToDisplayWhileValidating}`);
});

test('It should run validator with failure when validator returns a validation error` ', () => {
  // Given
  const error1: ValidationError = { reason: 'error 1 from validator', severity: 'error' };
  const validator: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    run: () => [error1],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(validator);

  // Then
  expect(validator.hasErrors).toBe(true);
  expect(Array.isArray(validator.errors)).toBe(true);
  expect(validator.errors && validator.errors.length).toBe(1);
  expect(validator.errors && validator.errors[0]).toEqual(error1);
  expect(output[0]).toContain(`[x] ${validator.statusToDisplayWhileValidating}`);
});

test('It should run validator with warning when validator returns a validation warning` ', () => {
  // Given
  const warning1: ValidationWarning = { reason: 'error 1 from validator', severity: 'warning' };
  const validator: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    run: () => [warning1],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(validator);

  // Then
  expect(validator.hasErrors).toBe(false);
  expect(validator.hasWarnings).toBe(true);
  expect(Array.isArray(validator.errors)).toBe(true);
  expect(Array.isArray(validator.warnings)).toBe(true);
  expect(validator.errors && validator.errors.length).toBe(0);
  expect(validator.warnings && validator.warnings.length).toBe(1);
  expect(validator.warnings && validator.warnings[0]).toEqual(warning1);
  expect(output[0]).toContain(`[!] ${validator.statusToDisplayWhileValidating}`);
});

test('It should run validator with failure when validator throws an unexpected error` ', () => {
  // Given
  const validator: Partial<Checker> = {
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
  runChecker(validator);

  // Then
  const expectedValidationError: ValidationError = { reason: 'unexpected error from validator', severity: 'error' };
  expect(validator.hasErrors).toBe(true);
  expect(Array.isArray(validator.errors)).toBe(true);
  expect(validator.errors && validator.errors.length).toBe(1);
  expect(validator.errors && validator.errors[0]).toEqual(expectedValidationError);
  expect(output[0]).toContain(`[x] ${validator.statusToDisplayWhileValidating}`);
});

test('It should filter validators from command-line options` ', () => {
  // Given
  const validator1: Partial<Checker> = { hasErrors: false, cliOption: '--opt1' };
  const validator2: Partial<Checker> = { hasErrors: false };

  const validators = [validator1, validator2];
  const options: ReleaseCheckerOptions = {
    '--help': false,
    '--opt1': true,
    '--package.json': true,
    '--test': true,
  };

  // When
  const result = filter(validators).from(options);

  // Then
  expect(result.length).toBe(1);
  expect(result[0]).toEqual(validator1);
});
