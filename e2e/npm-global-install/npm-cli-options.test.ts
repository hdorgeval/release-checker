import { readFileSync } from 'fs';
import { join } from 'path';
import { exec } from '../../lib//utils/exec-sync';
import { usage } from '../../lib/cli-options/usage';
import { read } from '../../lib/utils/read-package-json';
import { packageJsonValidator } from '../../lib/validators/package-json-validator/index';

let nativeCwd: string;
let packageFilename: string;
let packageFilepath: string;
let packageName: string;

beforeAll(() => {
  const packageDotJson = read('package.json')
    .inDirectory(process.cwd())
    .asJson();
  packageName = packageDotJson.name;
  packageFilename = `${packageDotJson.name}-${packageDotJson.version}.tgz`;
  packageFilepath = join(process.cwd(), packageFilename);

  const installCommand = `npm install -g ${packageFilepath}`;
  exec(installCommand);
});
beforeEach(() => {
  nativeCwd = process.cwd();
});
afterEach(() => {
  process.chdir(nativeCwd);
});
afterAll(() => {
  const uninstallCommand = `npm uninstall -g ${packageName}`;
  exec(uninstallCommand);
});

test.skip('It should execute default validations on command `release-checker` ', () => {
  // Given
  const logFile = 'release-checker.log';
  const command = `${packageName} > ${logFile}`;

  // When
  exec(command);

  // Then
  const output = readFileSync(logFile).toString();
  expect(output).toContain(packageJsonValidator.statusToDisplayWhileValidating);
});

test('It should show usage on command `release-checker --help` ', () => {
  // Given
  const command = `${packageName} --help`;

  // When
  const result = exec(command);

  // Then
  expect(result).toContain(usage);
});

test('It should show usage on command `release-checker -h` ', () => {
  // Given
  const command = `${packageName} -h`;

  // When
  const result = exec(command);

  // Then
  expect(result).toContain(usage);
});
