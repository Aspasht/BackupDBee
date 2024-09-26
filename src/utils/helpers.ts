import { existsSync, mkdirSync,rmSync } from "fs";
import { Log } from "../constants";
import {
  exec,
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptionsWithoutStdio,
} from "child_process";
import { promisify } from "util";

export const ensureDirectory = (dirPath: string) => {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  };



export const spawnDumpProcess = (command: string,args: string[],env: Record<string, string | undefined>): ChildProcessWithoutNullStreams => {
  return spawn(command, args, { env } as SpawnOptionsWithoutStdio);
};


// Promisify exec to use with async/await
export const execAsync = promisify(exec);


export const compressFile = async (filePath: string,databaseName:string): Promise<string> => {
  const zipPath = `${filePath}.zip`;
  try {
    await execAsync(`zip -j ${zipPath} ${filePath}`);
    rmSync(filePath); // Remove original file
    return zipPath;
  } catch (err) {
    Log.error(`Error compressing ${databaseName}`);
    throw new Error(`Compression failed for ${filePath}: ${(err as Error).message}`);
  }
};


export const generateTimestamp = (): string => {
  return Date.now().toString();
};