import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';
import { getUntrackedFiles, gitIsInstalled } from '../common/git';

export const gitUntrackedFilesChecker: Partial<Checker> = {
  canRun: () => gitIsInstalled(),
  cliOption: '--untracked-files',
  id: 'git-untracked-files-checker',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking there is no untracked file`',
  whyCannotRun: () => `git not found. Run 'npm doctor' for more details`,
};

function validate(): Array<ValidationError | ValidationWarning> {
  const untrackedFiles = getUntrackedFiles();
  const validationErrorsAndWarnings: Array<ValidationError | ValidationWarning> = [];
  untrackedFiles.forEach((filepath) => {
    validationErrorsAndWarnings.push({
      reason: `File '${filepath}' is untracked`,
      severity: 'error',
    });
  });
  return validationErrorsAndWarnings;
}
