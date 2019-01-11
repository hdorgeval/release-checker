import { no, ReleaseCheckerOptions } from '../../cli-options/cli-options-parser';
import { ciReporter } from '../../reporters/ci-reporter/index';
import { Checker, CheckerProps, ValidationError, ValidationWarning } from './checker-interface';

export function setErrors(errors: ValidationError[]) {
  return {
    in(validator: Partial<Checker>) {
      validator.hasErrors = errors.length > 0;
      validator.errors = [...errors];
    },
  };
}

export function setErrorsAndWarnings(errorsAndWarnings: Array<ValidationError | ValidationWarning>) {
  return {
    in(validator: Partial<Checker>) {
      const errors = errorsAndWarnings.filter((error) => error.severity === 'error') as ValidationError[];
      setErrors(errors).in(validator);

      const warnings = errorsAndWarnings.filter((error) => error.severity === 'warning') as ValidationWarning[];
      setWarnings(warnings).in(validator);
    },
  };
}

export function setWarnings(warnings: ValidationWarning[]) {
  return {
    in(validator: Partial<Checker>) {
      validator.hasWarnings = warnings.length > 0;
      validator.warnings = [...warnings];
    },
  };
}

export function setCatchedError(error: Error) {
  return {
    in(validator: Partial<Checker>) {
      validator.hasErrors = true;
      const validationError: ValidationError = {
        reason: error.message,
        severity: 'error',
      };
      validator.errors = [validationError];
    },
  };
}

export function runValidator(validator: Partial<Checker>): void {
  try {
    ensureThatValidator(validator).canRun();
  } catch (error) {
    const warning: ValidationWarning = {
      reason: error.message,
      severity: 'warning',
    };
    setWarnings([warning]).in(validator);
    ciReporter.reportWarningStatusFor(validator);
    return;
  }

  try {
    const validationErrorsAndWarnings = validator.run!();
    setErrorsAndWarnings(validationErrorsAndWarnings).in(validator);
  } catch (error) {
    setCatchedError(error).in(validator);
  }

  if (validator.hasErrors) {
    ciReporter.reportErrorStatusFor(validator);
    return;
  }

  if (validator.hasWarnings) {
    ciReporter.reportWarningStatusFor(validator);
    return;
  }

  ciReporter.reportSuccessStatusFor(validator);
}

export function ensureThatMethod(methodName: CheckerProps) {
  return {
    in(validator: Partial<Checker>) {
      return {
        exists(): void {
          if (typeof validator[methodName] !== 'function') {
            const validatorId = validator.id || JSON.stringify(validator);
            throw new Error(`Missing method ${methodName}() in Validator '${validatorId}'`);
          }
        },
      };
    },
  };
}

export function ensureThatValidator(validator: Partial<Checker>) {
  return {
    canRun() {
      ensureThatMethod('canRun')
        .in(validator)
        .exists();

      if (validator.canRun && validator.canRun()) {
        ensureThatMethod('run')
          .in(validator)
          .exists();
        return;
      }

      ensureThatMethod('whyCannotRun')
        .in(validator)
        .exists();

      const errorMessage = validator.whyCannotRun && validator.whyCannotRun();
      throw new Error(errorMessage);
    },
  };
}

export function all(validators: Array<Partial<Checker>>) {
  return {
    hasPassed(): boolean {
      return validators.filter((validator) => validator.hasErrors).length === 0;
    },
  };
}

export function filter(validators: Array<Partial<Checker>>) {
  return {
    from(cliOptions: ReleaseCheckerOptions): Array<Partial<Checker>> {
      if (no(cliOptions).hasBeenSet()) {
        return validators;
      }

      return validators.filter((validator) => {
        const cliOption = validator.cliOption || '';
        return cliOptions[cliOption];
      });
    },
  };
}
