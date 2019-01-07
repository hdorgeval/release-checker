import { exec } from './exec-sync';

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
