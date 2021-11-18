'use strict';
const Storage = require('@google-cloud/storage');
const path = require('path');
const axios = require('axios');
const shpjs = require('shpjs');
const turf = require('@turf/turf');

const BACKEND_URL_TEXT = process.env.BACKEND_URL;

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

async function diagnosisParser(event, context) {
	console.log(context);
	const gcsEvent = event;
	const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
	const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(new Date());
	const storage = new Storage.Storage();
	const gcsFile = storage.bucket(gcsEvent.bucket).file(gcsEvent.name);
	const subPath = path.dirname(gcsFile.name);
	const fileExt = path.extname(gcsEvent.name);
	// considering that date is always the last segment of the path
	let reportDate = new Date().toDateString();
	const splitPath = subPath.split('/');
	if (splitPath.length > 1) reportDate = splitPath[splitPath.length - 1];

	let diagnosisData;
	if (fileExt.toLocaleLowerCase() === '.zip') {
		// process only zip files
		try {
			if (BACKEND_URL_TEXT === '') {
				throw new Error(`Missing enviroment variables values. BACKEND_URL: ${BACKEND_URL_TEXT}`);
			}

			console.log(`Processing file: ${gcsEvent.name}`);

			// Download the file from Gcloud storage bucket (diagnosis_inbox) and read it in memory
			const [zipFileContent] = await gcsFile.download();

			// The file is fully downloaded.
			const geojson = await shpjs(zipFileContent);

			const processingErrors = [];
			diagnosisData = parseGeojson(geojson, reportDate, processingErrors);

			// update database with diagnosis data
			// insert field data extracted from map into the db, the return is used to form a path to upload shapefile data
			const dataText = { accessToken: ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS, diagnosis: diagnosisData };
			const config = {
				method: 'post',
				url: `${BACKEND_URL_TEXT}/cromai/update-diagnosis-data`,
				headers: {
					'Content-Type': 'application/json',
				},
				data: dataText,
			};

			const response = await axios(config);
			console.log(response.status);

			// if any point of the shapefile has an error we log it on a new erro file on the same bucket for later analisys
			if (processingErrors.length > 0) {
				const logFileContent = JSON.stringify(processingErrors, null, '\t');
				const logFile = storage.bucket(gcsEvent.bucket).file(`${subPath}/errors-${year}-${month}-${day}/${path.basename(gcsEvent.name)}.log`);
				await logFile.save(logFileContent);
			}
		} catch (error) {
			const message = `DiagnosisParser cloud function failed: ${error.message}`;
			console.log(message);

			// create a new logfile in the error bucket;
			const logFileContent = JSON.stringify(error.message, null, '\t')
				.concat(JSON.stringify(error.stack, null, '\t'))
				.concat(JSON.stringify(diagnosisData, null, '\t'));
			const logFile = storage.bucket(gcsEvent.bucket).file(`${subPath}/exception-${year}-${month}-${day}/${path.basename(gcsEvent.name)}.log`);
			await logFile.save(logFileContent);
		}
	}
}

function validateFeature(feature, coords, currentFarm, currentArea, currentField) {
	if (!feature && !feature.properties) {
		throw new Error(`O shapefile não contém features válidas.: feature: ${feature}.`);
	}

	// the plague type is contained inside each feature (but they are all the same)
	const keyList = Object.keys(feature.properties);

	if (keyList.length === 0) {
		throw new Error(`A tabela de atributos do shapefile não contém colunas válidas. colunas: ${keyList}.`);
	}

	const plagues = [
		'mamona',
		'grama_seda',
		'coloniao',
		'fedegoso',
		'corda_de_viola',
		'corda_de_v',
		'outros',
		'mucuna',
		'mucuna_e_c',
		'outras',
		'outras_dani',
		'grama_s',
		'capins',
		'trepadeira',
		'gpa',
		'gpb',
		'ofl',
		'indefinida',
	];

	let currentPlagueName = plagues.find((elem1) => keyList.find((elem2) => elem2.toLowerCase() === elem1));

	if (!currentPlagueName) {
		throw new Error(`Não há uma praga conhecida e definida na tabela de atributos do shapefile. Colunas indicadas: ${keyList}.`);
	}

	if (currentPlagueName === 'corda_de_v') {
		currentPlagueName = 'corda_de_viola';
	}

	if (currentPlagueName === 'mucuna_e_c') {
		currentPlagueName = 'mucuna'; // this is a fix for now, cromai bundleded together mucuna and corda de viola into one plague.
	}

	if (
		currentPlagueName === 'outras' ||
		currentPlagueName === 'outras_dani' ||
		currentPlagueName === 'fedegoso' // this is a request by Fernando until Cromai can better detect this plage
	) {
		currentPlagueName = 'outros'; // this is a fix for now - sometimes cromai changes the name of the unknown plague
	}

	if (currentPlagueName === 'grama_s') {
		currentPlagueName = 'grama_seda';
	}

	// sometimes there is field meta data but no geometry data on cromai shapefiles, this feature.geometry check for that case
	if (!currentFarm || !currentArea || !currentField) {
		throw new Error(
			`Não há id de fazenda, area ou talhão definidos na tabela de atributos do shapefile. praga: ${currentPlagueName}, farm: ${currentFarm} , area: ${currentArea}, field: ${currentField}.`,
		);
	}

	if (!feature.geometry || !feature.geometry.bbox || !feature.geometry.bbox.length > 3) {
		const geoText = JSON.stringify(feature.geometry);
		throw new Error(
			`A geometria do shapefile não existe ou não está de acordo com o formato esperado, praga: ${currentPlagueName}, geometria: ${geoText}.`,
		);
	}

	if (coords[0].length < 4) {
		const coordsText = JSON.stringify(feature.coords);
		throw new Error(
			`O campo coordinates do shapefile não está de acordo com o formato esperado,  praga: ${currentPlagueName}, coordinates: ${coordsText}.`,
		);
	}

	return currentPlagueName;
}

function parseGeojson(geojson, reportDateString, processingErrors) {
	const diagnosisReportData = {};
	const geojsonArr = Array.isArray(geojson) ? geojson : [geojson];
	// iterate through all feature collection for a given area, all plagues are the same in this feature collection
	for (const featureCollection of geojsonArr) {
		// a feature contains one plage for one field
		for (const feature of featureCollection.features) {
			try {
				// use the shapefile feature properties to extract farm/field identification
				const farmKey = Object.keys(feature.properties).find((key) => key.toLowerCase() === 'farm');
				const areaKey = Object.keys(feature.properties).find((key) => key.toLowerCase() === 'area');
				const fieldKey = Object.keys(feature.properties).find((key) => key.toLowerCase() === 'field');

				const currentFarm = Number.parseInt(feature.properties[farmKey], 10);
				const currentArea = Number.parseInt(feature.properties[areaKey], 10);
				const currentField = Number.parseInt(feature.properties[fieldKey], 10);

				// group together the plague center and its 'square' geometry
				const coords = feature.geometry.coordinates;

				const currentPlagueName = validateFeature(feature, coords, currentFarm, currentArea, currentField);

				const fieldId = { farmId: currentFarm, areaId: currentArea, fieldId: currentField };

				// use a composition to convert the field id toyarn  a string to be used as a key
				const fieldIdKey = JSON.stringify(fieldId);

				// use bounding box to calculate the center of the plague
				const featCol = turf.featureCollection([
					turf.point([feature.geometry.bbox[0], feature.geometry.bbox[1]]),
					turf.point([feature.geometry.bbox[2], feature.geometry.bbox[3]]),
				]);
				const middle = turf.center(featCol);
				const bbox = turf.bbox(featCol);
				const polygon = turf.bboxPolygon(bbox);
				// calculate the area of infection
				const currentInfectionArea = turf.area(polygon);

				const plagueCoords = {
					center: { longitude: middle.geometry.coordinates[0], latitude: middle.geometry.coordinates[1] },
					coordinates: [
						{ longitude: coords[0][0][0], latitude: coords[0][0][1] },
						{ longitude: coords[0][1][0], latitude: coords[0][1][1] },
						{ longitude: coords[0][2][0], latitude: coords[0][2][1] },
						{ longitude: coords[0][3][0], latitude: coords[0][3][1] },
					],
				};

				const infestation = {
					points: [plagueCoords],
					plagueName: currentPlagueName,
					infectedArea: currentInfectionArea,
				};

				if (fieldIdKey in diagnosisReportData) {
					if (currentPlagueName in diagnosisReportData[fieldIdKey].infestations) {
						// existing field and existing plague just add new points
						let pointList = diagnosisReportData[fieldIdKey].infestations[currentPlagueName].points;

						// avoid repeated detections same plague on the same center - we caught some of that on cromai data
						const repeatedPoint = pointList.find(
							(elem) => elem.center.latitude === plagueCoords.center.latitude && elem.center.longitude === plagueCoords.center.longitude,
						);

						if (!repeatedPoint) {
							pointList = pointList.concat(plagueCoords);
							diagnosisReportData[fieldIdKey].infestations[currentPlagueName].points = pointList;
							diagnosisReportData[fieldIdKey].infestations[currentPlagueName].infectedArea += currentInfectionArea;
							diagnosisReportData[fieldIdKey].infestations[currentPlagueName].plagueName = currentPlagueName;
						}
					} else {
						// existing field but new plague
						diagnosisReportData[fieldIdKey].infestations[currentPlagueName] = infestation;
					}
				} else {
					// new field, add infestation for the first time
					const infestationByPlague = { [currentPlagueName]: infestation };
					const currentDiagnosisReport = { infestations: infestationByPlague, reportDate: reportDateString };
					diagnosisReportData[fieldIdKey] = currentDiagnosisReport;
				}
			} catch (error) {
				processingErrors.push(`${error.message}. file: ${featureCollection.fileName}`);
			}
		}
	}

	return diagnosisReportData;
}

module.exports = { diagnosisParser };

// local testing for this cloud function
// BACKEND_URL 'http://localhost:8080';
// diagnosisParser({ name: 'farm-id-1/2020-10-27/ORTOMOSAICO_ZONA_404-TALHOES_01-02-03-04_mucuna.zip', bucket: 'agroxdev-field-images' }, null);

// agroxdev-field-images/Resultados_3Ciclo/Resultados_Fazenda_Gironda.zip
// agroxdev-field-images/Resultados_3Ciclo/Resultados_Fazenda_Meia.zip
// agroxdev-field-images/Resultados_3Ciclo/Resultados_Santa_Helena_de_Brotas.zip
/*
diagnosisParser(
	{
		name: 'farm-id-1-sta-maria-fabrica/2021-02-19/Resultados_Santa_Helena_de_Brotas.zip',
		bucket: 'agroxdev-cromai',
	},
	null,
);
*/
