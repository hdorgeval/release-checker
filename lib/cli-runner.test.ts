import * as module from './cli-options/cli-options-parser';
import { usage } from './cli-options/usage';
import { run } from './cli-runner';
import { Checker } from './validators/common/checker-interface';
import { validators } from './validators/index';

test('It should exit 1 when a vaidator throws an uncaught error` ', () => {
  // Given
  const error = new Error('uncaught error from yo validator');
  const validator: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--yo',
    run: () => {
      throw error;
    },
    statusToDisplayWhileValidating: 'Checking that foo is bar',
  };
  validators.push(validator);

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

test('It should exit 0 when all validators pass` ', () => {
  // Given
  const fooValidator: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--foo',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is valid',
  };
  validators.push(fooValidator);

  const barValidator: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--bar',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that bar is valid',
  };
  validators.push(barValidator);

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
  const fooValidator: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--foo',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that foo is valid',
  };
  validators.push(fooValidator);

  const barValidator: Partial<Checker> = {
    canRun: () => true,
    cliOption: '--bar',
    run: () => [],
    statusToDisplayWhileValidating: 'Checking that bar is valid',
  };
  validators.push(barValidator);

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
