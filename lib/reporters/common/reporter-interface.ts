import { Checker } from '../../validators/common/checker-interface';

export interface Reporter {
  name: string;
  reportIntro: () => void;
  reportUsage: () => void;
  reportValidationErrorsOf: (validators: Array<Partial<Checker>>) => void;
  reportValidationWarningsOf: (validators: Array<Partial<Checker>>) => void;
  reportErrorStatusFor: (validator: Partial<Checker>) => void;
  reportSuccessStatusFor: (validator: Partial<Checker>) => void;
  reportWarningStatusFor: (validator: Partial<Checker>) => void;
}
