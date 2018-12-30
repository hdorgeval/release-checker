import { join } from 'path';
import { usage } from '../../lib/cli-options/usage';
import { exec } from '../../lib/utils/exec-sync';
import { readPackageDotJsonInCurrentWorkingDirectory } from '../../lib/utils/read-package-json';
import { packageJsonValidator } from '../../lib/validators/package-json-validator/index';

let nativeCwd: string;
let packageFilename: string;
let packageFilepath: string;
let packageName: string;
beforeAll(() => {
  const packageDotJson = readPackageDotJsonInCurrentWorkingDirectory();
  packageName = packageDotJson.name;
  packageFilename = `${packageDotJson.name}-${packageDotJson.version}.tgz`;
  packageFilepath = join(process.cwd(), packageFilename);
  exec(`npm uninstall -g ${packageName}`);
});
beforeEach(() => {
  nativeCwd = process.cwd();
});
afterEach(() => {
  process.chdir(nativeCwd);
});

test.skip('It should execute default validations on command `npx release-checker` ', () => {
  // Given
  const command = `npx ${packageFilepath}`;

  // When
  const result = exec(command);

  // Then
  expect(result).toContain(packageJsonValidator.statusToDisplayWhileValidating);
});

test('It should show usage on command `npx release-checker --help` ', () => {
  // Given
  const command = `npx ${packageFilepath} --help`;

  // When
  const result = exec(command);

  // Then
  expect(result).toContain(usage);
});

test('It should show usage on command `npx release-checker -h` ', () => {
  // Given
  const command = `npx ${packageFilepath} -h`;

  // When
  const result = exec(command);

  // Then
  expect(result).toContain(usage);
});
