import { InputJsonArray } from '@prisma/client';
interface IInfestation {
    plagueName: string;
    points: InputJsonArray;
    infectedArea: number;
}
export interface IDiagnosisReport {
    infestations: Record<string, IInfestation>;
    reportDate: string;
}
export declare class CromaiParserService {
    private readonly logger;
    updateFieldPlagueDiagnosisData(diagnosisReportData: Record<string, IDiagnosisReport>): Promise<void>;
}
export {};
