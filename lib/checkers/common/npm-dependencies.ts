import { read } from '../../utils/read-package-json';

export function getProductionDepenciesOf(filename: string) {
  return {
    inDirectory(directory: string): string[] {
      const pkg = read(filename)
        .inDirectory(directory)
        .asJson();
      const prodDependencies = pkg.dependencies || {};
      const result: string[] = [];
      for (const key in prodDependencies) {
        if (prodDependencies.hasOwnProperty(key)) {
          result.push(key);
        }
      }
      return result;
    },
  };
}
