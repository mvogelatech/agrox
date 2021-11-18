import { DemandService } from './demand.service';
import { QuotationService } from '../quotation/quotation.service';
import { MailService } from '../mail/mail.service';
export declare class DemandController {
    private readonly RecordService;
    readonly quotationService: QuotationService;
    readonly mailService: MailService;
    constructor(RecordService: DemandService, quotationService: QuotationService, mailService: MailService);
    getDiagnosisWithMap(field_id: string): Promise<string>;
    updateDiagnosisData(req: any, demand: any): Promise<string>;
}
