import { join } from 'path';
import { exec } from '../../lib//utils/exec-sync';
import { usage } from '../../lib/cli-options/usage';
import { readPackageDotJsonInCurrentWorkingDirectory } from '../../lib/utils/read-package-json';
import { addScriptInPackageDotJsonOfCurrentWorkingDirectory } from '../../lib/utils/update-package-json';

describe('npm local install - CLI options parsing', () => {
  let nativeCwd: string;
  let packageFilename: string;
  let packageFilepath: string;
  let packageName: string;

  beforeAll(() => {
    exec('npm run rimraf -- testing-repo-for-release-checker ');
    exec('git clone https://github.com/hdorgeval/testing-repo-for-release-checker.git');

    const packageDotJson = readPackageDotJsonInCurrentWorkingDirectory();
    packageName = packageDotJson.name;
    packageFilename = `${packageDotJson.name}-${packageDotJson.version}.tgz`;
    packageFilepath = join(process.cwd(), packageFilename);
  });
  beforeEach(() => {
    nativeCwd = process.cwd();
    process.chdir('testing-repo-for-release-checker');
    exec(`npm install --save-dev ${packageFilepath}`);
    addScriptInPackageDotJsonOfCurrentWorkingDirectory(`${packageName}`, `${packageName}`);
  });
  afterEach(() => {
    process.chdir(nativeCwd);
  });
  afterAll(() => {
    // exec('npm run rimraf -- testing-repo-for-release-checker ');
  });

  test('It should detect no option on command `npm run release-checker` ', () => {
    // Given
    const command = `npm run ${packageName}`;

    // When
    const result = exec(command);

    // Then
    expect(result).toContain(usage);
  });

  test('It should show usage on command `npm run release-checker -- --yo` ', () => {
    // Given
    const command = `npm run ${packageName} -- --yo`;

    // When
    const result = exec(command);

    // Then
    expect(result).toContain(usage);
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
});
