declare const NOTIFICATION_TYPE_TO_MAGIC_NUMBER: {
    DIAGNOSIS: number;
    QUOTATION: number;
    PRESCRIPTION: number;
    MESSAGE: number;
    TERMS: number;
    APPUPDATE: number;
};
export declare type NotificationType = keyof typeof NOTIFICATION_TYPE_TO_MAGIC_NUMBER;
export declare function notificationTypeToMagicNumber(type: NotificationType): number;
export {};
