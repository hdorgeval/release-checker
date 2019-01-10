import minimist from 'minimist';

export interface ReleaseCheckerOptions {
  [index: string]: string | boolean;
  '--help': boolean;
  '--package.json': boolean;
  '--test': boolean;
}

export function getCliOptions(): ReleaseCheckerOptions {
  const args = minimist(process.argv.slice(2));
  const options: ReleaseCheckerOptions = {
    '--help': args.help || args.h || false,
    '--package.json': true,
    '--test': args.test || args.t || false,
  };
  return options;
}

export function no(options: ReleaseCheckerOptions) {
  return {
    hasBeenSet(): boolean {
      return options['--help'] === false && options['--test'] === false;
    },
  };
}
