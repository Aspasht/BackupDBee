/* eslint-disable no-undef */
import { spawnDumpProcess } from '../utils';
import type { Database } from  '@/types'


export const handlePostgresDump = (database: Database) => {
    const args = ["-h", database.host, "-U", database.username, "-d", database.db_name];
    const env = {...process.env,PGPASSWORD: database.password };
    const dump = spawnDumpProcess("pg_dump", args, env);
    return dump;
};
