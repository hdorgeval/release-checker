import { readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, sep } from 'path';
import { execOrThrow } from '../../utils/exec-sync';
import { currentNpmVersion, getCurrentNpmVersion } from '../../utils/npm-infos';
import { Checker, ValidationError, ValidationWarning } from '../common/checker-interface';

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

function validate(): Array<ValidationError | ValidationWarning> {
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
  try {
    const extractedJson = extractJsonDataFrom(content);
    const result = JSON.parse(extractedJson);
    return result;
  } catch (error) {
    throw new Error(`cannot parse to JSON the content of file: ${logFilepath}`);
  }
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

/**
 * Extract the Json data from input content.
 * The problem: the 'npm pack --json > output.log' command will run any 'prepublish' script
 * defined in the package.json file before executing the npm pack command itself.
 * In the context of publish-please, any already-installed publish-please package
 * has already a prepublish script:  "prepublish": "publish-please guard"
 * this will give the following output:
 *          > testing-repo@1.3.77 prepublish ...
 *          > publish-please guard
 *          [{real ouput of npm pack}]
 *
 * So the input content may be either a valid json file
 * or valid json data prefixed by the result of the prepublish script execution
 * @param {string} content
 */
export function extractJsonDataFrom(content: string): string {
  for (let index = 0; index <= content.length - 1; index++) {
    try {
      const extractedContent = content.substr(index);
      JSON.parse(extractedContent);
      return extractedContent;
    } catch (error) {
      continue;
    }
  }
  throw new Error('Cannot extract JSON data');
}
