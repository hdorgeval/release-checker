import { execSync } from 'child_process';

export function exec(command: string): string {
  try {
    const result = execSync(command, { encoding: 'utf8' });
    return result.toString();
  } catch (error) {
    return error.message;
  }
}

export function execOrThrow(command: string): string {
  const result = execSync(command, { encoding: 'utf8' });
  return result.toString();
}
