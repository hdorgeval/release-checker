import { execOrThrow } from '../../../lib/utils/exec-sync';
import { ensureThat } from '../../utils/read-package-json';
import { ValidationError, Validator } from '../common/validator-interface';

export const testsValidator: Partial<Validator> = {
  canRun: () => true,
  cliOption: '--test',
  id: 'tests-validator',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking that tests are successfull',
};

function validate(): ValidationError[] {
  ensureThat('package.json')
    .inDirectory(process.cwd())
    .hasScript('test');

  const result = execOrThrow('npm test');
  // tslint:disable-next-line:no-console
  console.log(result);
  return [];
}
