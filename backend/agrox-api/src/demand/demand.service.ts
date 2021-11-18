import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JsonValue } from 'type-fest';
const prisma = new PrismaClient();
@Injectable()
export class DemandService {
	async getFarmDataByUserId(data: any) {
		const diag = await prisma.field.findUnique({
			where: { id: Number(data) },
		});
		console.log('aqui', diag?.event);
		return diag?.event;
	}
	async saveDemand(data: any) {
		const diag = await prisma.area.findUnique({
			where: { id: data.id },
		});
		// console.log(diag?.demand);
		const teste = diag?.demand!;
		let aux = JSON.parse(teste);
		// console.log(aux);
		if (aux === null) {
			aux = [];
			aux.push(data.demand);
		} else {
			aux.push(data.demand);
		}
		try {
			if (diag) {
				await prisma.area.update({
					where: {
						id: data.id,
					},
					data: {
						demand: JSON.stringify(aux),
					},
				});
			} else {
				console.log(`no demand for id: ${data.id}`);
			}
		} catch (error) {
			console.log(error);
		}
	}
}
