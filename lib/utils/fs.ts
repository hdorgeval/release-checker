import { unlinkSync } from 'fs';
import { join } from 'path';

export function removeFile(filename: string) {
  return {
    fromDirectory(directory: string) {
      try {
        const file = join(directory, filename);
        unlinkSync(file);
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
