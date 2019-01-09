import { currentNpmVersion, getCurrentNpmVersion } from '../../utils/npm-infos';
import { ValidationError, Validator } from '../common/validator-interface';

export const packageJsonValidator: Partial<Validator> = {
  canRun: () =>
    currentNpmVersion()
      .canReportInJson()
      .packCommand(),
  cliOption: '--sensitivedata',
  id: 'sensivitive-data-validator',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking for the sensitive and non-essential data in the npm package',
  whyCannotRun: () =>
    `Cannot check sensitive and non-essential data because npm version is ${getCurrentNpmVersion()}. Upgrade npm to version 5.9.0 or above to enable this validation.`,
};

function validate(): ValidationError[] {
  throw new Error('validation not implemented');
}
