import { PrismaClient } from '@prisma/client';
import sortBy = require('lodash.sortby');
import jetpack = require('fs-jetpack');
import { DiagnosisReportService } from '../diagnosis-report/diagnosis-report.service';

const prisma = new PrismaClient();

type field = {
	id: number;
	name: string;
	lat: number;
	long: number;
	infestation: {
		area_ha: number;
		affected_area_ha: number;
	};
	crop: {
		crop_type: string;
		variety: string;
		number: number;
		sowing_date: string;
		expected_harvest_date: string;
	};
	diagnosis: {
		[plagueName: string]: number;
		id: number; // This line is technically already covered by the `[plagueName: string]` above, but making it explicitly here helps autocomplete
	};
};

type area = {
	name: string;
	farm_name: string;
	report_date: string;
	fields: field[];
};

export async function getFieldsData(userId: number, outputPath: string, datePath: string) {
	// make sure the temp path exists
	jetpack.dir(`src/dev-scripts/temp/`);

	const farmsFromUser = await prisma.many_user_has_many_farm.findMany({
		include: {
			farm: {
				include: {
					area: { include: { field: { include: { crop: { include: { diagnosis: { include: { infestation: { include: { plague: true } } } } } } } } } },
				},
			},
		},
		where: {
			user_id: userId,
		},
	});

	if (!farmsFromUser || farmsFromUser.length === 0) throw new Error(`No farm found for user ${userId}`);

	const returnAreas: area[] = [];

	for (const userFarm of farmsFromUser)
		for (const area of userFarm.farm.area) {
			const newArea = ({ fields: [] } as unknown) as area;
			newArea.name = area.name;
			newArea.farm_name = userFarm.farm.fantasy_name;

			for (const field of area.field) {
				const newFields = ({ infestation: {}, crop: {}, diagnosis: {} } as unknown) as field;
				if (field.crop.length !== 0) {
					newFields.name = field.name;
					newFields.id = field.id;
					newFields.lat = field.lat;
					newFields.long = field.long;
					const sortedCrops = sortBy(field.crop, 'sowing_date');
					const latestCrop = sortedCrops[sortedCrops.length - 1];
					newFields.crop.crop_type = latestCrop.crop_type;
					newFields.crop.variety = latestCrop.variety;
					newFields.crop.number = latestCrop.number;
					newFields.crop.sowing_date = latestCrop.sowing_date.toISOString();
					newFields.crop.expected_harvest_date = latestCrop.expected_harvest_date.toISOString();
					if (latestCrop.is_diagnosis_hired && latestCrop.diagnosis.length !== 0) {
						const sortedDiagnosis = sortBy(latestCrop.diagnosis, 'report_date');
						const latestDiagnosis = sortedDiagnosis[sortedDiagnosis.length - 1];
						newFields.infestation.area_ha = field.area_ha;
						let affected_area_ha = 0;
						newFields.diagnosis.id = latestDiagnosis.id;
						for (const infestation of latestDiagnosis.infestation) {
							affected_area_ha += infestation.area_ha;
							newFields.diagnosis[infestation.plague.name] = infestation.area_ha;
						}

						newArea.report_date = latestDiagnosis.report_date.toISOString();

						newFields.infestation.affected_area_ha = affected_area_ha;
						newArea.fields.push(newFields);

						const drs: DiagnosisReportService = new DiagnosisReportService();
						const img = await drs.generateFieldDiagnosisPNG(newFields.diagnosis.id, datePath, 17); // fixed zoom in 17 (a good magic value)
						await jetpack.writeAsync(`src/dev-scripts/temp/${field.id}.jpg`, img);
					}
				}
			}

			if (newArea.fields.length > 0) returnAreas.push(newArea);
		}

	if (returnAreas.length > 0) {
		jetpack.write(`src/dev-scripts/temp/${outputPath}`, JSON.stringify(returnAreas, undefined, '\t'));
	} else {
		const farmString = farmsFromUser.map((f) => `farm id:${f.farm.id} farm name:${f.farm.fantasy_name}`);
		throw new Error(`No diagnosis/infestation data was found for the given user id: ${userId} / ${JSON.stringify(farmString)} `);
	}
}
