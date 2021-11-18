import { QuotationService } from './quotation.service';
import { MailService } from '../mail/mail.service';
import { AgroRequest } from '../types';
export declare class QuotationDto {
    pulverizationStartDate: string;
    pulverizationEndDate: string;
    fieldsWithMethods: Record<string, number>;
}
export declare class QuotationController {
    readonly quotationService: QuotationService;
    readonly mailService: MailService;
    constructor(quotationService: QuotationService, mailService: MailService);
    createQuotation(req: AgroRequest, quotation: QuotationDto): Promise<string>;
    getQuotationPackages(req: AgroRequest): Promise<string>;
}
