import { DumpInformation } from "@/types";
import { Log } from "../constants";
import { S3Sender } from "../storage"
import * as fs from "fs";



export const storageHandler = async (dumpInfo: DumpInformation,destinations: string[]) => {

  for (const store of destinations) {
    switch (store) {
      case 's3': {
        const s3 = new S3Sender({
            fileName:dumpInfo.compressedFilePath.split("/").pop()||"",
            fileContent: fs.readFileSync(dumpInfo.compressedFilePath)
          });
          s3.send();
        break;
        }
      case 'local':
        console.log("Saved to local machine.")
        break;

      default:
        console.error(
          `[-] Unsupported storage service.`
        );
        Log.error(`Unsupported storage service`);
    }
  }
};


