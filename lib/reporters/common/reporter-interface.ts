export interface Reporter {
  name: string;
  reportUsage: () => void;
}
