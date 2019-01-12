import { mkdirSync } from 'fs';
import { join } from 'path';
import * as execModule from '../../utils/exec-sync';
import { exec } from '../../utils/exec-sync';
import { NpmVersionInfo } from '../../utils/npm-infos';
import { sensitiveDataChecker } from './index';

let nativeProcessArgv: string[];
let tempFolder: string;
let nativeCwd: string;
let execSpy: jest.Mock<(command: string) => string>;

beforeAll(() => {
  nativeCwd = process.cwd();
  nativeProcessArgv = process.argv;
  tempFolder = join(__dirname, 'tmp');
  exec(`npm run rimraf -- ${tempFolder}`);
  mkdirSync(tempFolder);
});
beforeEach(() => {
  process.chdir(tempFolder);

  execSpy = jest.spyOn(execModule, 'exec').mockImplementation(() => {
    const npmInfo: NpmVersionInfo = { npm: '5.9.0', node: '9.2.0' };
    return JSON.stringify(npmInfo, null, 2);
  });
});
afterEach(() => {
  execSpy.mockRestore();
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});
test('It should run when npm version >= 5.9.0', () => {
  // Given
  const checker = sensitiveDataChecker;

  // When
  const result = checker.canRun && checker.canRun();

  // Then
  expect(result).toBe(true);
});

test('It should not run when npm version < 5.9.0', () => {
  // Given
  const checker = sensitiveDataChecker;

  execSpy = jest.spyOn(execModule, 'exec').mockImplementation(() => {
    const npmInfo: NpmVersionInfo = { npm: '5.8.0', node: '8.6.0' };
    return JSON.stringify(npmInfo, null, 2);
  });

  // When
  const result = checker.canRun && checker.canRun();

  // Then
  expect(result).toBe(false);
});
