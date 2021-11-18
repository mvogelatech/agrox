'use strict';

const Storage = require('@google-cloud/storage');
const path = require('path');
const { kml } = require('togeojson');
const { DOMParser } = require('xmldom');
const { convert } = require('geojson2shp');
const axios = require('axios');

// const BACKEND_URL_TEXT = 'http://localhost:8080';
const BACKEND_URL_TEXT = process.env.BACKEND_URL;
const PROJECT_ID_TEXT = 'agroxdev';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

async function fieldMapParser(event, context) {
	try {
		console.log(context);

		if (PROJECT_ID_TEXT === '' || BACKEND_URL_TEXT === '') {
			throw new Error(`Missing enviroment variables values. BACKEND_URL: ${BACKEND_URL_TEXT}, PROJECT_ID: ${PROJECT_ID_TEXT}`);
		}

		const gcsEvent = event;

		console.log(`Processing file: ${gcsEvent.name}`);

		const bucketName = gcsEvent.bucket;
		const storage = new Storage.Storage();
		const gcsFile = storage.bucket(bucketName).file(gcsEvent.name);

		// Download the file from Gcloud storage bucket (diagnosis_inbox) and read it in memory
		const [kmlFileContent] = await gcsFile.download();

		// load kml map data
		const kmlDocument = new DOMParser().parseFromString(kmlFileContent.toString());

		// convert kml format to geosjon format
		const geojson = kml(kmlDocument, { styles: false });

		// insert field data extracted from map into the db, the return is used to form a path to upload shapefile data
		const dataText = { accessToken: ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS, geojsonData: geojson }; //
		const config = {
			method: 'post',
			url: `${BACKEND_URL_TEXT}/field-map/create-update`,
			headers: {
				'Content-Type': 'application/json',
			},
			data: dataText,
		};

		const response = await axios(config);
		const simpleGeojson = response.data;

		// create shapefiles and move them to the images bucket
		// instance of the destination bucket
		const inboxImagesBucket = `${PROJECT_ID_TEXT}-farm-registration`;
		const imageBucket = storage.bucket(inboxImagesBucket);

		// convert from our simple geojson to shapefile and store the shape files in the farm-id-map bucket
		const shapeFile = imageBucket.file(
			`farm-id-${simpleGeojson.farm}/shapefiles/gen/area-id-${simpleGeojson.area}-${path.basename(gcsFile.name, 'kml')}-shp.zip`,
		);
		const ws = shapeFile.createWriteStream();
		await convert(simpleGeojson, ws);

		// move the original kml file to the farm-id-N images bucket
		const newLocation = `gs://${inboxImagesBucket}/farm-id-${simpleGeojson.farm}/kml/area-id-${simpleGeojson.area}-${gcsFile.name}`;
		await gcsFile.move(newLocation);

		// create areas within visiona API for Indices of vegetation monitoring
		for (const feat of simpleGeojson.features) {
			const fieldId = feat.properties.field;
			const dataVisiona = {
				accessToken: ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS,
				id: fieldId,
			};

			const configVisiona = {
				method: 'post',
				url: `${BACKEND_URL_TEXT}/visiona/create-area`,
				headers: {
					'Content-Type': 'application/json',
				},
				data: dataVisiona,
			};

			const responseVisiona = await axios(configVisiona);
			console.log(responseVisiona.status);
		}
	} catch (error) {
		const message = `FieldMap cloud function failed: ${error.message}`;
		console.log(message);
		console.log(error);
	}
}

module.exports = { fieldMapParser };

// local testing for this cloud function
// BACKEND_URL 'http://localhost:8080';
// PROJECT_ID  'agroxdev';
fieldMapParser({ name: 'NevadaTlh11.kml', bucket: 'agro-x-orcamento' }, null);
