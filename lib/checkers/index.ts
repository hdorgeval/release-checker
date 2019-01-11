import { Checker } from './common/checker-interface';
import { testsValidator } from './npm-test-checker/index';
import { packageJsonValidator } from './package-json-checker/index';

export const validators: Array<Partial<Checker>> = [packageJsonValidator, testsValidator];
