import { AgroRequest } from '../types';
import { NotificationService } from './notification.service';
export declare class RegisterFCMTokenDto {
    token: string;
}
export declare class RegisterFCMTokenController {
    readonly notificationService: NotificationService;
    constructor(notificationService: NotificationService);
    createQuotation(req: AgroRequest, data: RegisterFCMTokenDto): Promise<void>;
}
