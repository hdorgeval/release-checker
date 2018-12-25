import minimist from 'minimist';

export interface ReleaseCheckerOptions {
    [index:string]: string | boolean;
    '--help' : boolean;
}

export function getCliOptions(): ReleaseCheckerOptions {
    const args = minimist(process.argv.slice(2));
    const options: ReleaseCheckerOptions = {
        '--help' : args['help'],
    }
    return options;
}

export function allKeysAreUndefindIn(options: ReleaseCheckerOptions): boolean {
    for (const key in options) {
        if (options[key] !== undefined) {
            return false;
        }
    }
    return true;
}
