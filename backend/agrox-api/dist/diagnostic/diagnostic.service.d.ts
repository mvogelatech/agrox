export declare class DiagnosticService {
    getMails(): Promise<string[]>;
    getMessageData(id: number, quotationPackage: any): Promise<string>;
    private rightPadStringWithDashes;
}
