import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';

export const licensesChecker: Partial<Checker> = {
  canRun: () => prodDependenciesAreInstalled(),
  cliOption: '--licenses',
  id: 'licenses-checker',
  run: () => validate(),
  shortCliOption: '-l',
  statusToDisplayWhileValidating: 'Checking that licenses declared in production dependencies are valid',
  whyCannotRun: () =>
    `Cannot check licenses because dependencies are not installed. You should run the command 'npm install' first`,
};

function validate(): Array<ValidationError | ValidationWarning> {
  throw new Error('Not implemented Checker');
}

function prodDependenciesAreInstalled(): boolean {
  throw new Error('Not implemented function');
}
