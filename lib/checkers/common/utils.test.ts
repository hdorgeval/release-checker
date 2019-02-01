import { no, ReleaseCheckerOptions } from '../../cli-options/cli-options-parser';
import { Checker, ValidationError, ValidationWarning } from './checker-interface';
import {
  all,
  ensureThatChecker,
  filter,
  getShortSyntaxOfCliOption,
  runChecker,
  setCatchedError,
  setErrors,
  setWarnings,
  should,
} from './utils';

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

test('It should throw an error when checker has a `canRun()` method that returns false and has a method whyCannotRun()', () => {
  // Given
  const checker: Partial<Checker> = { canRun: () => false, whyCannotRun: () => 'Cannot do this because of that' };

  // When
  // Then
  expect(() => ensureThatChecker(checker).canRun()).toThrow(
    new Error(`${checker.whyCannotRun && checker.whyCannotRun()}`),
  );
});

test('It should throw an error when checker has a `canRun()` method that returns false but method `whyCannotRun()` is undefined', () => {
  // Given
  const checker: Partial<Checker> = { canRun: () => false };

  // When
  // Then
  expect(() => ensureThatChecker(checker).canRun()).toThrow(new Error("Missing method whyCannotRun() in Checker '{}'"));
});

test('It should throw an error when checker has `canRun()` method undefined', () => {
  // Given
  const checker: Partial<Checker> = { canRun: undefined, id: 'checker-id' };
  const methodName = 'canRun';
  // When
  // Then
  expect(() => ensureThatChecker(checker).canRun()).toThrow(
    new Error(`Missing method ${methodName}() in Checker '${checker.id}'`),
  );
});

test('It should determine that all checkers has passed', () => {
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

test('It should pass when there are only warnings', () => {
  // Given
  const checker1: Partial<Checker> = { hasWarnings: true };
  const checker2: Partial<Checker> = { hasWarnings: true };
  const checker3: Partial<Checker> = { hasWarnings: true };
  const checkers = [checker1, checker2, checker3];

  // When
  const result = all(checkers).hasPassed();

  // Then
  expect(result).toBe(true);
});

test('It should detect that one checker has failed', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false };
  const checker2: Partial<Checker> = { hasErrors: false };
  const checker3: Partial<Checker> = { hasErrors: true };
  const checker4: Partial<Checker> = { hasErrors: false, hasWarnings: true };
  const checkers = [checker1, checker2, checker3, checker4];

  // When
  const result = all(checkers).hasPassed();

  // Then
  expect(result).toBe(false);
});

test('It should inject validation errors in checker', () => {
  // Given
  const checker: Partial<Checker> = { canRun: () => false, hasErrors: false };
  const error1: ValidationError = { reason: 'error 1 from checker', severity: 'error' };
  const error2: ValidationError = { reason: 'error 2 from checker', severity: 'error' };
  const error3: ValidationError = { reason: 'error 3 from checker', severity: 'error' };
  const validationErrors = [error1, error2, error3];

  // When
  setErrors(validationErrors).in(checker);

  // Then
  expect(checker.errors).toBeDefined();
  expect(checker.hasErrors).toBe(true);
  expect(Array.isArray(checker.errors)).toBe(true);
  expect(checker.errors && checker.errors.length).toBe(3);
  expect(checker.errors && checker.errors[0]).toEqual(error1);
  expect(checker.errors && checker.errors[1]).toEqual(error2);
  expect(checker.errors && checker.errors[2]).toEqual(error3);
});

test('It should inject validation warnings in checker', () => {
  // Given
  const checker: Partial<Checker> = { canRun: () => false, hasErrors: false };
  const warning1: ValidationWarning = { reason: 'error 1 from checker', severity: 'warning' };
  const warning2: ValidationWarning = { reason: 'error 2 from checker', severity: 'warning' };
  const warning3: ValidationWarning = { reason: 'error 3 from checker', severity: 'warning' };
  const validationWarnings = [warning1, warning2, warning3];

  // When
  setWarnings(validationWarnings).in(checker);

  // Then
  expect(checker.errors).toBeUndefined();
  expect(checker.warnings).toBeDefined();
  expect(checker.hasErrors).toBe(false);
  expect(checker.hasWarnings).toBe(true);
  expect(Array.isArray(checker.warnings)).toBe(true);
  expect(checker.warnings && checker.warnings.length).toBe(3);
  expect(checker.warnings && checker.warnings[0]).toEqual(warning1);
  expect(checker.warnings && checker.warnings[1]).toEqual(warning2);
  expect(checker.warnings && checker.warnings[2]).toEqual(warning3);
});

test('It should inject catched errors in checker', () => {
  // Given
  const checker: Partial<Checker> = { canRun: () => false, hasErrors: false };
  const error = new Error('error 1 from checker');
  const validationerrorFromError: ValidationError = {
    reason: error.message,
    severity: 'error',
  };

  // When
  setCatchedError(error).in(checker);

  // Then
  expect(checker.errors).toBeDefined();
  expect(checker.hasErrors).toBe(true);
  expect(Array.isArray(checker.errors)).toBe(true);
  expect(checker.errors && checker.errors.length).toBe(1);
  expect(checker.errors && checker.errors[0]).toEqual(validationerrorFromError);
});

test('It should run checker with success when checker returns no validation error', () => {
  // Given
  const checker: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(checker);

  // Then
  expect(checker.hasErrors).toBe(false);
  expect(output[0]).toContain(`[v] ${checker.statusToDisplayWhileValidating}`);
});

test('It should run checker with warning when checker has no `run()` method', () => {
  // Given
  const checker: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(checker);

  // Then
  expect(checker.hasErrors).toBe(false);
  expect(checker.hasWarnings).toBe(true);
  expect(output[0]).toContain(`[!] ${checker.statusToDisplayWhileValidating}`);
});

test('It should run checker with failure when checker returns a validation error', () => {
  // Given
  const error1: ValidationError = { reason: 'error 1 from checker', severity: 'error' };
  const checker: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    run: () => [error1],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(checker);

  // Then
  expect(checker.hasErrors).toBe(true);
  expect(Array.isArray(checker.errors)).toBe(true);
  expect(checker.errors && checker.errors.length).toBe(1);
  expect(checker.errors && checker.errors[0]).toEqual(error1);
  expect(output[0]).toContain(`[x] ${checker.statusToDisplayWhileValidating}`);
});

test('It should run checker with warning when checker returns a validation warning', () => {
  // Given
  const warning1: ValidationWarning = { reason: 'error 1 from checker', severity: 'warning' };
  const checker: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    run: () => [warning1],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(checker);

  // Then
  expect(checker.hasErrors).toBe(false);
  expect(checker.hasWarnings).toBe(true);
  expect(Array.isArray(checker.errors)).toBe(true);
  expect(Array.isArray(checker.warnings)).toBe(true);
  expect(checker.errors && checker.errors.length).toBe(0);
  expect(checker.warnings && checker.warnings.length).toBe(1);
  expect(checker.warnings && checker.warnings[0]).toEqual(warning1);
  expect(output[0]).toContain(`[!] ${checker.statusToDisplayWhileValidating}`);
});

test('It should run checker with warning when checker cannot run', () => {
  // Given
  const checker: Partial<Checker> = {
    canRun: () => false,
    hasErrors: false,
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is bar',
    whyCannotRun: () => 'Checker cannot run because this and that',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(checker);

  // Then
  const expectedWarning: ValidationWarning = { reason: checker.whyCannotRun!(), severity: 'warning' };
  expect(checker.hasErrors).toBe(false);
  expect(checker.hasWarnings).toBe(true);
  expect(Array.isArray(checker.errors)).toBe(false);
  expect(Array.isArray(checker.warnings)).toBe(true);
  expect(checker.warnings && checker.warnings.length).toBe(1);
  expect(checker.warnings && checker.warnings[0]).toEqual(expectedWarning);
  expect(output[0]).toContain(`[!] ${checker.statusToDisplayWhileValidating}`);
});

test('It should run checker with failure when checker throws an unexpected error', () => {
  // Given
  const checker: Partial<Checker> = {
    canRun: () => true,
    hasErrors: false,
    run: () => {
      throw new Error('unexpected error from checker');
    },
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  runChecker(checker);

  // Then
  const expectedValidationError: ValidationError = { reason: 'unexpected error from checker', severity: 'error' };
  expect(checker.hasErrors).toBe(true);
  expect(Array.isArray(checker.errors)).toBe(true);
  expect(checker.errors && checker.errors.length).toBe(1);
  expect(checker.errors && checker.errors[0]).toEqual(expectedValidationError);
  expect(output[0]).toContain(`[x] ${checker.statusToDisplayWhileValidating}`);
});

test('It should filter checkers from command-line options', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false, cliOption: '--opt1' };
  const checker2: Partial<Checker> = { hasErrors: false };
  const checker3: Partial<Checker> = { hasErrors: false, cliOption: '--opt2' };

  const checkers = [checker1, checker2, checker3];
  const options: Partial<ReleaseCheckerOptions> = {
    '--help': false,
    '--opt1': true,
    '--opt2': true,
    '--package.json': true,
    '--sensitivedata': false,
    '--test': true,
  };

  // When
  const result = filter(checkers).from(options);

  // Then
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(checker1);
  expect(result[1]).toEqual(checker3);
});

test('It should take all checkers when there is no option on the command-line', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false, cliOption: '--foo' };
  const checker2: Partial<Checker> = { hasErrors: false, cliOption: '--bar' };

  const checkers = [checker1, checker2];
  const options: ReleaseCheckerOptions = {
    '--bar': false,
    '--branch': false,
    '--customize-sensitivedata': false,
    '--foo': false,
    '--help': false,
    '--package.json': true,
    '--sensitivedata': false,
    '--tag': false,
    '--test': false,
    '--uncommited-files': false,
    '--untracked-files': false,
  };

  // When
  const result = filter(checkers).from(options);

  // Then
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(checker1);
  expect(result[1]).toEqual(checker2);
});

test("It should get short syntax of checker's cli option", () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false, cliOption: '--foo' };
  const checker2: Partial<Checker> = { hasErrors: false, cliOption: '--bar' };
  const checker3: Partial<Checker> = { hasErrors: false, cliOption: '--foo-bar' };
  const checker4: Partial<Checker> = { hasErrors: false, cliOption: '-f' };

  // When
  const result1 = getShortSyntaxOfCliOption(checker1.cliOption);
  const result2 = getShortSyntaxOfCliOption(checker2.cliOption);
  const result3 = getShortSyntaxOfCliOption(checker3.cliOption);
  const result4 = getShortSyntaxOfCliOption(checker4.cliOption);

  // Then
  expect(result1).toBe('-f');
  expect(result2).toBe('-b');
  expect(result3).toBe('-f');
  expect(result4).toBe('-f');
});

test('It should skip foo checker on --skip-foo', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false, cliOption: '--foo' };
  const options: ReleaseCheckerOptions = {
    '--branch': false,
    '--customize-sensitivedata': false,
    '--foo': false,
    '--help': false,
    '--package.json': true,
    '--sensitivedata': false,
    '--skip-foo': true,
    '--tag': false,
    '--test': false,
    '--uncommited-files': false,
    '--untracked-files': false,
  };

  // When
  const cliHasNoOption = no(options).hasBeenSet();
  const result = should(checker1).beSkipped(options);

  // Then
  expect(cliHasNoOption).toBe(true);
  expect(result).toBe(true);
});

test('It should skip foo checker on --skip-f', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false, cliOption: '--foo', shortCliOption: '-f' };
  const options: ReleaseCheckerOptions = {
    '--branch': false,
    '--customize-sensitivedata': false,
    '--foo': false,
    '--help': false,
    '--package.json': true,
    '--sensitivedata': false,
    '--skip-f': true,
    '--tag': false,
    '--test': false,
    '--uncommited-files': false,
    '--untracked-files': false,
  };

  // When
  const cliHasNoOption = no(options).hasBeenSet();
  const result = should(checker1).beSkipped(options);

  // Then
  expect(cliHasNoOption).toBe(true);
  expect(result).toBe(true);
});

test('It should not skip a checker with no cli option defined', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false };
  const options: ReleaseCheckerOptions = {
    '--branch': false,
    '--customize-sensitivedata': false,
    '--foo': false,
    '--help': false,
    '--package.json': true,
    '--sensitivedata': false,
    '--skip-f': true,
    '--tag': false,
    '--test': false,
    '--uncommited-files': false,
    '--untracked-files': false,
  };

  // When
  const cliHasNoOption = no(options).hasBeenSet();
  const result = should(checker1).beSkipped(options);

  // Then
  expect(cliHasNoOption).toBe(true);
  expect(result).toBe(false);
});

test('It should not skip a checker with no short cli option defined', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false, cliOption: '--foo' };
  const options: ReleaseCheckerOptions = {
    '--branch': false,
    '--customize-sensitivedata': false,
    '--foo': false,
    '--help': false,
    '--package.json': true,
    '--sensitivedata': false,
    '--skip-f': true,
    '--tag': false,
    '--test': false,
    '--uncommited-files': false,
    '--untracked-files': false,
  };

  // When
  const cliHasNoOption = no(options).hasBeenSet();
  const result = should(checker1).beSkipped(options);

  // Then
  expect(cliHasNoOption).toBe(true);
  expect(result).toBe(false);
});

test('It should take all checkers except those that are skipped', () => {
  // Given
  const checker1: Partial<Checker> = { hasErrors: false, cliOption: '--foo' };
  const checker2: Partial<Checker> = { hasErrors: false, cliOption: '--bar' };
  const checker3: Partial<Checker> = { hasErrors: false, cliOption: '--foo-bar' };

  const checkers = [checker1, checker2, checker3];
  const options: ReleaseCheckerOptions = {
    '--bar': false,
    '--branch': false,
    '--customize-sensitivedata': false,
    '--foo': false,
    '--foo-bar': false,
    '--help': false,
    '--package.json': true,
    '--sensitivedata': false,
    '--skip-foo-bar': true,
    '--tag': false,
    '--test': false,
    '--uncommited-files': false,
    '--untracked-files': false,
  };

  // When
  const result = filter(checkers).from(options);

  // Then
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(checker1);
  expect(result[1]).toEqual(checker2);
});
