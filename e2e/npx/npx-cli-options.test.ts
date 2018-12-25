
import {join} from 'path';
import { exec } from '../../lib/utils/exec-sync';
import { usage } from '../../lib/cli-options/usage';
import { readPackageDotJsonInCurrentWorkingDirectory } from '../../lib/utils/read-package-json';

describe('npx - CLI options parsing', () => {
  let nativeCwd: string;
  let packageFilename: string;
  let packageFilepath: string;
  beforeAll(() => {
    const packageDotJson = readPackageDotJsonInCurrentWorkingDirectory()
    packageFilename = `${packageDotJson.name}-${packageDotJson.version}.tgz`;
    packageFilepath  = join(process.cwd(),packageFilename);
  })
  beforeEach(() => {
    nativeCwd = process.cwd();
  });
  afterEach(() => {
    process.chdir(nativeCwd);
  });

  test('It should detect no options on command `npx release-checker` ', () => {
    // Given
    const command = `npx ${packageFilepath}`;

    // When
    const result = exec(command);
   
    // Then
    expect(result).toContain(usage);
  });
});