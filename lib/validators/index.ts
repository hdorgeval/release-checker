import { Validator } from './common/validator-interface';
import { packageJsonValidator } from './package-json-validator/index';

export const validators: Array<Partial<Validator>> = [packageJsonValidator];
