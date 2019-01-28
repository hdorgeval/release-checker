import { Checker } from './common/checker-interface';
import { gitBranchChecker } from './git-branch-checker/index';
import { gitUncommitedFilesChecker } from './git-uncommited-files-checker/index';
import { gitUntrackedFilesChecker } from './git-untracked-files-checker/index';
import { npmTestChecker } from './npm-test-checker/index';
import { packageJsonChecker } from './package-json-checker/index';
import { sensitiveDataChecker } from './sensitive-data-checker';

export const checkers: Array<Partial<Checker>> = [
  packageJsonChecker,
  npmTestChecker,
  sensitiveDataChecker,
  gitBranchChecker,
  gitUncommitedFilesChecker,
  gitUntrackedFilesChecker,
];
