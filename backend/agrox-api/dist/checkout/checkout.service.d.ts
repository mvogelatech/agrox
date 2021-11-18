import { quotation_checkout } from '@prisma/client';
export declare class CheckoutService {
    getMails(): Promise<string[]>;
    getCheckout(): Promise<quotation_checkout[]>;
    getCheckoutGroups(userId: number): Promise<quotation_checkout[][]>;
    getMessageData(id: number, checkoutPackage: any): Promise<string>;
    createCheckout(userId: number, selectedPrice: string, quotationID: number): Promise<quotation_checkout>;
    private getCheckoutById;
    private getPriceAsEnum;
    private rightPadStringWithDashes;
}
