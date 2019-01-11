import { usage } from '../../cli-options/usage';
import { Checker } from '../../validators/common/checker-interface';
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

function reportValidationErrorsOf(validators: Array<Partial<Checker>>) {
  // tslint:disable-next-line:no-console
  console.log('');
  // tslint:disable-next-line:no-console
  console.log('ERRORS:');

  validators.forEach((validator) => {
    validator.errors = validator.errors || [];
    validator.errors.forEach((validationError) => {
      // tslint:disable-next-line:no-console
      console.log(`  * ${extractFirstLineOf(validationError.reason)}`);
    });
  });
}

function reportValidationWarningsOf(validators: Array<Partial<Checker>>) {
  // prettier-ignore
  const hasNoWarning = validators
    .filter((validator) => validator.hasWarnings)
    .length === 0;

  if (hasNoWarning) {
    return;
  }

  // tslint:disable-next-line:no-console
  console.log('');
  // tslint:disable-next-line:no-console
  console.log('WARNINGS:');

  validators.forEach((validator) => {
    validator.warnings = validator.warnings || [];
    validator.warnings.forEach((validationWarning) => {
      // tslint:disable-next-line:no-console
      console.log(`  * ${extractFirstLineOf(validationWarning.reason)}`);
    });
  });
}

function reportWarningStatusFor(validator: Partial<Checker>) {
  // tslint:disable-next-line:no-console
  console.log(`[!] ${validator.statusToDisplayWhileValidating}`);
}

function reportErrorStatusFor(validator: Partial<Checker>) {
  // tslint:disable-next-line:no-console
  console.log(`[x] ${validator.statusToDisplayWhileValidating}`);
}

function reportSuccessStatusFor(validator: Partial<Checker>) {
  // tslint:disable-next-line:no-console
  console.log(`[v] ${validator.statusToDisplayWhileValidating}`);
}
