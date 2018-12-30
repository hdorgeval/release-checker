import { getCliOptions } from './cli-options/cli-options-parser';
import { usage } from './cli-options/usage';
import { validators } from './validators';
import { all, filter, runValidator, showValidationErrorsOf } from './validators/common/utils';
import { Validator } from './validators/common/validator-interface';
export function run() {
  const options = getCliOptions();
  if (options['--help']) {
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

  const validatorsToRun: Array<Partial<Validator>> = filter(validators).from(options);
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
