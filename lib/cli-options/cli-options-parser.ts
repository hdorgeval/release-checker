import minimist from 'minimist';

export interface ReleaseCheckerOptions {
  [index: string]: string | boolean;
  '--branch': boolean;
  '--customize-sensitivedata': boolean;
  '--help': boolean;
  '--package.json': boolean;
  '--sensitivedata': boolean;
  '--tag': boolean;
  '--test': boolean;
  '--uncommited-files': boolean;
  '--untracked-files': boolean;
}

export function getCliOptions(): ReleaseCheckerOptions {
  const args = minimist(process.argv.slice(2));
  const options: ReleaseCheckerOptions = {
    '--branch': args.branch || args.b || false,
    '--customize-sensitivedata': args['customize-sensitivedata'] || false,
    '--help': args.help || args.h || false,
    '--package.json': true,
    '--sensitivedata': args.sensitivedata || args.s || false,
    '--tag': args.tag || args.T || false,
    '--test': args.test || args.t || false,
    '--uncommited-files': args['uncommited-files'] || args.c || false,
    '--untracked-files': args['untracked-files'] || args.u || false,
  };

  for (const key in args) {
    if (args.hasOwnProperty(key) && key.startsWith('skip-')) {
      options[`--${key}`] = true;
    }
  }

  return options;
}

export function no(options: Partial<ReleaseCheckerOptions>) {
  return {
    hasBeenSet(): boolean {
      return (
        options['--branch'] === false &&
        options['--customize-sensitivedata'] === false &&
        options['--help'] === false &&
        options['--sensitivedata'] === false &&
        options['--tag'] === false &&
        options['--test'] === false &&
        options['--uncommited-files'] === false &&
        options['--untracked-files'] === false
      );
    },
  };
}
