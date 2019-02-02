import { join } from 'path';
import { file } from '../../utils/fs';
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

export function findInstallPathOfDependency(dependency: string) {
  return {
    startingFrom(directory: string): string {
      const defaultInstallPath = join(directory, 'node_modules', dependency);
      if (file('package.json').existsInDirectory(defaultInstallPath)) {
        return defaultInstallPath;
      }

      throw new Error(`cannot find install path of dependency '${dependency}' in directory '${directory}'`);
    },
  };
}
