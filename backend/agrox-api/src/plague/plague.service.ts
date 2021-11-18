import { Injectable } from '@nestjs/common';
import { plague, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PlagueService {
	async getPlagues(): Promise<plague[]> {
		return prisma.plague.findMany({
			where: {
				in_use: true,
			},
			orderBy: { relevance_order: 'asc' },
		});
	}
}
