import { CheckoutService } from './checkout.service';
import { MailService } from '../mail/mail.service';
import { AgroRequest } from '../types';
export declare class CheckoutDto {
    selectedPrice: string;
    quotationID: number;
}
export declare class CheckoutController {
    readonly checkoutService: CheckoutService;
    readonly mailService: MailService;
    constructor(checkoutService: CheckoutService, mailService: MailService);
    createCheckout(req: AgroRequest, checkout: CheckoutDto): Promise<string>;
    getCheckoutGroups(req: AgroRequest): Promise<string>;
}
