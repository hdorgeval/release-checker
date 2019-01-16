import { checkers } from './checkers';
import { Checker } from './checkers/common/checker-interface';
import { all, filter, runChecker } from './checkers/common/utils';
import { ejectSensitiveData } from './checkers/sensitive-data-checker/index';
import { getCliOptions } from './cli-options/cli-options-parser';
import { ciReporter } from './reporters/ci-reporter/index';
export function run() {
  const options = getCliOptions();
  if (options['--help']) {
    ciReporter.reportUsage();
    return;
  }

  if (options['--customize-sensitivedata']) {
    ejectSensitiveData();
    return;
  }

  ciReporter.reportIntro();

  const checkersToRun: Array<Partial<Checker>> = filter(checkers).from(options);
  checkersToRun.forEach(runChecker);

  if (all(checkersToRun).hasPassed()) {
    ciReporter.reportValidationWarningsOf(checkersToRun);
    return;
  }

  ciReporter.reportValidationWarningsOf(checkersToRun);
  ciReporter.reportValidationErrorsOf(checkersToRun);
  process.exit(1);
}
