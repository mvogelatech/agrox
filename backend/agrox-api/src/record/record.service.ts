import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JsonValue } from 'type-fest';
const prisma = new PrismaClient();
@Injectable()
export class RecordService {
	async getFarmDataByUserId(data: any) {
		const diag = await prisma.field.findUnique({
			where: { id: Number(data) },
		});
		console.log('aqui', diag?.event);
		return diag?.event;
	}
	async saveRecord(data: any) {
		const diag = await prisma.field.findUnique({
			where: { id: data.id },
		});
		console.log(diag?.event);
		const teste = diag?.event!;
		let aux = JSON.parse(teste);
		// console.log(aux);
		if (aux === null) {
			aux = [];
			aux.push(data.record);
		} else {
			aux.push(data.record);
		}
		try {
			if (diag) {
				await prisma.field.update({
					where: {
						id: data.id,
					},
					data: {
						event: JSON.stringify(aux),
					},
				});
			} else {
				console.log(`no record for id: ${data.id}`);
			}
		} catch (error) {
			console.log(error);
		}
	}
}
