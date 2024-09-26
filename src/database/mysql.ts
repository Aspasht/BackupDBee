import { spawnDumpProcess } from "../utils";
import type { Database } from "@/types";

export const handleMysqlDump = (database: Database) => {

    const args = ["-h", database.host, "-u", database.username, "--databases", database.db_name];
    const env = { MYSQL_PWD: database.password };
    const dump = spawnDumpProcess("mysqldump", args, env);
  
    return dump;
  };