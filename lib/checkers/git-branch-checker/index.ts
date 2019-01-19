import { execOrThrow } from '../../utils/exec-sync';
import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';

export const gitBranchChecker: Partial<Checker> = {
  canRun: () => isGitInstalled(),
  cliOption: '--branch',
  id: 'git-branch-checker',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking that current branch is `master` or `release`',
  whyCannotRun: () => `git not found. Run 'npm doctor' for more details`,
};

function validate(): Array<ValidationError | ValidationWarning> {
  throw new Error('Checker not implemented');
}

function isGitInstalled() {
  try {
    execOrThrow('git --version');
    return true;
  } catch (error) {
    return false;
  }
}
