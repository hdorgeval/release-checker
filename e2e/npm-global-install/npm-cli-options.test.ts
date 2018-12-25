import { join } from 'path';
import { exec } from '../../lib//utils/exec-sync';
import { usage } from '../../lib/cli-options/usage';
import { readPackageDotJsonInCurrentWorkingDirectory } from '../../lib/utils/read-package-json';

describe('npm globall install - CLI options parsing', () => {
  let nativeCwd: string;
  let packageFilename: string;
  let packageFilepath: string;
  let packageName: string;

  beforeAll(() => {
    const packageDotJson = readPackageDotJsonInCurrentWorkingDirectory();
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

  test('It should detect no option on command `release-checker` ', () => {
    // Given
    const command = `${packageName}`;

    // When
    const result = exec(command);

    // Then
    expect(result).toContain(usage);
  });

  test('It should show usage on command `release-checker --yo` ', () => {
    // Given
    const command = `${packageName} --yo`;

    // When
    const result = exec(command);

    // Then
    expect(result).toContain(usage);
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
});
