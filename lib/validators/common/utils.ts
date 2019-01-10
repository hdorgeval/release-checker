import { ReleaseCheckerOptions } from '../../cli-options/cli-options-parser';
import { ValidationError, ValidationWarning, Validator, ValidatorProps } from './validator-interface';

export function setErrors(errors: ValidationError[]) {
  return {
    in(validator: Partial<Validator>) {
      validator.hasErrors = errors.length > 0;
      validator.errors = [...errors];
    },
  };
}

export function setErrorsAndWarnings(errorsAndWarnings: Array<ValidationError | ValidationWarning>) {
  return {
    in(validator: Partial<Validator>) {
      const errors = errorsAndWarnings.filter((error) => error.severity === 'error') as ValidationError[];
      setErrors(errors).in(validator);

      const warnings = errorsAndWarnings.filter((error) => error.severity === 'warning') as ValidationWarning[];
      setWarnings(warnings).in(validator);
    },
  };
}

export function setWarnings(warnings: ValidationWarning[]) {
  return {
    in(validator: Partial<Validator>) {
      validator.hasWarnings = warnings.length > 0;
      validator.warnings = [...warnings];
    },
  };
}

export function setCatchedError(error: Error) {
  return {
    in(validator: Partial<Validator>) {
      validator.hasErrors = true;
      const validationError: ValidationError = {
        reason: error.message,
        severity: 'error',
      };
      validator.errors = [validationError];
    },
  };
}

export function runValidator(validator: Partial<Validator>): void {
  try {
    ensureThatValidator(validator).canRun();
  } catch (error) {
    const warning: ValidationWarning = {
      reason: error.message,
      severity: 'warning',
    };
    setWarnings([warning]).in(validator);
    // tslint:disable-next-line:no-console
    console.log(`[!] ${validator.statusToDisplayWhileValidating}`);
    return;
  }

  try {
    const validationErrorsAndWarnings = validator.run!();
    setErrorsAndWarnings(validationErrorsAndWarnings).in(validator);
  } catch (error) {
    setCatchedError(error).in(validator);
  }

  validator.hasErrors
    ? // tslint:disable-next-line:no-console
      console.log(`[x] ${validator.statusToDisplayWhileValidating}`)
    : // tslint:disable-next-line:no-console
      console.log(`[v] ${validator.statusToDisplayWhileValidating}`);
}

export function ensureThatMethod(methodName: ValidatorProps) {
  return {
    in(validator: Partial<Validator>) {
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

export function ensureThatValidator(validator: Partial<Validator>) {
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

export function all(validators: Array<Partial<Validator>>) {
  return {
    hasPassed(): boolean {
      return validators.filter((validator) => validator.hasErrors).length === 0;
    },
  };
}

export function filter(validators: Array<Partial<Validator>>) {
  return {
    from(cliOptions: ReleaseCheckerOptions): Array<Partial<Validator>> {
      return validators.filter((validator) => {
        const cliOption = validator.cliOption || '';
        return cliOptions[cliOption];
      });
    },
  };
}
