
import {readFileSync} from 'fs';
import {join} from 'path';
import { exec } from '../../lib//utils/exec-sync';
import { usage } from '../../lib/cli-options/usage';

describe('npm globall install - CLI options parsing', () => {
  let nativeCwd: string;
  let packageFilename: string;
  let packageFilepath: string;
  let packageName: string;

  beforeAll(() => {
    const packageDotJson: any = JSON.parse(readFileSync(join(process.cwd(), 'package.json')).toString());
    packageName = packageDotJson.name;
    packageFilename = `${packageDotJson.name}-${packageDotJson.version}.tgz`;
    packageFilepath  = join(process.cwd(),packageFilename);
    
    const installCommand = `npm install -g ${packageFilepath}`;
    exec(installCommand);
  })
  beforeEach(() => {
    nativeCwd = process.cwd();
  });
  afterEach(() => {
    process.chdir(nativeCwd);
  });
  afterAll(() => {
    const uninstallCommand = `npm uninstall -g ${packageName}`;
    exec(uninstallCommand);
  })

  test('It should detect no options on command `release-checker` ', () => {
    // Given
    const command = `${packageName}`;

    // When
    const result = exec(command);
    console.log(result);
   
    // Then
    expect(result).toContain(usage);
  });
});