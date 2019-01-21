import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';
import { getCurrentBranch, gitIsInstalled, headIsNotDetached } from '../common/git';

export const gitBranchChecker: Partial<Checker> = {
  canRun: () => gitIsInstalled() && headIsNotDetached(),
  cliOption: '--branch',
  id: 'git-branch-checker',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking that current branch is `master` or `release`',
  whyCannotRun: () => `git not found or HEAD is detached. Run 'npm doctor' or 'git branch' for more details`,
};

function validate(): Array<ValidationError | ValidationWarning> {
  const currentBranch = getCurrentBranch();
  if (currentBranch === 'master' || currentBranch === 'release') {
    return [];
  }

  const validationError: ValidationError = {
    reason: `Current branch is '${currentBranch}', but it should be 'master' or 'release'.`,
    severity: 'error',
  };

  return [validationError];
}
