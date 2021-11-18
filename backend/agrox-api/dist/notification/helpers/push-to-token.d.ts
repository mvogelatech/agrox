import { notification } from '@prisma/client';
export declare type PushNotificationData = {
    messageTitle?: string;
    messageContent?: string;
    agroNotification: notification;
    silent: boolean;
};
export declare function sendPushNotificationToToken(deviceToken: string, data: PushNotificationData): Promise<void>;
