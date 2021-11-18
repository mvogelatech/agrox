import { TermsAndConditionsService } from './terms-and-conditions.service';
import { AgroRequest } from '../types';
declare class SetReadDto {
    termsAndConditionsId: number;
}
export declare class TermsAndConditionsController {
    readonly termsAndConditionsService: TermsAndConditionsService;
    constructor(termsAndConditionsService: TermsAndConditionsService);
    getCompanies(): Promise<string>;
    createUserAcceptedTerms(req: AgroRequest, data: SetReadDto): Promise<string>;
}
export {};
