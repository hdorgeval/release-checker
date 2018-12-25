import { execSync } from 'child_process';

export function exec(command: string) {
  try {
    const result = execSync(command, { encoding: 'utf8' });
    return result.toString();
  } catch (error) {
    return error.message;
  }
}
