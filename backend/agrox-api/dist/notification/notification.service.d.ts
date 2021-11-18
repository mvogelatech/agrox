export declare type SimpleMessageNotificationData = {
    title: string;
    message: string;
};
export declare type SimpleMessageLinkNotificationData = {
    title: string;
    message: string;
    link: string;
};
export declare type ReadyNotificationData = {
    title: string;
    message: string;
    genericId: number;
};
export declare class NotificationService {
    saveUserToken(userId: number, token: string): Promise<void>;
    setNotificationRead(id: number): Promise<void>;
    sendSimpleMessageNotification(userId: number, data: SimpleMessageNotificationData): Promise<void>;
    sendTermsAndConditionsNotification(userId: number, data: SimpleMessageNotificationData): Promise<void>;
    sendQuotationReadyNotification(userId: number, data: ReadyNotificationData): Promise<void>;
    sendPrescriptionReadyNotification(userId: number, data: ReadyNotificationData): Promise<void>;
    sendDiagnosisReadyNotification(userId: number, data: ReadyNotificationData): Promise<void>;
    sendAppUpdateNotification(userId: number, data: SimpleMessageLinkNotificationData): Promise<void>;
    private getUserTokens;
    private createAndSendNotification;
    private prismaCreateNotification;
    private sendPushNotificationToUser;
}
