import { RecordService } from './record.service';
import { QuotationService } from '../quotation/quotation.service';
import { MailService } from '../mail/mail.service';
export declare class RecordController {
    private readonly RecordService;
    readonly quotationService: QuotationService;
    readonly mailService: MailService;
    constructor(RecordService: RecordService, quotationService: QuotationService, mailService: MailService);
    getDiagnosisWithMap(field_id: string): Promise<string>;
    updateDiagnosisData(req: any, record: any): Promise<string>;
}
