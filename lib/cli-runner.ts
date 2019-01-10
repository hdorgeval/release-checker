import { getCliOptions } from './cli-options/cli-options-parser';
import { ciReporter } from './reporters/ci-reporter/index';
import { validators } from './validators';
import { all, filter, runValidator } from './validators/common/utils';
import { Validator } from './validators/common/validator-interface';
export function run() {
  const options = getCliOptions();
  if (options['--help']) {
    ciReporter.reportUsage();
    return;
  }

  ciReporter.reportIntro();

  const validatorsToRun: Array<Partial<Validator>> = filter(validators).from(options);
  validatorsToRun.forEach(runValidator);

  if (all(validatorsToRun).hasPassed()) {
    ciReporter.reportValidationWarningsOf(validatorsToRun);
    return;
  }

  ciReporter.reportValidationWarningsOf(validatorsToRun);
  ciReporter.reportValidationErrorsOf(validatorsToRun);
  process.exit(1);
}
