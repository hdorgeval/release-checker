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
