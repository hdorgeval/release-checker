import { allKeysAreUndefindIn, getCliOptions } from './cli-options/cli-options-parser';
import { usage } from './cli-options/usage';

export function run() {
  const options = getCliOptions();
  if (allKeysAreUndefindIn(options) || options['--help']) {
    // tslint:disable-next-line:no-console
    console.log(usage);
    return;
  }
}
