import { ensureThat, read } from '../../utils/read-package-json';
import { ValidationError, Validator } from '../common/validator-interface';

export const packageJsonValidator: Partial<Validator> = {
  canRun: () => true,
  cliOption: '--package.json',
  id: 'package-json-validator',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking that package.json file exists and is valid',
};

function validate(): ValidationError[] {
  const validationsErrors = [];
  ensureThat('package.json')
    .inDirectory(process.cwd())
    .canBeRead()
    .asString();

  ensureThat('package.json')
    .inDirectory(process.cwd())
    .canBeRead()
    .asJson();

  const pkg = read('package.json')
    .inDirectory(process.cwd())
    .asJson();

  if (pkg.name === undefined) {
    validationsErrors.push({ reason: 'package.json has no name defined' });
  }

  if (pkg.version === undefined) {
    validationsErrors.push({ reason: 'package.json has no version defined' });
  }

  return validationsErrors;
}
