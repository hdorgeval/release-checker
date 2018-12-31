import { Validator } from '../../validators/common/validator-interface';
import { ciReporter } from './index';

test('It should show validation errors` ', () => {
  // Given
  const error1 = { reason: 'error 1 from validator2' };
  const error2 = { reason: 'error 1 from validator3' };
  const error3 = { reason: 'error 2 from validator3' };
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
  ciReporter.reportValidationErrorsOf(validators);

  // Then
  expect(output.length).toBe(5);
  expect(output[1]).toContain('ERRORS');
  expect(output[2]).toContain(error1.reason);
  expect(output[3]).toContain(error2.reason);
  expect(output[4]).toContain(error3.reason);
});
