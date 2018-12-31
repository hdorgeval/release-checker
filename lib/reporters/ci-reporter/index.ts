import { usage } from '../../cli-options/usage';
import { Reporter } from '../common/reporter-interface';

export const ciReporter: Reporter = {
  name: 'ci',
  reportUsage,
};

function reportUsage() {
  // tslint:disable-next-line:no-console
  console.log(usage);
}
