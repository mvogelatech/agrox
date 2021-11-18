import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
	async findUnique(username: string, password: string) {
		const user = await prisma.user.findMany({
			where: {
				OR: [
					{
						password,
						cpf: username,
					},
				],
			},
		});
		if (user) return user;

		return undefined;
	}
}
