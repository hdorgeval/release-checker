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
  id: string;
  run: () => ValidationError[];
  statusToDisplayWhileValidating: string;
  whyCannotRun: () => string;
}

const noopValidator: Validator = {
  canRun: () => false,
  cliOption: '--noop',
  errors: [],
  hasErrors: false,
  id: 'noop',
  run: () => [],
  statusToDisplayWhileValidating: 'noop',
  whyCannotRun: () => '',
};
export type ValidatorProps = keyof typeof noopValidator;

export interface ValidationError {
  reason: string;
}
