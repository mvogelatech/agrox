import { terms_and_conditions, user_accepted_terms } from '@prisma/client';
export declare class TermsAndConditionsService {
    getTermsAndConditions(): Promise<terms_and_conditions[]>;
    getUserAcceptedTerms(id: number): Promise<user_accepted_terms | null>;
    createUserAcceptedTerms(userId: number, termsId: number): Promise<user_accepted_terms | null>;
}
