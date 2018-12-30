import minimist from 'minimist';

export interface ReleaseCheckerOptions {
  [index: string]: string | boolean;
  '--help': boolean;
  '--package.json': boolean;
}

export function getCliOptions(): ReleaseCheckerOptions {
  const args = minimist(process.argv.slice(2));
  const options: ReleaseCheckerOptions = { '--help': args.help || args.h || false, '--package.json': true };
  return options;
}
