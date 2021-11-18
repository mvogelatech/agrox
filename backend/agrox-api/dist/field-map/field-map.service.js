"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FieldMapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldMapService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const area_1 = require("@turf/area");
const truncate_1 = require("@turf/truncate");
const bbox_1 = require("@turf/bbox");
const bbox_polygon_1 = require("@turf/bbox-polygon");
const length_1 = require("@turf/length");
const helpers_1 = require("@turf/helpers");
const center_1 = require("@turf/center");
const API_KEY = 'AIzaSyDY7O2bLn0qTPLxtnKHRX1E4vkTpnzeVbY';
const prisma = new client_1.PrismaClient();
async function uspsertFieldOnDatabase(fieldData) {
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
async function insertFieldForFarmName(feature, fieldfeatureCollection) {
    var _a;
    const farm = await prisma.farm.findUnique({
        where: {
            social_name: feature.properties.farm,
        },
    });
    if (!farm)
        throw new Error('Farm not found.');
    const area = await prisma.area.findUnique({
        where: {
            name_per_farm_un: {
                name: feature.properties.area,
                farm_id: farm.id,
            },
        },
    });
    if (!area)
        throw new Error('Area not found.');
    const options = { coordinates: 2 };
    const truncated = truncate_1.default(feature, options);
    const centerPoint = center_1.default(truncated);
    const bbox = bbox_1.default(truncated);
    const poly = bbox_polygon_1.default(bbox);
    const sideW = length_1.default(helpers_1.lineString([poly.geometry.coordinates[0][0], poly.geometry.coordinates[0][1]]));
    const sideH = length_1.default(helpers_1.lineString([poly.geometry.coordinates[0][1], poly.geometry.coordinates[0][2]]));
    const pixW = (sideW * 1000) | 0;
    const aspectRatio = sideH / sideW;
    const pixH = (pixW * aspectRatio) | 0;
    const latitude = centerPoint.geometry.coordinates[1];
    const longitude = centerPoint.geometry.coordinates[0];
    const codeTxt = (_a = /\d+/.exec(feature.properties.name)) === null || _a === void 0 ? void 0 : _a[0];
    const codeNum = codeTxt ? Number.parseInt(codeTxt, 10) : 0;
    const fieldData = {
        name: feature.properties.name,
        code: codeNum,
        area_id: area.id,
        area_ha: area_1.default(truncated) / 10000,
        long: longitude,
        lat: latitude,
        coordinates: truncated.geometry.coordinates[0],
        image_uri: `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=17&size=${pixW}x${pixH}&maptype=satellite&key=${API_KEY}`,
    };
    const field = await uspsertFieldOnDatabase(fieldData);
    const fieldFeature = {
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
    fieldfeatureCollection.area = area.id;
    fieldfeatureCollection.farm = farm.id;
}
async function insertFieldForFieldId(feature, fieldfeatureCollection) {
    const fieldId = Number.parseInt(feature.properties.field, 10);
    const field = await prisma.field.findUnique({
        where: {
            id: fieldId,
        },
        include: {
            area: true,
        },
    });
    if (!field)
        throw new Error('Field not found.');
    const options = { coordinates: 2 };
    const truncated = truncate_1.default(feature, options);
    const centerPoint = center_1.default(truncated);
    const bbox = bbox_1.default(truncated);
    const poly = bbox_polygon_1.default(bbox);
    const sideW = length_1.default(helpers_1.lineString([poly.geometry.coordinates[0][0], poly.geometry.coordinates[0][1]]));
    const sideH = length_1.default(helpers_1.lineString([poly.geometry.coordinates[0][1], poly.geometry.coordinates[0][2]]));
    const pixW = (sideW * 1000) | 0;
    const aspectRatio = sideH / sideW;
    const pixH = (pixW * aspectRatio) | 0;
    const latitude = centerPoint.geometry.coordinates[1];
    const longitude = centerPoint.geometry.coordinates[0];
    await prisma.field.update({
        where: {
            id: field.id,
        },
        data: {
            area_ha: area_1.default(truncated) / 10000,
            lat: latitude,
            long: longitude,
            coordinates: truncated.geometry.coordinates[0],
            image_uri: `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=17&size=${pixW}x${pixH}&maptype=satellite&key=${API_KEY}`,
        },
    });
    const fieldFeature = {
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
    fieldfeatureCollection.area = field.area.id;
    fieldfeatureCollection.farm = field.area.farm_id;
}
let FieldMapService = FieldMapService_1 = class FieldMapService {
    constructor() {
        this.logger = new common_1.Logger(FieldMapService_1.name);
    }
    async insertFieldData(geojson) {
        const geojsonArr = Array.isArray(geojson) ? geojson : [geojson];
        const fieldfeatureCollection = {
            type: 'FeatureCollection',
            farm: 0,
            area: 0,
            features: [],
        };
        for (const featureCollection of geojsonArr) {
            for (const feature of featureCollection.features) {
                const fieldId = feature.properties.field;
                if (fieldId && Number.parseInt(fieldId, 10)) {
                    await insertFieldForFieldId(feature, fieldfeatureCollection);
                }
                else {
                    await insertFieldForFarmName(feature, fieldfeatureCollection);
                }
            }
        }
        return fieldfeatureCollection;
    }
};
FieldMapService = FieldMapService_1 = __decorate([
    common_1.Injectable()
], FieldMapService);
exports.FieldMapService = FieldMapService;
//# sourceMappingURL=field-map.service.js.map