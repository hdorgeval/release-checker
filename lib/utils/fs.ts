import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

export function removeFile(filename: string) {
  return {
    fromDirectory(directory: string) {
      try {
        const sourceFile = join(directory, filename);
        unlinkSync(sourceFile);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // file already deleted
          return;
        }
        throw error;
      }
    },
  };
}

export function copyFile(filename: string) {
  return {
    fromDirectory(sourceDirectory: string) {
      return {
        toDirectory(targetDirectory: string): void {
          const sourceFile = join(sourceDirectory, filename);
          const targetFile = join(targetDirectory, filename);
          if (typeof copyFileSync === 'function') {
            copyFileSync(sourceFile, targetFile);
            return;
          }
          writeFileSync(targetFile, readFileSync(sourceFile));
        },
      };
    },
  };
}

export function file(filename: string) {
  return {
    existsInDirectory(directory: string) {
      const sourceFile = join(directory, filename);
      return existsSync(sourceFile);
    },
  };
}
