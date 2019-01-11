import { validators } from './checkers';
import { Checker } from './checkers/common/checker-interface';
import { all, filter, runValidator } from './checkers/common/utils';
import { getCliOptions } from './cli-options/cli-options-parser';
import { ciReporter } from './reporters/ci-reporter/index';
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
