import { Checker } from './checkers/common/checker-interface';
import { checkers } from './checkers/index';
import * as sensitivedataModule from './checkers/sensitive-data-checker/index';
import * as module from './cli-options/cli-options-parser';
import { usage } from './cli-options/usage';
import { run } from './cli-runner';

test('It should exit 1 when a checker throws an uncaught error` ', () => {
  // Given
  const error = new Error('uncaught error from yo checker');
  const checker: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--yo',
    run: () => {
      throw error;
    },
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };
  checkers.push(checker);

  // When
  jest.spyOn(module, 'getCliOptions').mockImplementation(() => {
    return {
      '--help': false,
      '--package.json': false,
      '--yo': true,
    };
  });
  let exitCode: number = 0;
  jest.spyOn(global.process, 'exit').mockImplementation((code) => (exitCode = code));
  run();

  // Then
  expect(exitCode).toBe(1);
});

test('It should exit 0 when all checkers pass` ', () => {
  // Given
  const foochecker: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--foo',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is valid',
  };
  checkers.push(foochecker);

  const barchecker: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--bar',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that bar is valid',
  };
  checkers.push(barchecker);

  // When
  jest.spyOn(module, 'getCliOptions').mockImplementation(() => {
    return {
      '--bar': true,
      '--foo': true,
      '--help': false,
      '--package.json': false,
    };
  });
  let exitCode: number = 0;
  jest.spyOn(global.process, 'exit').mockImplementation((code) => (exitCode = code));
  run();

  // Then
  expect(exitCode).toBe(0);
});

test('It should display usage when --help is found in command-line` ', () => {
  // Given
  const foochecker: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--foo',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is valid',
  };
  checkers.push(foochecker);

  const barchecker: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--bar',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that bar is valid',
  };
  checkers.push(barchecker);

  // When
  jest.spyOn(module, 'getCliOptions').mockImplementation(() => {
    return {
      '--bar': true,
      '--foo': true,
      '--help': true,
      '--package.json': true,
    };
  });
  let exitCode: number = 0;
  jest.spyOn(global.process, 'exit').mockImplementation((code) => (exitCode = code));

  const output: string[] = [];
  jest.spyOn(global.console, 'log').mockImplementation((...args) => output.push(...args));
  run();

  // Then
  expect(exitCode).toBe(0);
  expect(output).toContain(usage);
});

test('It should eject .sensitivedata file when --customize-sensitivedata is found in command-line` ', () => {
  // Given
  const foochecker: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--foo',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is valid',
  };
  checkers.push(foochecker);

  const barchecker: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--bar',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that bar is valid',
  };
  checkers.push(barchecker);

  // When
  jest.spyOn(module, 'getCliOptions').mockImplementation(() => {
    return {
      '--bar': true,
      '--customize-sensitivedata': true,
      '--foo': true,
      '--help': false,
      '--package.json': true,
    };
  });
  let exitCode: number = 0;
  jest.spyOn(global.process, 'exit').mockImplementation((code) => (exitCode = code));

  const sensitiveDataSpy = jest.spyOn(sensitivedataModule, 'ejectSensitiveData').mockImplementation(() => void 0);
  run();

  // Then
  expect(exitCode).toBe(0);
  expect(sensitiveDataSpy).toHaveBeenCalled();
});
