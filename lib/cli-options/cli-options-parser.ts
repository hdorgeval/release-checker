import minimist from 'minimist';

export interface ReleaseCheckerOptions {
  [index: string]: string | boolean;
  '--customize-sensitivedata': boolean;
  '--help': boolean;
  '--package.json': boolean;
  '--sensitivedata': boolean;
  '--test': boolean;
}

export function getCliOptions(): ReleaseCheckerOptions {
  const args = minimist(process.argv.slice(2));
  const options: ReleaseCheckerOptions = {
    '--customize-sensitivedata': args['customize-sensitivedata'] || false,
    '--help': args.help || args.h || false,
    '--package.json': true,
    '--sensitivedata': args.sensitivedata || args.s || false,
    '--test': args.test || args.t || false,
  };
  return options;
}

export function no(options: ReleaseCheckerOptions) {
  return {
    hasBeenSet(): boolean {
      return (
        options['--help'] === false &&
        options['--test'] === false &&
        options['--sensitivedata'] === false &&
        options['--customize-sensitivedata'] === false
      );
    },
  };
}
