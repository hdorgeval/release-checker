import { Checker } from './common/checker-interface';
import { npmTestChecker } from './npm-test-checker/index';
import { packageJsonChecker } from './package-json-checker/index';

export const checkers: Array<Partial<Checker>> = [packageJsonChecker, npmTestChecker];
