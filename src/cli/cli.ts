import type { Database} from "@/types";
import {  Command } from "commander";
import process from "process";
import chalk from "chalk";
import { database,notification,notificationHandler,backupHandler } from "../utils";

const program = new Command();


program
.name('backupdbee')
.description('Backup multiple databases at once')
.version('0.0.1','-v,--version','    new version message')
.helpOption('-h, --help',"    Display help")



program
  .option("-d, --database [database names]", "    Backup single or multiple database name",(value:string) => {
    return value === undefined ? true : value; })
  .option("-n, --notify [database names]", "    Backup single or multiple database name",(value:string) => {
    return value === undefined ? true : value; })
  .option("-l, --list", "    List of all the available databases or notification configuration")
  

program.on('--help', function(){
  console.log('\n')
  console.log('\n Examples:');
  console.log(`    $ backupdbee --database=${chalk.green("<database name> default:all")}       ;for multiple databases pass comma separated values`);
  console.log(`    $ backupdbee --database --list                            ;list all available databases`);
  console.log(`    $ backupdbee --notify --list                              ;list all available notification service`);
  
  console.log('');
});
  
program.showHelpAfterError(chalk.cyan(`(Use --help for additional information)`));

program.parse(process.argv);
const options = program.opts();

let selectedDatabase:Database[] = []
let selectedNotifier:string[] = []

if (options.database === true) {
  selectedDatabase = database
  if (options.list) {
    const spaces = '          '; 
    const bullet = '•';
    console.log(chalk.green.underline('Available databases:'))
    for (const db of database) {
    console.log(chalk.cyan(`${spaces}${chalk.bold(bullet)} ${db.name}`)) 
    }
    process.exit(0)
    
  }
} else if (typeof options.database === 'string') {
  const args = sanitizeArguments(options.database);
  for (const db of args) {
    selectedDatabase = database.filter(d => d.name === db);
  }
} else {
  console.log("No flags provided. Use '--help' for more information");
}


if (options.notify === true||options.notify===false) {
  const availablePlatforms = ['slack', 'discord', 'telegram', 'custom'];
  selectedNotifier=availablePlatforms
  let availableList:string[] = []
    Object.keys(notification).map(key=>availableList.push(key))
    Object.keys(notification.webhooks).map(key=>availableList.push(key))
    availableList=availableList.filter(item=> item!='webhooks')
    const spaces = '             '; 
    const bullet = '•';
    console.log(chalk.green.underline('Notification services:'))
    for (const list of availableList) {
      console.log(chalk.cyan(`${spaces}${chalk.bold(bullet)} ${list}`))
    }
    process.exit(0)
} else if (typeof options.notify === 'string') {
   selectedNotifier = sanitizeArguments(options.notify);
} else {
  console.log("No flags provided for notification service. Use '--help' for more information");
}




function sanitizeArguments(args:string) {
  const result = (args.startsWith("=") ? args.slice(1) : args || "").split(",");
  return result
}



const main=async (selectedDatabase:Database[],selectedNotifier:string[])=>{
 
  for (const database of selectedDatabase) {
    try {
      const dumpInfo = await backupHandler(database)
      if (dumpInfo.compressedFilePath) {
        const message = `${new Date()}     ✅ Success:  Backup completed successfully for database: "${dumpInfo.databaseName}"`;
        notificationHandler(selectedNotifier,notification,dumpInfo.databaseName,message)
      } else {
        const message = `${new Date()}     ❌ Failed:  Backup failed for database: "${dumpInfo.databaseName}"`;
        notificationHandler(selectedNotifier,notification,dumpInfo.databaseName,message)
      }  
    } catch(err) {
      console.log(err)
    }
  
}
}

main(selectedDatabase,selectedNotifier)






