import { DiagnosticService } from './diagnostic.service';
import { MailService } from '../mail/mail.service';
import { AgroRequest } from '../types';
export declare class DiagnosticDto {
    pulverizationStartDate: string;
    pulverizationEndDate: string;
    fieldsWithMethods: Record<string, number>;
}
export declare class DiagnosticController {
    readonly diagnosticService: DiagnosticService;
    readonly mailService: MailService;
    constructor(diagnosticService: DiagnosticService, mailService: MailService);
    createDiagnostic(req: AgroRequest): Promise<string>;
}
