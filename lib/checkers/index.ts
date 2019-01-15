import { Checker } from './common/checker-interface';
import { npmTestChecker } from './npm-test-checker/index';
import { packageJsonChecker } from './package-json-checker/index';
import { sensitiveDataChecker } from './sensitive-data-checker';

export const checkers: Array<Partial<Checker>> = [packageJsonChecker, npmTestChecker, sensitiveDataChecker];
