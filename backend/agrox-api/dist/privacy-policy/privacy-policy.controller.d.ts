import { PrivacyPolicyService } from './privacy-policy.service';
import { AgroRequest } from '../types';
declare class SetReadDto {
    privacyPolicyId: number;
}
export declare class PrivacyPolicyController {
    readonly privacyPolicyService: PrivacyPolicyService;
    constructor(privacyPolicyService: PrivacyPolicyService);
    getCompanies(): Promise<string>;
    createUserAcceptedTerms(req: AgroRequest, data: SetReadDto): Promise<string>;
}
export {};
