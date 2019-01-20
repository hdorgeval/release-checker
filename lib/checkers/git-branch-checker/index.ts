import { exec, execOrThrow } from '../../utils/exec-sync';
import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';

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

function gitIsInstalled() {
  try {
    execOrThrow('git --version');
    return true;
  } catch (error) {
    return false;
  }
}

function headIsDetached() {
  const currentBranch = getCurrentBranch();
  return currentBranch.includes('HEAD detached');
}

function headIsNotDetached() {
  return headIsDetached() === false;
}

export function getCurrentBranch(): string {
  const gitExecutionResult = exec('git branch --no-color');
  const currentBranch = gitExecutionResult
    .split(/\n|\r/)
    .map((line) => line.replace(/[\t]/g, ' '))
    .map((line) => line.trim())
    .filter((line) => line && line.length > 0)
    .filter((line) => line.startsWith('*'))
    .map((line) => line.replace('*', '').trim());

  if (currentBranch.length === 0) {
    throw new Error(gitExecutionResult);
  }

  return currentBranch[0];
}
