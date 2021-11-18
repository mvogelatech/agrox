import { quotation_package } from '@prisma/client';
export declare class QuotationService {
    getMails(): Promise<string[]>;
    getQuotationPackages(userId?: number): Promise<quotation_package[]>;
    getMessageData(id: number, quotationPackage: any): Promise<string>;
    createQuotationPackage(userId: number, pulverization_start_date: Date, pulverization_end_date: Date, fieldsWithMethods: Map<number, number>): Promise<quotation_package>;
    private getQuotationPackageById;
    private rightPadStringWithDashes;
}
