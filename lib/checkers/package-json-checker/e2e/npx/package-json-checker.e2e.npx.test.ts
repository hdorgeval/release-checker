import { readFileSync } from 'fs';
import { join } from 'path';
import { exec } from '../../../../utils/exec-sync';
import { read } from '../../../../utils/read-package-json';
import { packageJsonChecker } from '../../index';

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
  const testingRepo = join(__dirname, 'testing-repo-for-release-checker');
  exec(`npm run rimraf -- ${testingRepo} `);
  process.chdir(__dirname);
  exec('git clone https://github.com/hdorgeval/testing-repo-for-release-checker.git');
  process.chdir(testingRepo);
});
afterEach(() => {
  process.chdir(nativeCwd);
});

test('It should execute on command `npx release-checker`  ', () => {
  // Given
  const logFile = 'npx-release-checker.log';
  const command = `npx ${packageFilepath} > ${logFile} `;

  // When
  exec(command);

  // Then
  const output = readFileSync(logFile).toString();
  expect(output).toContain(packageJsonChecker.statusToDisplayWhileValidating);
});

test('It should execute on command `npx release-checker --test`  ', () => {
  // Given
  const logFile = 'npx-release-checker.log';
  const command = `npx ${packageFilepath} --test > ${logFile} `;

  // When
  exec(command);

  // Then
  const output = readFileSync(logFile).toString();
  expect(output).toContain(packageJsonChecker.statusToDisplayWhileValidating);
});
