import { read } from '../../utils/read-package-json';
import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';
import { getLatestTag, gitIsInstalled } from '../common/git';

export const gitTagChecker: Partial<Checker> = {
  canRun: () => gitIsInstalled(),
  cliOption: '--tag',
  id: 'git-tag-checker',
  run: () => validate(),
  shortCliOption: '-T',
  statusToDisplayWhileValidating: 'Checking that latest tag matches package.json version',
  whyCannotRun: () => `git not found. Run 'npm doctor' for more details`,
};

function validate(): Array<ValidationError | ValidationWarning> {
  const latestTag = getLatestTag();
  const pkg = read('package.json')
    .inDirectory(process.cwd())
    .asJson();
  if (pkg.version === latestTag) {
    return [];
  }
  if (`v${pkg.version}` === latestTag) {
    return [];
  }

  return [
    {
      reason: `Expected git tag to be '${pkg.version}' or 'v${pkg.version}', but it was '${latestTag}'`,
      severity: 'error',
    },
  ];
}
