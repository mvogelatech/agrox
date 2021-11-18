import { CromaiParserService, IDiagnosisReport } from './cromaitask.service';
export declare class DiagnosisDTO {
    accessToken: string;
    diagnosis: Record<string, IDiagnosisReport>;
}
export declare class CromaiController {
    private readonly diagnosisParser;
    constructor(diagnosisParser: CromaiParserService);
    updateDiagnosisData(data: DiagnosisDTO): Promise<void>;
}
