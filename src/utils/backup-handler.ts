import { createWriteStream, rmSync } from "fs";
import path from "path";
import type { Database, DumpInformation } from "@/types";
import { handleMysqlDump, handlePostgresDump } from "../database";
import { ensureDirectory, compressFile, generateTimestamp } from "../utils/helpers";
import { Log } from "../constants";


const prepareBackupDir = (): string => {
  const backupDir = path.resolve("backups");
  ensureDirectory(backupDir);
  return backupDir;
};

const handleDumpProcess = (
  databaseName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dumpedContent: any,
  backupDir: string,
  timeStamp: string
): Promise<{ compressedFilePath: string; databaseName: string }> => {
  return new Promise((resolve, reject) => {
    
    const dumpFileName = `${timeStamp}-${databaseName}.dump.sql`;
    const dumpFilePath = path.resolve(backupDir, dumpFileName);
    const writeStream = createWriteStream(dumpFilePath);

    let errorMsg: string | null = null;

    dumpedContent.stdout.pipe(writeStream);

    // Capture errors from stderr
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dumpedContent.stderr.on("data", (chunk: any) => {
      errorMsg = chunk.toString();
      console.error(`[!] Error occurred while dumping ${databaseName}: ${errorMsg}`);
    });

    dumpedContent.on("error", (err: unknown) => {
      reject(new Error(`[-] Error writing dump file for ${databaseName}: ${(err as Error).message}`));
    });

    dumpedContent.on("close", async (code: number) => {
      if (code !== 0 || errorMsg) {
        rmSync(dumpFilePath); // remove unsuccessful dump files
        reject(new Error(`[-] Dump process failed for ${databaseName}`));
        return;
      }

      try {
        console.log(`[+] Backup of ${databaseName} completed successfully`);
        const compressedFilePath = await compressFile(dumpFilePath, databaseName);
        resolve({ compressedFilePath, databaseName });
      } catch (err: unknown) {
        reject(new Error(`[-] Error compressing backup for ${databaseName}: ${(err as Error).message}`));
      }
    });
  });
};




// Factory function to create the appropriate dump handler based on database type
const MYSQL = 'mysql'
const POSTGRES = 'postgres'
const createDumpHandler = (databaseType: string) => {
  switch (databaseType) {
    case MYSQL:
      return handleMysqlDump;
    case POSTGRES:
      return handlePostgresDump;
    default:
      throw new Error(`[-] Unsupported database type: ${databaseType}`);
  }
};

export const backupHandler = async (database: Database): Promise<DumpInformation> => {
  const backupDir = prepareBackupDir();
  const timeStamp = generateTimestamp();

    try {
      const dumpHandler = createDumpHandler(database.type);
      const dumpResult = await dumpHandler(database);
      const result = await handleDumpProcess(
        database.name,
        dumpResult,
        backupDir,
        timeStamp
      );

      return result
    } catch (error) {
      // Log the error and continue to the next database
      Log.error(`[!] Backup failed for ${database.name}: ${(error as Error).message}`);
      return {
        compressedFilePath:'',
        databaseName:database.name
      }
    }
  }

