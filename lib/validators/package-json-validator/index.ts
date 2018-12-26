import { ValidationError, Validator } from '../common/validator-interface';

export const packageJsonValidator: Partial<Validator> = {
  canRun: () => true,
  id: 'package-json-validator',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking that package.json file exists and is valid',
};

function validate(): ValidationError[] {
  throw new Error('Validator not implemented');
}
