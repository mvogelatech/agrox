import { Injectable } from '@nestjs/common';
import { PrismaClient, company } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CompanyService {
	async getCompanies(): Promise<company[]> {
		return prisma.company.findMany({
			include: {
				address: { include: { state: true } },
			},
		});
	}
}
