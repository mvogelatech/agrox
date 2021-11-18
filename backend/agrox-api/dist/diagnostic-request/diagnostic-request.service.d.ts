/// <reference types="node" />
export declare class DiagnosisReportService {
    private readonly logger;
    generateFieldDiagnosisPNG(diagnosisId: number, mapDatePath?: string, zoom?: number): Promise<Buffer | never[]>;
}
