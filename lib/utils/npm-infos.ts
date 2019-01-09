import * as semver from 'semver';
import { exec } from './exec-sync';

const NPM_VERSION_WITH_PACK_JSON_REPORTER = '5.9.0';

export function getCurrentNpmVersion(): string {
  const result = exec('npm version --json');
  try {
    return (JSON.parse(result) as NpmVersionInfo).npm;
  } catch (error) {
    throw new Error(`Cannot parse the result of command 'npm version --json'`);
  }
}

export interface NpmVersionInfo {
  [key: string]: string;
  npm: string;
  node: string;
}

export function npmPackCanReportInJson(version: string) {
  return semver.gte(version, NPM_VERSION_WITH_PACK_JSON_REPORTER);
}

export function currentNpmVersion() {
  const currentVersion = getCurrentNpmVersion();
  return {
    canReportInJson() {
      return {
        packCommand(): boolean {
          return npmPackCanReportInJson(currentVersion);
        },
      };
    },
  };
}
