import { readFileSync } from 'fs';
import { join } from 'path';
import { packageJsonChecker } from '../../lib/checkers/package-json-checker/index';
import { usage } from '../../lib/cli-options/usage';
import { exec } from '../../lib/utils/exec-sync';
import { read } from '../../lib/utils/read-package-json';

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
  const logFile = 'npx-release-checker.log';
  const command = `npx ${packageFilepath} > ${logFile} `;

  // When
  exec(command);

  // Then
  const output = readFileSync(logFile).toString();
  expect(output).toContain(packageJsonChecker.statusToDisplayWhileValidating);
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
