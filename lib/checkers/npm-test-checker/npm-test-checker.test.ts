import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from '../../utils/exec-sync';
import { PackageDotJson } from '../../utils/read-package-json';
import { npmTestChecker } from './index';

let nativeProcessArgv: string[];
let tempFolder: string;
let nativeCwd: string;

beforeAll(() => {
  nativeCwd = process.cwd();
  nativeProcessArgv = process.argv;
  tempFolder = join(__dirname, 'tmp');
  exec(`npm run rimraf -- ${tempFolder}`);
  mkdirSync(tempFolder);
});
beforeEach(() => {
  process.chdir(tempFolder);
});
afterEach(() => {
  process.chdir(nativeCwd);
  process.argv = nativeProcessArgv;
});
test('It should always run', () => {
  // Given
  const checker = npmTestChecker;

  // When
  const result = checker.canRun && checker.canRun();

  // Then
  expect(result).toBe(true);
});

test('It should throw an exception when test script is missing in package.json', () => {
  // Given
  const checker = npmTestChecker;
  const pkg: Partial<PackageDotJson> = { name: 'testing-repo', version: '1.0.0', scripts: {} };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  // Then
  const expectedError = new Error(`script 'test' in package.json file is missing`);
  expect(() => checker.run && checker.run()).toThrowError(expectedError);
});

test('It should throw an exception when test script exit with code 1', () => {
  // Given
  const checker = npmTestChecker;
  const pkg: Partial<PackageDotJson> = {
    name: 'testing-repo',
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    version: '1.0.0',
  };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  // Then
  const expectedError = `Command failed: npm test
npm ERR! Test failed.  See above for more details.`;
  expect(() => checker.run && checker.run()).toThrowError(expectedError);
});

test('It should not throw an exception when test script is successfull', () => {
  // Given
  const checker = npmTestChecker;
  const pkg: Partial<PackageDotJson> = {
    name: 'testing-repo',
    scripts: {
      test: 'echo "tests successfull"',
    },
    version: '1.0.0',
  };
  const pkgFilepath = join(tempFolder, 'package.json');
  writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2));

  // When
  const result = checker.run && checker.run();

  // Then
  expect(result).toEqual([]);
});
