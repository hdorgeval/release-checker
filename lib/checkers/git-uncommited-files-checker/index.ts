import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';
import { getUncommitedFiles, gitIsInstalled } from '../common/git';

export const gitUncommitedFilesChecker: Partial<Checker> = {
  canRun: () => gitIsInstalled(),
  cliOption: '--uncommited-files',
  id: 'git-uncommited-files-checker',
  run: () => validate(),
  shortCliOption: '-c',
  statusToDisplayWhileValidating: 'Checking there are no uncommited files',
  whyCannotRun: () => `git not found. Run 'npm doctor' for more details`,
};

function validate(): Array<ValidationError | ValidationWarning> {
  const uncommitedFiles = getUncommitedFiles();
  const validationErrorsAndWarnings: Array<ValidationError | ValidationWarning> = [];
  uncommitedFiles.forEach((filepath) => {
    validationErrorsAndWarnings.push({
      reason: `File '${filepath}' is uncommited`,
      severity: 'error',
    });
  });
  return validationErrorsAndWarnings;
}
