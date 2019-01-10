import { Validator } from '../../validators/common/validator-interface';

export interface Reporter {
  name: string;
  reportIntro: () => void;
  reportUsage: () => void;
  reportValidationErrorsOf: (validators: Array<Partial<Validator>>) => void;
  reportValidationWarningsOf: (validators: Array<Partial<Validator>>) => void;
}
