import { ensureThat, read } from '../../utils/read-package-json';
import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';

export const packageJsonValidator: Partial<Checker> = {
  canRun: () => true,
  cliOption: '--package.json',
  id: 'package-json-validator',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking that package.json file exists and is valid',
};

function validate(): Array<ValidationError | ValidationWarning> {
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
    validationsErrors.push({ reason: 'package.json has no name defined', severity: 'error' } as ValidationError);
  }

  if (pkg.version === undefined) {
    validationsErrors.push({ reason: 'package.json has no version defined', severity: 'error' } as ValidationError);
  }

  return validationsErrors;
}
