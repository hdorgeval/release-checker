import { ValidationError, Validator, ValidatorProps } from './validator-interface';

export function setErrors(errors: ValidationError[]) {
  return {
    in(validator: Partial<Validator>) {
      validator.hasErrors = errors.length > 0;
      validator.errors = [...errors];
    },
  };
}

export function setCatchedError(error: Error) {
  return {
    in(validator: Partial<Validator>) {
      validator.hasErrors = true;
      const validationError: ValidationError = {
        reason: error.message,
      };
      validator.errors = [validationError];
    },
  };
}

export function runValidator(validator: Partial<Validator>) {
  try {
    ensureThatValidator(validator).canRun();
    const validationErrors: ValidationError[] = validator.run!();
    setErrors(validationErrors).in(validator);
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

export function showValidationErrorsOf(validators: Array<Partial<Validator>>) {
  validators.forEach((validator) => {
    validator.errors = validator.errors || [];
    validator.errors.forEach((validationError) => {
      // tslint:disable-next-line:no-console
      console.log(`  * ${validationError.reason}`);
    });
  });
}
