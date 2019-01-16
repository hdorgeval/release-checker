import { AllSensitiveDataPatterns, packagedFile, readSensitiveDataIn } from './index';

let nativeCwd: string;
let allSensitiveDataPatterns: AllSensitiveDataPatterns;

interface TestData {
  filepath: string;
  isSensitiveData: boolean;
}

const testData: TestData[] = [
  // Common files
  { filepath: 'package.json', isSensitiveData: false },

  // Test Files
  { filepath: 'foo.test.ts', isSensitiveData: true },
  { filepath: 'Foo.test.ts', isSensitiveData: true },
  { filepath: 'lib/foo.test.ts', isSensitiveData: true },
  { filepath: 'lib/foo/foo.test.ts', isSensitiveData: true },

  // Private SSH keys
  { filepath: 'foo_rsa.pub', isSensitiveData: false },
];

beforeAll(() => {
  nativeCwd = process.cwd();
  allSensitiveDataPatterns = readSensitiveDataIn(__dirname);
});

afterEach(() => {
  process.chdir(nativeCwd);
});

testData.forEach((data) => {
  test(`It should detect that filepath '${data.filepath}' is ${
    data.isSensitiveData ? 'sensitive data' : 'not sensitive data'
  }`, () => {
    // Given
    const filepath = data.filepath;

    // When
    const result = packagedFile(filepath).isSensitiveData(allSensitiveDataPatterns);

    // Then
    const expectedResult = data.isSensitiveData;
    expect(result).toBe(expectedResult);
  });
});
