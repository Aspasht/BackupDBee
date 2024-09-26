// import { type DumpInfo,Sender,type Storage } from "@/types";
// import { Log } from "../constants";
// import { EmailSender,S3Sender,LocalSender } from "@/storage"
// import * as fs from "fs";


// export const sendToDestinations = async (dumpInfo: DumpInfo,destinations: Storage[]) => {
//   const sentToDestinations = Object.keys(destinations)
//     .filter((key) => destinations[key as keyof Destinations].enabled)
//     .map((key) => key as keyof Destinations);

//   const senders: Sender[] = [];

//   for (const sendToDestination of sentToDestinations) {
//     switch (sendToDestination.trim().toUpperCase()) {
//       case DESTINATION.EMAIL:
//         Log.info("Sending to email");
//         senders.push(
//           new EmailSender(
//             destinations.email.from,
//             destinations.email.to,
//             dumpInfo.compressedFilePath
//           )
//         );

//         break;
//       case DESTINATION.S3_BUCKET:
//         Log.info("Sending to S3");
//         senders.push(
//           new S3Sender({
//             fileName: `${dumpInfo.dumpFilePath.split("/").pop()}.zip`,
//             fileContent: fs.readFileSync(dumpInfo.compressedFilePath),
//           })
//         );
//         break;

//       case DESTINATION.LOCAL:
//         Log.info("Sending to local");
//         senders.push(
//           new LocalSender(
//             destinations.local.path,
//             dumpInfo.compressedFilePath
//           )
//         )
//         break;

//       default:
//         console.error(
//           `[-] Unsupported notification medium: ${sendToDestination}`
//         );
//         Log.error(`Unsupported notification medium: ${sendToDestination}`);
//     }
//   }
// };


