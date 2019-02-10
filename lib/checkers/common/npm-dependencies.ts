import { ModuleInfo, ModuleInfos } from 'license-checker';
import { join } from 'path';
import { exec } from '../../utils/exec-sync';
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
        if (pkg.optionalDependencies && pkg.optionalDependencies[key]) {
          continue;
        }
        result.push(key);
      }
      return result;
    },
  };
}

export function findInstallPathOfDependency(dependency: string) {
  return {
    startingFrom(directory: string): string {
      const paths = getNodeModulesInstallPathsOf(dependency).startingFrom(directory);
      for (const path of paths) {
        if (file('package.json').existsInDirectory(path)) {
          return path;
        }
      }

      throw new Error(`cannot find install path of dependency '${dependency}' in directory '${directory}'`);
    },
  };
}

export function getNodeModulesInstallPathsOf(dependency: string) {
  return {
    startingFrom(directory: string) {
      const paths = [];
      const rootPath = process.cwd();
      let currentDirectory = directory;
      while (true) {
        paths.push(join(currentDirectory, 'node_modules', dependency));
        paths.push(join(currentDirectory, '..', dependency));
        currentDirectory = join(currentDirectory, '..');
        if (currentDirectory.length <= rootPath.length) {
          return paths;
        }
      }
    },
  };
}

export function getProductionDependenciesInfosOf(filename: string) {
  return {
    inDirectory(directory: string): DependencyInfo[] {
      const result: DependencyInfo[] = [];
      const dependencies = getProductionDepenciesOf(filename).inDirectory(directory);
      dependencies.forEach((dependency) => {
        const path = findInstallPathOfDependency(dependency).startingFrom(directory);
        const pkg = read('package.json')
          .inDirectory(path)
          .asJson();
        result.push({ graph: [dependency], name: dependency, path, version: pkg.version, licences: [] });
      });
      return result;
    },
  };
}

export interface DependencyInfo {
  graph: string[];
  name: string;
  path: string;
  version: string;
  licences: string[];
}

export function getProductionDependenciesGraphOf(filename: string) {
  return {
    inDirectory(directory: string) {
      return {
        withMaxLevels(maxLevels: number): DependencyInfo[] {
          let rootDependencies = getProductionDependenciesInfosOf(filename).inDirectory(directory);
          let allDependencies = rootDependencies;
          let numberOfIterations = 0;
          while (true) {
            const allChildDependencies: DependencyInfo[] = [];
            rootDependencies.forEach((dependencyInfo) => {
              const childDependencies = getProductionDependenciesInfosOf(filename).inDirectory(dependencyInfo.path);
              childDependencies.forEach((childDependency) => {
                allChildDependencies.push({
                  graph: [...dependencyInfo.graph, ...childDependency.graph],
                  licences: [],
                  name: childDependency.name,
                  path: childDependency.path,
                  version: childDependency.version,
                });
              });
            });
            if (allChildDependencies.length === 0) {
              break;
            }
            allDependencies = allDependencies.concat(allChildDependencies);
            rootDependencies = allChildDependencies;
            numberOfIterations += 1;
            if (numberOfIterations > maxLevels) {
              throw new Error(`The dependency graph is too deep: it has more than ${maxLevels} levels`);
            }
          }
          return allDependencies;
        },
      };
    },
  };
}

export function addLicenceInfoIn(dependencies: DependencyInfo[]) {
  const licenseCheckerPath = join(
    __dirname,
    '..',
    '..',
    '..',
    'node_modules',
    'license-checker',
    'bin',
    'license-checker',
  );
  const executionResult = exec(
    `node ${licenseCheckerPath} --json --production --excludePrivatePackages --start ${process.cwd()}`,
  );
  const licensesInfos = JSON.parse(executionResult) as ModuleInfos;
  dependencies.forEach((dependencyInfo) => {
    const packageNameAndVersion = `${dependencyInfo.name}@${dependencyInfo.version}`;
    dependencyInfo.licences = getLicencesFrom(licensesInfos[packageNameAndVersion]);
  });
}

export function getLicencesFrom(moduleInfo: ModuleInfo): string[] {
  if (moduleInfo && Array.isArray(moduleInfo.licenses) && moduleInfo.licenses.length > 0) {
    return moduleInfo.licenses;
  }
  if (moduleInfo && typeof moduleInfo.licenses === 'string') {
    return [moduleInfo.licenses];
  }

  return ['unknown'];
}
