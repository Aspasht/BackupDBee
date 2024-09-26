import { ChildProcessWithoutNullStreams } from "child_process";


export interface AppConfig {
  general:General
  storage:Storage
  notification: Notification
  database: Database[]
}


export interface General {
  notify: boolean
  notifiers: Notifiers
  storage: Storage
  schedule: " 0 0 0 0 0"
}

export interface Notifiers {
  notifiers: "slack" | "discord" | "custom" | "telegram";
} 

export interface Storage {
  local:Local,
  s3:S3,
  email:Email
} 

export interface Database {
  name: string;
  host: string;
  db_name: string;
  username: string;
  password: string;
  type: "postgres" | "mysql";
  port: number;
};

export interface Local {
  path:string
}

export interface S3 {
  bucket_name:string;
  region: string;
  access_key: string
  secret_key: string
}

export interface Email {
  smtp_server: string
  smtp_port: number
  smtp_username: string
  smtp_password: string
}

export interface Notification {
  email: boolean
  webhooks: NotificationPlatforms
}

export type NotificationPlatforms = {
  slack:string
  discord:string
  telegram:string
  custom:string
}

export type DumpInformation= {
  compressedFilePath:string|null,
  databaseName:string
}






export interface DumpType {
  databaseName: string;
  dumpedContent: ChildProcessWithoutNullStreams;
}

export type DumpInfo = {
  databaseName: string;
  compressedFilePath: string;
  databaseType: string;
  dumpFilePath: string;
  dumpFileName: string;
};


export interface NotifierOption {
  databaseName: string;
  databaseDumpFile?: string;
  databaseDumpPath?: string;
}

export interface Notifier {
  validate(): void;
  notify(): Promise<void>;
}

export interface SenderOption {
  fileName: string;
  fileContent: unknown;
}

export interface Sender {
  validate(): void;
  send(): Promise<void>;
}
