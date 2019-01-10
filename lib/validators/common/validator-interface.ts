export interface Validator {
  canRun: () => boolean;

  /**
   * command-line option associated with the validator
   * It should be something like '--foo'
   * You must ensure that this option is also configured in getCliOptions()
   * The validator will be automatically selected when this option is found in the command-line
   * The validator will be ignored if this option is not found on the command-line
   * @type {string}
   * @memberof Validator
   */
  cliOption: string;
  errors: ValidationError[];
  hasErrors: boolean;
  hasWarnings: boolean;
  id: string;
  run: () => Array<ValidationError | ValidationWarning>;
  statusToDisplayWhileValidating: string;
  warnings: ValidationWarning[];
  whyCannotRun: () => string;
}

const noopValidator: Validator = {
  canRun: () => false,
  cliOption: '--noop',
  errors: [],
  hasErrors: false,
  hasWarnings: false,
  id: 'noop',
  run: () => [],
  statusToDisplayWhileValidating: 'noop',
  warnings: [],
  whyCannotRun: () => '',
};
export type ValidatorProps = keyof typeof noopValidator;

export interface ValidationError {
  reason: string;
  severity: 'error';
}

export interface ValidationWarning {
  reason: string;
  severity: 'warning';
}
