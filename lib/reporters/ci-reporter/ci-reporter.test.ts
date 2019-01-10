import { ValidationError, ValidationWarning, Validator } from '../../validators/common/validator-interface';
import { ciReporter } from './index';

test('It should show validation errors` ', () => {
  // Given
  const error1: ValidationError = { reason: 'error 1 from validator2', severity: 'error' };
  const error2: ValidationError = { reason: 'error 1 from validator3', severity: 'error' };
  const error3: ValidationError = { reason: 'error 2 from validator3', severity: 'error' };
  const warning4: ValidationWarning = { reason: 'warning from validator4', severity: 'warning' };
  const validator1: Partial<Validator> = { hasErrors: false };
  const validator2: Partial<Validator> = { hasErrors: true, errors: [error1] };
  const validator3: Partial<Validator> = {
    errors: [error2, error3],
    hasErrors: true,
  };
  const validator4: Partial<Validator> = { hasErrors: false, hasWarnings: true, warnings: [warning4] };

  const validators = [validator1, validator2, validator3, validator4];

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  ciReporter.reportValidationErrorsOf(validators);

  // Then
  expect(output.length).toBe(5);
  expect(output[1]).toContain('ERRORS');
  expect(output[2]).toContain(error1.reason);
  expect(output[3]).toContain(error2.reason);
  expect(output[4]).toContain(error3.reason);
});

test('It should show validation warnings` ', () => {
  // Given
  const warning1: ValidationWarning = { reason: 'warning from validator2', severity: 'warning' };
  const warning2: ValidationWarning = { reason: 'warning 1 from validator3', severity: 'warning' };
  const warning3: ValidationWarning = { reason: 'warning 2 from validator3', severity: 'warning' };
  const warning4: ValidationWarning = { reason: 'warning from validator4', severity: 'warning' };
  const error1: ValidationError = { reason: 'warning from validator4', severity: 'error' };
  const validator1: Partial<Validator> = { hasWarnings: false, hasErrors: true };
  const validator2: Partial<Validator> = { hasWarnings: true, warnings: [warning1] };
  const validator3: Partial<Validator> = { hasWarnings: true, warnings: [warning2, warning3] };
  const validator4: Partial<Validator> = { hasErrors: true, hasWarnings: true, errors: [error1], warnings: [warning4] };

  const validators = [validator1, validator2, validator3, validator4];

  // When
  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  ciReporter.reportValidationWarningsOf(validators);

  // Then
  expect(output.length).toBe(6);
  expect(output[1]).toContain('WARNINGS');
  expect(output[2]).toContain(warning1.reason);
  expect(output[3]).toContain(warning2.reason);
  expect(output[4]).toContain(warning3.reason);
  expect(output[5]).toContain(warning4.reason);
});
