import { ensureThat, jsonPackage, read } from '../../utils/read-package-json';
import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';

export const packageJsonChecker: Partial<Checker> = {
  canRun: () => true,
  cliOption: '--package.json',
  id: 'package-json-checker',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking that package.json file exists and is valid',
};

function validate(): Array<ValidationError | ValidationWarning> {
  const validationsErrorsAndWarnings = [];
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
    validationsErrorsAndWarnings.push({
      reason: 'package.json has no name defined',
      severity: 'error',
    } as ValidationError);
  }

  if (pkg.version === undefined) {
    validationsErrorsAndWarnings.push({
      reason: 'package.json has no version defined',
      severity: 'error',
    } as ValidationError);
  }

  warnOnPrepublishScript(validationsErrorsAndWarnings);

  return validationsErrorsAndWarnings;
}

export function warnOnPrepublishScript(validationErrorsAndWarnings: Array<ValidationError | ValidationWarning>): void {
  const currentFolder = process.cwd();
  if (
    jsonPackage()
      .inDirectory(currentFolder)
      .hasScript('prepublish')
  ) {
    validationErrorsAndWarnings.push({
      reason: 'Consider to rename the "prepublish" script in package.json to "prepublishOnly"',
      severity: 'warning',
    });
  }
}
