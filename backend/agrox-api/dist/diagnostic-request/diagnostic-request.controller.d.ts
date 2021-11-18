import { DiagnosisReportService } from './diagnostic-request.service';
import { Response } from 'express';
export declare class DiagnosisReportController {
    private readonly diagnosisService;
    constructor(diagnosisService: DiagnosisReportService);
    getDiagnosis(fieldId: string, diagnosisId: string, token: string, res: Response): Promise<void>;
    getDiagnosisWithMap(diagnosisId: string, datePath: string, zoom: string, token: string, res: Response): Promise<void>;
}
