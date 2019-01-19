import { exec, execOrThrow } from '../../utils/exec-sync';
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
    throw new Error(`git cannot detect on which branch you are. Run command 'git branch' for more details`);
  }

  return currentBranch[0];
}
