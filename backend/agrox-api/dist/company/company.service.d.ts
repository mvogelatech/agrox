import { company } from '@prisma/client';
export declare class CompanyService {
    getCompanies(): Promise<company[]>;
}
