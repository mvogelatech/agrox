import { CompanyService } from './company.service';
export declare class CompanyController {
    readonly companyService: CompanyService;
    constructor(companyService: CompanyService);
    getCompanies(): Promise<string>;
}
