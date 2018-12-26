import { allKeysAreUndefindIn, getCliOptions } from './cli-options/cli-options-parser';
import { usage } from './cli-options/usage';
import * as validators from './validators';
import { all, runValidator, showValidationErrorsOf } from './validators/common/utils';
import { Validator } from './validators/common/validator-interface';
export function run() {
  const options = getCliOptions();
  if (allKeysAreUndefindIn(options) || options['--help']) {
    // tslint:disable-next-line:no-console
    console.log(usage);
    return;
  }

  // tslint:disable-next-line:no-console
  console.log('');
  // tslint:disable-next-line:no-console
  console.log('Running validations ...');
  // tslint:disable-next-line:no-console
  console.log('');

  // tslint:disable-next-line:no-console
  const validatorsToRun: Array<Partial<Validator>> = [];
  validatorsToRun.push(validators.packageJsonValidator);

  validatorsToRun.forEach(runValidator);

  if (all(validatorsToRun).hasPassed()) {
    return;
  }

  // tslint:disable-next-line:no-console
  console.log('');
  // tslint:disable-next-line:no-console
  console.log('ERRORS:');

  showValidationErrorsOf(validatorsToRun);
  process.exit(1);
}
