import { no, ReleaseCheckerOptions } from '../../cli-options/cli-options-parser';
import { ciReporter } from '../../reporters/ci-reporter/index';
import { Checker, CheckerProps, ValidationError, ValidationWarning } from './checker-interface';

export function setErrors(errors: ValidationError[]) {
  return {
    in(checker: Partial<Checker>) {
      checker.hasErrors = errors.length > 0;
      checker.errors = [...errors];
    },
  };
}

export function setErrorsAndWarnings(errorsAndWarnings: Array<ValidationError | ValidationWarning>) {
  return {
    in(checker: Partial<Checker>) {
      const errors = errorsAndWarnings.filter((error) => error.severity === 'error') as ValidationError[];
      setErrors(errors).in(checker);

      const warnings = errorsAndWarnings.filter((error) => error.severity === 'warning') as ValidationWarning[];
      setWarnings(warnings).in(checker);
    },
  };
}

export function setWarnings(warnings: ValidationWarning[]) {
  return {
    in(checker: Partial<Checker>) {
      checker.hasWarnings = warnings.length > 0;
      checker.warnings = [...warnings];
    },
  };
}

export function setCatchedError(error: Error) {
  return {
    in(checker: Partial<Checker>) {
      checker.hasErrors = true;
      const validationError: ValidationError = {
        reason: error.message,
        severity: 'error',
      };
      checker.errors = [validationError];
    },
  };
}

export function runChecker(checker: Partial<Checker>): void {
  try {
    ensureThatChecker(checker).canRun();
  } catch (error) {
    const warning: ValidationWarning = {
      reason: error.message,
      severity: 'warning',
    };
    setWarnings([warning]).in(checker);
    ciReporter.reportWarningStatusFor(checker);
    return;
  }

  try {
    const validationErrorsAndWarnings = checker.run!();
    setErrorsAndWarnings(validationErrorsAndWarnings).in(checker);
  } catch (error) {
    setCatchedError(error).in(checker);
  }

  if (checker.hasErrors) {
    ciReporter.reportErrorStatusFor(checker);
    return;
  }

  if (checker.hasWarnings) {
    ciReporter.reportWarningStatusFor(checker);
    return;
  }

  ciReporter.reportSuccessStatusFor(checker);
}

export function ensureThatMethod(methodName: CheckerProps) {
  return {
    in(checker: Partial<Checker>) {
      return {
        exists(): void {
          if (typeof checker[methodName] !== 'function') {
            const checkerId = checker.id || JSON.stringify(checker);
            throw new Error(`Missing method ${methodName}() in Validator '${checkerId}'`);
          }
        },
      };
    },
  };
}

export function ensureThatChecker(checker: Partial<Checker>) {
  return {
    canRun() {
      ensureThatMethod('canRun')
        .in(checker)
        .exists();

      if (checker.canRun && checker.canRun()) {
        ensureThatMethod('run')
          .in(checker)
          .exists();
        return;
      }

      ensureThatMethod('whyCannotRun')
        .in(checker)
        .exists();

      const errorMessage = checker.whyCannotRun && checker.whyCannotRun();
      throw new Error(errorMessage);
    },
  };
}

export function all(checkers: Array<Partial<Checker>>) {
  return {
    hasPassed(): boolean {
      return checkers.filter((checker) => checker.hasErrors).length === 0;
    },
  };
}

export function filter(checkers: Array<Partial<Checker>>) {
  return {
    from(cliOptions: ReleaseCheckerOptions): Array<Partial<Checker>> {
      if (no(cliOptions).hasBeenSet()) {
        return checkers;
      }

      return checkers.filter((checker) => {
        const cliOption = checker.cliOption || '';
        return cliOptions[cliOption];
      });
    },
  };
}
