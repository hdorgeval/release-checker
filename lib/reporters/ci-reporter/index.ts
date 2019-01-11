import { Checker } from '../../checkers/common/checker-interface';
import { usage } from '../../cli-options/usage';
import { extractFirstLineOf } from '../common/extract-first-line-of';
import { Reporter } from '../common/reporter-interface';

export const ciReporter: Reporter = {
  name: 'ci',
  reportErrorStatusFor,
  reportIntro,
  reportSuccessStatusFor,
  reportUsage,
  reportValidationErrorsOf,
  reportValidationWarningsOf,
  reportWarningStatusFor,
};

function reportUsage() {
  // tslint:disable-next-line:no-console
  console.log(usage);
}

function reportIntro() {
  // tslint:disable-next-line:no-console
  console.log('');
  // tslint:disable-next-line:no-console
  console.log('Running validations ...');
  // tslint:disable-next-line:no-console
  console.log('');
}

function reportValidationErrorsOf(checkers: Array<Partial<Checker>>) {
  // tslint:disable-next-line:no-console
  console.log('');
  // tslint:disable-next-line:no-console
  console.log('ERRORS:');

  checkers.forEach((checker) => {
    checker.errors = checker.errors || [];
    checker.errors.forEach((validationError) => {
      // tslint:disable-next-line:no-console
      console.log(`  * ${extractFirstLineOf(validationError.reason)}`);
    });
  });
}

function reportValidationWarningsOf(checkers: Array<Partial<Checker>>) {
  // prettier-ignore
  const hasNoWarning = checkers
    .filter((checker) => checker.hasWarnings)
    .length === 0;

  if (hasNoWarning) {
    return;
  }

  // tslint:disable-next-line:no-console
  console.log('');
  // tslint:disable-next-line:no-console
  console.log('WARNINGS:');

  checkers.forEach((checker) => {
    checker.warnings = checker.warnings || [];
    checker.warnings.forEach((validationWarning) => {
      // tslint:disable-next-line:no-console
      console.log(`  * ${extractFirstLineOf(validationWarning.reason)}`);
    });
  });
}

function reportWarningStatusFor(checker: Partial<Checker>) {
  // tslint:disable-next-line:no-console
  console.log(`[!] ${checker.statusToDisplayWhileValidating}`);
}

function reportErrorStatusFor(checker: Partial<Checker>) {
  // tslint:disable-next-line:no-console
  console.log(`[x] ${checker.statusToDisplayWhileValidating}`);
}

function reportSuccessStatusFor(checker: Partial<Checker>) {
  // tslint:disable-next-line:no-console
  console.log(`[v] ${checker.statusToDisplayWhileValidating}`);
}
