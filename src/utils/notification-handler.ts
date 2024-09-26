import type { Notification } from "@/types";
import { SlackNotifier,DiscordNotifier,TelegramNotifier,CustomNotifier } from "../notifiers";

export const notificationHandler = (platforms:string[],notification:Notification,databaseName:string,message:string) => {
 
  for (const platform of platforms) {
  switch (platform){
    case 'slack': {
      const sendSlackNotification = new SlackNotifier(notification.webhooks.slack, message)
      sendSlackNotification.validate()
      sendSlackNotification.notify()
      break
    }
    case 'discord': {
      const sendDiscordNotification = new DiscordNotifier(notification.webhooks.discord, message)
      sendDiscordNotification.validate()
      sendDiscordNotification.notify()
      break
    }
    case 'telegram': {
      const sendTelegramNotification = new TelegramNotifier(notification.webhooks.telegram, message)
      sendTelegramNotification.validate()
      sendTelegramNotification.notify()
      break
    }  
    default: {
      const sendCustomNotification = new CustomNotifier(notification.webhooks.custom,message)
      sendCustomNotification.validate()
      sendCustomNotification.notify()
    }
     
    continue
}

  }  
 }
