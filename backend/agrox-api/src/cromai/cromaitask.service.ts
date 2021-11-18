import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, InputJsonArray } from '@prisma/client';

const prisma = new PrismaClient();

interface IDiagnosedFieldID {
	farmId: number;
	areaId: number;
	fieldId: number;
}

interface IInfestationPoints {
	center: { longitude: number; latitude: number };
	coordinates: [
		{ longitude: number; latitude: number },
		{ longitude: number; latitude: number },
		{ longitude: number; latitude: number },
		{ longitude: number; latitude: number },
	];
}

interface IInfestation {
	plagueName: string;
	points: InputJsonArray; // json data
	infectedArea: number; // calculated area of the plague (based on shapefile data)
}

export interface IDiagnosisReport {
	infestations: Record<string, IInfestation>;
	reportDate: string; // date of the diagnosis analisys
}

@Injectable()
export class CromaiParserService {
	private readonly logger = new Logger(CromaiParserService.name);

	async updateFieldPlagueDiagnosisData(diagnosisReportData: Record<string, IDiagnosisReport>) {
		const bulkTransactions = []; // create a db transaction to persist all infestation for a diagnosis in bulk

		try {
			// retrieve the known plague list from DB, the plague.name shall always match the name passed in the shapefile
			const plagueList = await prisma.plague.findMany();
			// iterate through each field and create a diagnosis entry on database
			for (const [fieldIdString, diagnosisReport] of Object.entries(diagnosisReportData)) {
				// each key here represents field data
				const fieldId: IDiagnosedFieldID = JSON.parse(fieldIdString);
				// get field/crop/diagnosis data (if there is a diagnosis data for the provided report date)
				const myField = (await prisma.field.findUnique({
					where: {
						id: fieldId.fieldId,
					},
					include: {
						crop: { orderBy: { sowing_date: 'desc' } },
					},
				}))!;

				// stop processing the diagnosis data in case there is no valid field
				if (!myField) throw new Error(`There is valid field associated with this diagnosis data. Data: ${JSON.stringify(fieldIdString, null, '\t')}`);

				// in case there is no crop for any reason we can't add a diagnosis to the field
				if (!myField.crop || myField.crop.length === 0)
					throw new Error(`There is no crop associated with this field. Field: ${JSON.stringify(myField, null, '\t')}`);

				const diagnosisObject = await prisma.diagnosis.create({
					data: {
						crop: { connect: { id: myField.crop[0].id } }, // FK of table crop
						report_date: new Date(Date.parse(diagnosisReport.reportDate)),
						affected_area_ha: 0, // Because it is NOT NULL
					},
				});

				let totalAffectedArea = 0;
				for (const [plagueName, plagueData] of Object.entries(diagnosisReport.infestations)) {
					const plagueDb = plagueList.find((p) => {
						return p.name === plagueName;
					});
					if (plagueDb) {
						const areaHA = plagueData.infectedArea / 10000; // formula for m2 -> HA
						totalAffectedArea += areaHA;
						const newInfestation = prisma.infestation.upsert({
							where: {
								diagnosis_plague_un: {
									diagnosis_id: diagnosisObject.id,
									plague_id: plagueDb.id,
								},
							},
							update: {
								diagnosis: { connect: { id: diagnosisObject.id } }, // FK of table diagnosis
								plague: { connect: { id: plagueDb.id } }, // FK of table plague
								area_ha: areaHA,
								points: plagueData.points,
							},
							create: {
								diagnosis: { connect: { id: diagnosisObject.id } }, // FK of table diagnosis
								plague: { connect: { id: plagueDb.id } }, // FK of table plague
								area_ha: areaHA,
								points: plagueData.points,
							},
						});
						bulkTransactions.push(newInfestation);
					}
				}

				await prisma.$transaction(bulkTransactions);

				// update the total affected area for each diagnosis
				await prisma.diagnosis.update({
					data: {
						crop: { connect: { id: myField.crop[0].id } }, // FK of table crop
						affected_area_ha: totalAffectedArea,
					},
					where: {
						id: diagnosisObject.id,
					},
				});
			}
		} catch (error) {
			const message = `Cromai Parser Error: ${error.message}`;
			console.log(bulkTransactions);
			this.logger.error(message);
		}
	}
}
