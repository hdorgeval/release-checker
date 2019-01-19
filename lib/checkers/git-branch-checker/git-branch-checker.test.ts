import { execSync } from 'child_process';
import * as execModule from '../../utils/exec-sync';
import { gitBranchChecker } from './index';

test('It should not run when git is not installed', () => {
  // Given
  const checker = gitBranchChecker;
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

test('It should run when git is installed', () => {
  // Given
  const checker = gitBranchChecker;

  // When
  const result = checker.canRun && checker.canRun();

  // Then
  expect(result).toBe(true);
});
