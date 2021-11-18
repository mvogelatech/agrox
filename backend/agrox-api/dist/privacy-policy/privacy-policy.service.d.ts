import { privacy_policy, user_accepted_privacy_policy } from '@prisma/client';
export declare class PrivacyPolicyService {
    getPrivacyPolicy(): Promise<privacy_policy[]>;
    getUserAcceptedPrivacyPolicy(id: number): Promise<user_accepted_privacy_policy | null>;
    createUserAcceptedPrivacyPolicy(userId: number, privacyPolicyId: number): Promise<user_accepted_privacy_policy | null>;
}
