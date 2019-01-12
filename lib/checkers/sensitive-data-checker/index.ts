import { readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, sep } from 'path';
import { execOrThrow } from '../../utils/exec-sync';
import { currentNpmVersion, getCurrentNpmVersion } from '../../utils/npm-infos';
import { Checker, ValidationError } from '../common/checker-interface';

export const sensitiveDataChecker: Partial<Checker> = {
  canRun: () =>
    currentNpmVersion()
      .canReportInJson()
      .packCommand(),
  cliOption: '--sensitivedata',
  id: 'sensivitive-data-checker',
  run: () => validate(),
  statusToDisplayWhileValidating: 'Checking for the sensitive and non-essential data in the npm package',
  whyCannotRun: () =>
    `Cannot check sensitive and non-essential data because npm version is ${getCurrentNpmVersion()}. Upgrade npm to version 5.9.0 or above to enable this check.`,
};

function validate(): ValidationError[] {
  throw new Error('Checker not implemented');
}

function getLogFilepath(): string {
  const tempFolder = tmpdir();
  const currentFolder = process.cwd();
  const projectName = currentFolder.split(sep).pop()!;
  const packLogFilename = `npm-pack-${projectName.trim().replace(/'\s'/g, '-')}.log`;
  const logFilepath = join(tempFolder, packLogFilename);
  return logFilepath;
}

export function createPackageAndReadAsJson(): NpmPackageInfos[] {
  const logFilepath = getLogFilepath();
  // tslint:disable-next-line:no-console
  console.log(logFilepath);
  const command = `npm pack --json > ${logFilepath}`;
  execOrThrow(command);
  const content = readFileSync(logFilepath).toString();
  const result = JSON.parse(content);
  return result;
}

export interface NpmPackageInfos {
  id: string;
  name: string;
  version: string;
  size: number;
  unpackedSize: number;
  shasum: string;
  integrity: string;
  filename: string;
  entryCount: number;
  files: NpmPackageFileInfos[];
}

export interface NpmPackageFileInfos {
  path: string;
  size: number;
  mode: number;
}
