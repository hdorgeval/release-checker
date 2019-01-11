import { Checker } from './common/checker-interface';
import { packageJsonValidator } from './package-json-validator/index';
import { testsValidator } from './tests-validator/index';

export const validators: Array<Partial<Checker>> = [packageJsonValidator, testsValidator];
