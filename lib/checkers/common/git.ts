import { exec, execOrThrow } from '../../utils/exec-sync';

export function gitIsInstalled() {
  try {
    execOrThrow('git --version');
    return true;
  } catch (error) {
    return false;
  }
}

export function headIsDetached() {
  const currentBranch = getCurrentBranch();
  return currentBranch.includes('HEAD detached');
}

export function headIsNotDetached() {
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

export function getUntrackedFiles(): string[] {
  const gitExecutionResult = exec('git status --untracked-files --porcelain');
  const untrackedFiles = gitExecutionResult
    .split(/\n|\r/)
    .map((line) => line.replace(/[\t]/g, ' '))
    .map((line) => line.trim())
    .filter((line) => line && line.length > 0)
    .filter((line) => line.startsWith('??'))
    .map((line) => line.replace('??', '').trim());

  return untrackedFiles;
}

export function getUncommitedFiles(): string[] {
  const gitExecutionResult = exec('git status --porcelain');
  const uncommitedFiles = gitExecutionResult
    .split(/\n|\r/)
    .map((line) => line.replace(/[\t]/g, ' '))
    .map((line) => line.trim())
    .filter((line) => line && line.length > 0)
    .filter(
      (line) =>
        line.startsWith('A ') ||
        line.startsWith('C ') ||
        line.startsWith('D ') ||
        line.startsWith('M ') ||
        line.startsWith('R ') ||
        line.startsWith('U '),
    )

    .map((line) => line.replace(/^A\s/, '%%').trim())
    .map((line) => line.replace(/^C\s/, '%%').trim())
    .map((line) => line.replace(/^D\s/, '%%').trim())
    .map((line) => line.replace(/^M\s/, '%%').trim())
    .map((line) => line.replace(/^R\s/, '%%').trim())
    .map((line) => line.replace(/^U\s/, '%%').trim())
    .map((line) => line.replace('%%', '').trim());

  return uncommitedFiles;
}

export function getLatestTag(): string {
  const gitExecutionResult = exec('git describe --tags $(git rev-list --tags --max-count=1)');
  return gitExecutionResult;
}

export function getLatestTaggedCommit(): string {
  const gitExecutionResult = exec('git rev-list --tags --max-count=1');
  return gitExecutionResult;
}
