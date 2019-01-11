import { readFileSync } from 'fs';
import { join } from 'path';
import { exec } from '../../lib//utils/exec-sync';
import { packageJsonValidator } from '../../lib/checkers/package-json-checker/index';
import { usage } from '../../lib/cli-options/usage';
import { read } from '../../lib/utils/read-package-json';
import { addScript } from '../../lib/utils/update-package-json';

let nativeCwd: string;
let packageFilename: string;
let packageFilepath: string;
let packageName: string;

beforeAll(() => {
  exec('npm run rimraf -- testing-repo-for-release-checker ');
  exec('git clone https://github.com/hdorgeval/testing-repo-for-release-checker.git');

  const packageDotJson = read('package.json')
    .inDirectory(process.cwd())
    .asJson();
  packageName = packageDotJson.name;
  packageFilename = `${packageDotJson.name}-${packageDotJson.version}.tgz`;
  packageFilepath = join(process.cwd(), packageFilename);
});
beforeEach(() => {
  nativeCwd = process.cwd();
  process.chdir('testing-repo-for-release-checker');
  exec(`npm install --save-dev ${packageFilepath}`);
  addScript(`${packageName}`)
    .withKey(`${packageName}`)
    .inside('package.json')
    .ofDirectory(process.cwd());
});
afterEach(() => {
  process.chdir(nativeCwd);
});
afterAll(() => {
  // exec('npm run rimraf -- testing-repo-for-release-checker ');
});

test.skip('It should execute default validations on command `npm run release-checker` ', () => {
  // Given
  const logFile = 'npm-run-release-checker.log';
  const command = `npm run ${packageName} > ${logFile}`;

  // When
  exec(command);

  // Then
  const output = readFileSync(logFile).toString();
  expect(output).toContain(packageJsonValidator.statusToDisplayWhileValidating);
});

test('It should show usage on command `npm run release-checker -- --help` ', () => {
  // Given
  const command = `npm run ${packageName} -- --help`;

  // When
  const result = exec(command);

  // Then
  expect(result).toContain(usage);
});

test('It should show usage on command `npm run release-checker -- -h` ', () => {
  // Given
  const command = `npm run ${packageName} -- -h`;

  // When
  const result = exec(command);

  // Then
  expect(result).toContain(usage);
});
