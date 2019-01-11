import { getCliOptions } from './cli-options/cli-options-parser';
import { ciReporter } from './reporters/ci-reporter/index';
import { validators } from './validators';
import { Checker } from './validators/common/checker-interface';
import { all, filter, runValidator } from './validators/common/utils';
export function run() {
  const options = getCliOptions();
  if (options['--help']) {
    ciReporter.reportUsage();
    return;
  }

  ciReporter.reportIntro();

  const validatorsToRun: Array<Partial<Checker>> = filter(validators).from(options);
  validatorsToRun.forEach(runValidator);

  if (all(validatorsToRun).hasPassed()) {
    ciReporter.reportValidationWarningsOf(validatorsToRun);
    return;
  }

  ciReporter.reportValidationWarningsOf(validatorsToRun);
  ciReporter.reportValidationErrorsOf(validatorsToRun);
  process.exit(1);
}
