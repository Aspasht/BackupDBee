import fs from "fs";
import { parse } from "yaml";
import { AppConfig } from "@/types";


let cachedConfig: AppConfig | null = null; 

function loadConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }
  const configFile = fs.readFileSync("backupdbee.yaml", "utf-8");
  const config = parse(configFile);

  cachedConfig = config;

  return config;
}


export const { general,database,storage,notification }:AppConfig = loadConfig();
