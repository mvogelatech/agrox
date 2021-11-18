import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class DiagnosticService {
	async getMails(): Promise<string[]> {
		const mail = await prisma.email.findMany();
		return mail.map((mail) => mail.email);
	}

	async getMessageData(id: number, quotationPackage: any): Promise<string> {
		console.log('teste', quotationPackage.fields);
		const message: string[] = [];

		const user = await prisma.user.findUnique({
			where: { id },
		});

		if (!user) throw new Error(`Unable to find user with id '${id}'`);

		message.push(this.rightPadStringWithDashes('\n\n\nDados do Produtor', 120));
		message.push(`Nome: ${user.first_name} ${user.last_name}`);
		message.push(`Celular: ${user.phone_number}`);
		message.push(`Email: ${user.email ?? '-'}`);
		message.push(`DADOS DO PEDIDO  -------------------------`);
		message.push(`Áreas: ${[...new Set(quotationPackage.fields.flatMap((field: any) => field.area_id))].slice().sort(undefined).join(', ')}`);
		message.push(`Talhão: ${[...new Set(quotationPackage.fields.flatMap((field: any) => field.name.split(' ')[1]))].slice().sort(undefined).join(', ')}`);
		// message.push(
		// 	`Talhões: ${[...new Set(quotationPackage.quotation_modal_package.flatMap((modal: any) => modal.field.map((field: any) => field.name.split(' ')[1])))]
		// 		.slice()
		// 		.sort(undefined)
		// 		.join(', ')}`,
		// );
		return message.join('\n');
	}

	private rightPadStringWithDashes(string: string, length: number): string {
		const lastLineSize = string.replace(/[\s\S]*\n/, '').length;
		if (lastLineSize >= length) return string;
		return `${string} ${'-'.repeat(length - 1 - lastLineSize)}`;
	}
}
