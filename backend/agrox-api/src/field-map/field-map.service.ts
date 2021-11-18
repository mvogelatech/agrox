import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, InputJsonObject } from '@prisma/client';

import turfArea from '@turf/area';
import turfTrucate from '@turf/truncate';
import turfbbox from '@turf/bbox';
import turfbboxPolygon from '@turf/bbox-polygon';
import turflength from '@turf/length';
import { GeoJSONObject, lineString } from '@turf/helpers';
import turfCenter from '@turf/center';

// get the google maps static key from runtime environment variables
const API_KEY = 'AIzaSyDY7O2bLn0qTPLxtnKHRX1E4vkTpnzeVbY';

const prisma = new PrismaClient();

type Coordinate = [number, number];

interface IField {
	code: number;
	area_ha: number;
	lat: number;
	long: number;
	coordinates: InputJsonObject;
	name: string;
	image_uri?: string;
	last_crop_id?: number;
	area_id: number;
}

interface IFieldFeature {
	type: 'Feature';
	geometry: {
		type: 'Polygon';
		coordinates: Coordinate[];
	};
	properties: {
		field: number;
		area: number;
		farm: number;
	};
}

export interface IFieldFeatureCollection {
	farm: number; // not part of geojson spec
	area: number; // not part of geojson spec
	type: 'FeatureCollection';
	features: IFieldFeature[];
}

async function uspsertFieldOnDatabase(fieldData: IField) {
	return prisma.field.upsert({
		where: { name_per_area_un: { area_id: fieldData.area_id, name: fieldData.name } },
		update: {
			area_ha: fieldData.area_ha,
			lat: fieldData.lat,
			long: fieldData.long,
			coordinates: fieldData.coordinates,
			image_uri: fieldData.image_uri,
		},
		create: {
			code: fieldData.code,
			area_ha: fieldData.area_ha,
			lat: fieldData.lat,
			long: fieldData.long,
			coordinates: fieldData.coordinates,
			name: fieldData.name,
			image_uri: fieldData.image_uri,
			area: { connect: { id: fieldData.area_id } },
		},
	});
}

async function insertFieldForFarmName(feature: any, fieldfeatureCollection: IFieldFeatureCollection) {
	// search for the farm described inside the geojson
	const farm = await prisma.farm.findUnique({
		where: {
			social_name: feature.properties.farm,
		},
	});

	if (!farm) throw new Error('Farm not found.');

	const area = await prisma.area.findUnique({
		where: {
			name_per_farm_un: {
				name: feature.properties.area,
				farm_id: farm.id,
			},
		},
	});

	if (!area) throw new Error('Area not found.');

	// calculate the proportion of the field to fetch the image from maps service in correct ratio : saved in image_uri
	const options = { coordinates: 2 };
	const truncated = turfTrucate(feature, options);
	const centerPoint = turfCenter(truncated);
	const bbox = turfbbox(truncated);
	const poly = turfbboxPolygon(bbox);
	const sideW = turflength(lineString([poly.geometry.coordinates[0][0], poly.geometry.coordinates[0][1]]));
	const sideH = turflength(lineString([poly.geometry.coordinates[0][1], poly.geometry.coordinates[0][2]]));
	const pixW = (sideW * 1000) | 0; // from km to meters , as 1 pix per meter
	const aspectRatio = sideH / sideW;
	const pixH = (pixW * aspectRatio) | 0;

	const latitude: number = centerPoint.geometry.coordinates[1];
	const longitude: number = centerPoint.geometry.coordinates[0];

	const codeTxt = /\d+/.exec(feature.properties.name)?.[0];
	const codeNum = codeTxt ? Number.parseInt(codeTxt, 10) : 0;

	const fieldData: IField = {
		name: feature.properties.name,
		code: codeNum,
		area_id: area.id,
		area_ha: turfArea(truncated) / 10000, // convert to ha=m2/1000
		long: longitude,
		lat: latitude,
		coordinates: truncated.geometry.coordinates[0],
		image_uri: `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=17&size=${pixW}x${pixH}&maptype=satellite&key=${API_KEY}`,
	};

	const field = await uspsertFieldOnDatabase(fieldData);

	const fieldFeature: IFieldFeature = {
		type: 'Feature',
		geometry: {
			type: 'Polygon',
			coordinates: truncated.geometry.coordinates,
		},
		properties: {
			farm: farm.id,
			area: area.id,
			field: field.id,
		},
	};

	fieldfeatureCollection.features.push(fieldFeature);
	// hold the ids to be returned later (it will get only the last set value but they should all be the same anyways)
	fieldfeatureCollection.area = area.id;
	fieldfeatureCollection.farm = farm.id;
}

async function insertFieldForFieldId(feature: any, fieldfeatureCollection: IFieldFeatureCollection) {
	// search for the field described inside the geojson
	const fieldId = Number.parseInt(feature.properties.field, 10);
	const field = await prisma.field.findUnique({
		where: {
			id: fieldId,
		},
		include: {
			area: true,
		},
	});

	if (!field) throw new Error('Field not found.');

	// calculate the proportion of the field to fetch the image from maps service in correct ratio : saved in image_uri
	const options = { coordinates: 2 };
	const truncated = turfTrucate(feature, options);
	const centerPoint = turfCenter(truncated);
	const bbox = turfbbox(truncated);
	const poly = turfbboxPolygon(bbox);
	const sideW = turflength(lineString([poly.geometry.coordinates[0][0], poly.geometry.coordinates[0][1]]));
	const sideH = turflength(lineString([poly.geometry.coordinates[0][1], poly.geometry.coordinates[0][2]]));
	const pixW = (sideW * 1000) | 0; // from km to meters , as 1 pix per meter
	const aspectRatio = sideH / sideW;
	const pixH = (pixW * aspectRatio) | 0;

	const latitude: number = centerPoint.geometry.coordinates[1];
	const longitude: number = centerPoint.geometry.coordinates[0];

	// update field coordinates
	await prisma.field.update({
		where: {
			id: field.id,
		},
		data: {
			area_ha: turfArea(truncated) / 10000, // convert to ha=m2/1000
			lat: latitude,
			long: longitude,
			coordinates: truncated.geometry.coordinates[0],
			image_uri: `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=17&size=${pixW}x${pixH}&maptype=satellite&key=${API_KEY}`,
		},
	});

	const fieldFeature: IFieldFeature = {
		type: 'Feature',
		geometry: {
			type: 'Polygon',
			coordinates: truncated.geometry.coordinates,
		},
		properties: {
			farm: field.area.id,
			area: field.area.farm_id,
			field: field.id,
		},
	};

	fieldfeatureCollection.features.push(fieldFeature);
	// hold the ids to be returned later (it will get only the last set value but they should all be the same anyways)
	fieldfeatureCollection.area = field.area.id;
	fieldfeatureCollection.farm = field.area.farm_id;
}

@Injectable()
export class FieldMapService {
	private readonly logger = new Logger(FieldMapService.name);

	async insertFieldData(geojson: GeoJSONObject) {
		const geojsonArr = Array.isArray(geojson) ? geojson : [geojson];
		const fieldfeatureCollection: IFieldFeatureCollection = {
			type: 'FeatureCollection',
			farm: 0,
			area: 0,
			features: [],
		};

		for (const featureCollection of geojsonArr) {
			for (const feature of featureCollection.features) {
				// check if the geojson data contains a field id or farm name
				const fieldId = feature.properties.field;
				if (fieldId && Number.parseInt(fieldId, 10)) {
					await insertFieldForFieldId(feature, fieldfeatureCollection);
				} else {
					await insertFieldForFarmName(feature, fieldfeatureCollection);
				}
			}
		}

		return fieldfeatureCollection;
	}
}
