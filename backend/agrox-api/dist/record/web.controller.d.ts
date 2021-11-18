import { WebService } from './web.service';
import { QuotationService } from '../quotation/quotation.service';
import { MailService } from '../mail/mail.service';
declare type BODY = {
    data: string;
};
export declare class RecordController {
    private readonly RecordService;
    readonly quotationService: QuotationService;
    readonly mailService: MailService;
    constructor(RecordService: WebService, quotationService: QuotationService, mailService: MailService);
    updateDiagnosisData(body: BODY): Promise<any>;
}
export {};
