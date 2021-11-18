import { Injectable } from '@nestjs/common';
import { PrismaClient, terms_and_conditions, user_accepted_terms } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TermsAndConditionsService {
	async getTermsAndConditions(): Promise<terms_and_conditions[]> {
		return prisma.terms_and_conditions.findMany({
			orderBy: { publish_date: 'desc' },
		});
	}

	async getUserAcceptedTerms(id: number): Promise<user_accepted_terms | null> {
		return prisma.user_accepted_terms.findUnique({
			where: { id },
		});
	}

	async createUserAcceptedTerms(userId: number, termsId: number): Promise<user_accepted_terms | null> {
		const acceptedTerms = await prisma.user_accepted_terms.create({
			data: {
				terms_and_conditions: { connect: { id: termsId } },
				user: { connect: { id: userId } },
				accepted_date: new Date(),
			},
		});

		return this.getUserAcceptedTerms(acceptedTerms.id);
	}
}
