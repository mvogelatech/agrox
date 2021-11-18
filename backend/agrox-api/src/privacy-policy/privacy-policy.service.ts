import { Injectable } from '@nestjs/common';
import { PrismaClient, privacy_policy, user_accepted_privacy_policy } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PrivacyPolicyService {
	async getPrivacyPolicy(): Promise<privacy_policy[]> {
		return prisma.privacy_policy.findMany({
			orderBy: { publish_date: 'desc' },
		});
	}

	async getUserAcceptedPrivacyPolicy(id: number): Promise<user_accepted_privacy_policy | null> {
		return prisma.user_accepted_privacy_policy.findUnique({
			where: { id },
		});
	}

	async createUserAcceptedPrivacyPolicy(userId: number, privacyPolicyId: number): Promise<user_accepted_privacy_policy | null> {
		const acceptedTerms = await prisma.user_accepted_privacy_policy.create({
			data: {
				privacy_policy: { connect: { id: privacyPolicyId } },
				user: { connect: { id: userId } },
				accepted_date: new Date(),
			},
		});
		return this.getUserAcceptedPrivacyPolicy(acceptedTerms.id);
	}
}
