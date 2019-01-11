export interface Checker {
  canRun: () => boolean;

  /**
   * command-line option associated with the validator
   * It should be something like '--foo'
   * You must ensure that this option is also configured in getCliOptions()
   * @type {string}
   * @memberof Checker
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

const noopChecker: Checker = {
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
export type CheckerProps = keyof typeof noopChecker;

export interface ValidationError {
  reason: string;
  severity: 'error';
}

export interface ValidationWarning {
  reason: string;
  severity: 'warning';
}
