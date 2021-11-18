import { WebService } from './web.service';
import { QuotationService } from '../quotation/quotation.service';
import { MailService } from '../mail/mail.service';
declare type BODY = {
    data: string;
};
export declare class WebController {
    private readonly WebService;
    readonly quotationService: QuotationService;
    readonly mailService: MailService;
    constructor(WebService: WebService, quotationService: QuotationService, mailService: MailService);
    getDiagnosisWithMap(diagnosisId: string): Promise<string>;
    getDemands(): Promise<string>;
    updateDiagnosisData(body: BODY): Promise<void>;
}
export {};
