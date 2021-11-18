import { NotificationService } from './notification.service';
export declare class NotifySimpleMessageDto {
    accessToken: string;
    userId: number;
    messageTitle: string;
    messageContent: string;
}
declare class SetReadDto {
    notificationId: number;
}
export declare class NotifySimpleMessageLinkDto extends NotifySimpleMessageDto {
    link: string;
}
export declare class NotifySomethingReadyDto {
    accessToken: string;
    userId: number;
    genericId: number;
    messageTitle: string;
    messageContent: string;
}
export declare class NotificationController {
    readonly notificationService: NotificationService;
    constructor(notificationService: NotificationService);
    setRead(data: SetReadDto): Promise<void>;
}
export declare class SendNotificationController {
    readonly notificationService: NotificationService;
    constructor(notificationService: NotificationService);
    notifySimpleMessage(data: NotifySimpleMessageDto): Promise<void>;
    notifyQuotationReady(data: NotifySomethingReadyDto): Promise<void>;
    notifyPrescriptionReady(data: NotifySomethingReadyDto): Promise<void>;
    notifyDiagnosisReady(data: NotifySomethingReadyDto): Promise<void>;
    notifyNewTermsAndConditions(data: NotifySimpleMessageDto): Promise<void>;
    notifyAppUpdate(data: NotifySimpleMessageLinkDto): Promise<void>;
}
export {};
