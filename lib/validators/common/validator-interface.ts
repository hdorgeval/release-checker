export interface Validator {
  canRun: () => boolean;
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
