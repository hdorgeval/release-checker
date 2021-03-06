import { execOrThrow } from '../../utils/exec-sync';
import { ensureThat } from '../../utils/read-package-json';
import { Checker, ValidationError } from '../common/checker-interface';

export const npmTestChecker: Partial<Checker> = {
  canRun: () => true,
  cliOption: '--test',
  id: 'npm-test-checker',
  run: () => validate(),
  shortCliOption: '-t',
  statusToDisplayWhileValidating: 'Checking that tests are successfull',
};

function validate(): ValidationError[] {
  ensureThat('package.json')
    .inDirectory(process.cwd())
    .hasScript('test');

  execOrThrow('npm test');
  return [];
}
