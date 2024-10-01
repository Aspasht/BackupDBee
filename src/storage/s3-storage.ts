import {Sender, type SenderOption } from "@/types";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { storage } from "../utils";
import chalk from "chalk";

const endpoint= storage.s3.endpoint
const bucket = storage.s3.bucket_name
const region = storage.s3.region
const accessKey = storage.s3.access_key
const secretAccessKey = storage.s3.secret_key

export class S3Sender implements Sender {
  private static s3ClientInstance: S3Client | null = null;
  private static getS3ClientInstance(): S3Client {
    if (!S3Sender.s3ClientInstance) {
      S3Sender.s3ClientInstance = new S3Client({
        endpoint: endpoint || 'https://s3.amazonaws.com',
        region: region,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretAccessKey
        },
      });
    }
    return S3Sender.s3ClientInstance;
  }

  private options: SenderOption;
  constructor(options?: SenderOption) {
    this.options = options || { fileName: '', fileContent: undefined };
  }

  // Method to validate file information
  validate(fileName?: string): void {
    if (!fileName) {
      throw new Error("[-] File name is not set");
    }
  }

  // Method to upload file to S3
  async uploadToS3(fileName?: string, fileContent?: unknown) {
    try {
      const uploadParams = {
        Bucket: bucket,
        Key: fileName,
        Body: fileContent,
        ContentType: "application/octet-stream",
      };

      const command = new PutObjectCommand(
        uploadParams as PutObjectCommandInput
      );
      const s3Client = S3Sender.getS3ClientInstance();

      const response = await s3Client.send(command);
      console.log(chalk.green(`[+] File uploaded successfully to aws s3 "${bucket}" bucket:`, response.$metadata.httpStatusCode, 'OK'));
    } catch (err) {
      console.error("[-] Error uploading file:", err);
    }
  }

  // Method to send file to S3
  async send(options?: SenderOption): Promise<void> {
    try {
      if (options?.fileName) {
        this.options.fileName = options.fileName;
      }
      if (options?.fileContent) {
        this.options.fileContent = options.fileContent;
      }
      await this.uploadToS3(this.options.fileName, this.options.fileContent);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`[-] Error sending file to S3: ${error.message}`);
      } else {
        console.error(`[-] Unknown error occurred.`);
      }
    }
  }


  // list all backups available
  async listObjects(): Promise<void> {
    try {
      const listParams: ListObjectsV2CommandInput = {
        Bucket: bucket,
      };

      const command = new ListObjectsV2Command(listParams);
      const s3Client = S3Sender.getS3ClientInstance(); 

      const response = await s3Client.send(command);
      if (response.Contents) {
        console.log("[+] Objects in S3 bucket:");
        response.Contents.forEach((object) => {
          console.log(`- ${object.Key} (Last Modified: ${object.LastModified})`);
        });
      } else {
        console.log("[-] No objects found in the bucket.");
      }
    } catch (err) {
      console.error("[-] Error listing objects in S3:", err);
    }
  }
}
