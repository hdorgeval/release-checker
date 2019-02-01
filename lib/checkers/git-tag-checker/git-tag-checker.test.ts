import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import { join } from 'path';
import * as execModule from '../../utils/exec-sync';
import { exec } from '../../utils/exec-sync';
import { ValidationError, ValidationWarning } from '../common/checker-interface';
import { gitTagChecker } from './index';

let nativeProcessArgv: string[];
let tempFolder: string;
let nativeCwd: string;
let testingRepo: string;

beforeAll(() => {
  nativeCwd = process.cwd();
  nativeProcessArgv = process.argv;
  tempFolder = join(__dirname, 'tmp');
  exec(`npm run rimraf -- ${tempFolder}`);
  mkdirSync(tempFolder);
});
beforeEach(() => {
  process.chdir(tempFolder);
  testingRepo = join(tempFolder, 'testing-repo-for-release-checker');
  exec(`npm run rimraf -- ${testingRepo} `);
  exec('git clone https://github.com/hdorgeval/testing-repo-for-release-checker.git');
  process.chdir(testingRepo);

  // remove any errors and warnings in Checker
  gitTagChecker.errors = undefined;
  gitTagChecker.warnings = undefined;
  gitTagChecker.hasErrors = undefined;
  gitTagChecker.hasWarnings = undefined;
});
afterEach(() => {
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});
test('It should not run when git is not installed', () => {
  // Given
  const checker = gitTagChecker;
  const spy = jest.spyOn(execModule, 'execOrThrow').mockImplementation(() => {
    const executionResult = execSync('foobar --version', { encoding: 'utf8' });
    return executionResult.toString();
  });

  // When
  const result = checker.canRun && checker.canRun();
  const explanation = checker.whyCannotRun && checker.whyCannotRun();

  // Then
  expect(result).toBe(false);
  expect(explanation).toContain('git not found');
  spy.mockRestore();
});

test('It should run when latest tag matches package.json version', () => {
  // Given
  const checker = gitTagChecker;
  exec('git config user.email "you@example.com"');
  exec('git config user.name "Your Name"');
  exec('git tag -a v1.0.0  -m yo');

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  expect(result).toEqual([]);
});

test('It should run when latest tag matches package.json version (2)', () => {
  // Given
  const checker = gitTagChecker;
  exec('git config user.email "you@example.com"');
  exec('git config user.name "Your Name"');
  exec('git tag -a 1.0.0  -m yo');

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  expect(result).toEqual([]);
});

test('It should run with error when latest tag does not package.json version (2)', () => {
  // Given
  const checker = gitTagChecker;
  exec('git config user.email "you@example.com"');
  exec('git config user.name "Your Name"');
  exec('git tag -a yo1.0.0  -m yo');

  // When
  const result = checker.canRun && checker.canRun() && checker.run && checker.run();

  // Then
  const expectedErrors: Array<ValidationError | ValidationWarning> = [
    { reason: "Expected git tag to be '1.0.0' or 'v1.0.0', but it was 'yo1.0.0'", severity: 'error' },
  ];
  expect(result).toEqual(expectedErrors);
});
