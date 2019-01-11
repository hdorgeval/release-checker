import { Checker } from '../../checkers/common/checker-interface';

export interface Reporter {
  name: string;
  reportIntro: () => void;
  reportUsage: () => void;
  reportValidationErrorsOf: (checkers: Array<Partial<Checker>>) => void;
  reportValidationWarningsOf: (checkers: Array<Partial<Checker>>) => void;
  reportErrorStatusFor: (checker: Partial<Checker>) => void;
  reportSuccessStatusFor: (checker: Partial<Checker>) => void;
  reportWarningStatusFor: (checker: Partial<Checker>) => void;
}
