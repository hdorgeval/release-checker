import {getCliOptions, allKeysAreUndefindIn} from './cli-options/cli-options-parser';
import { usage } from './cli-options/usage';

export function run() {
    const options = getCliOptions();
    if (allKeysAreUndefindIn(options)) {
        console.log(usage);
    }
}
