import {readFileSync} from 'fs';
import {join} from 'path';
export interface PackageDotJson {
    name: string;
    version: string;
}

export function readPackageDotJsonInCurrentWorkingDirectory(): PackageDotJson {
    return JSON.parse(readFileSync(join(process.cwd(), 'package.json')).toString()) as PackageDotJson;
}
