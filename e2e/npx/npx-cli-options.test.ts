
import {readFileSync} from 'fs';
import {join} from 'path';
import { exec } from '../../lib/utils/exec-sync';
import { usage } from '../../lib/cli-options/usage';

describe('npx - CLI options parsing', () => {
  let nativeCwd: string;
  let packageFilename: string;
  let packageFilepath: string;
  beforeAll(() => {
    const packageDotJson: any = JSON.parse(readFileSync(join(process.cwd(), 'package.json')).toString());
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
    console.log(result);
   
    // Then
    expect(result).toContain(usage);
  });
});