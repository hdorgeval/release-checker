import { usage } from '../../cli-options/usage';
import { Validator } from '../../validators/common/validator-interface';
import { extractFirstLineOf } from '../common/extract-first-line-of';
import { Reporter } from '../common/reporter-interface';

export const ciReporter: Reporter = { name: 'ci', reportUsage, reportIntro, reportValidationErrorsOf };

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

function reportValidationErrorsOf(validators: Array<Partial<Validator>>) {
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
