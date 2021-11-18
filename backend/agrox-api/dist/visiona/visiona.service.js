"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VisionaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisionaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const AUTH_TOKEN = 'YW50b25pby5mZXJuYW5kb0BlbWJyYWVyLmNvbS5icjpBZ3JvZXhwbG9yZTFA';
const BASE_URL = 'aHR0cDovL3d3dy52aXNpb25hcGxhdGZvcm0uY29tL2FwaS9pbmRpY2U=';
const IMAGE_FILTER_THRESHOLD = 20;
function calculateImageCoveredPercentage(observation) {
    var _a, _b, _c, _d;
    const total = (_a = observation.stats.pixel.total) !== null && _a !== void 0 ? _a : 0;
    const cloud = (_b = observation.stats.pixel.cloud) !== null && _b !== void 0 ? _b : 0;
    const shadow = (_c = observation.stats.pixel.shadow) !== null && _c !== void 0 ? _c : 0;
    const nodata = (_d = observation.stats.pixel.nodata) !== null && _d !== void 0 ? _d : 0;
    const num = shadow + cloud;
    const den = total - nodata;
    const den2 = den > 1 ? den : num;
    const imageFilter = 18;
    return imageFilter;
}
let VisionaService = VisionaService_1 = class VisionaService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(VisionaService_1.name);
    }
    async listArea(fieldId) {
        var _a;
        const b64Url = Buffer.from(BASE_URL, 'base64');
        const apiUrl = b64Url.toString('utf-8');
        let urlTxt = ``;
        if (fieldId) {
            const fieldData = await prisma.field.findUnique({
                where: {
                    id: fieldId,
                },
            });
            if (fieldData === null || fieldData === void 0 ? void 0 : fieldData.visiona_area_id) {
                urlTxt = `${apiUrl}/area/${fieldData.visiona_area_id}`;
            }
            else {
                return [];
            }
        }
        else {
            urlTxt = `${apiUrl}/areas`;
        }
        try {
            const response = await this.httpService.axiosRef({
                method: 'get',
                url: urlTxt,
                headers: {
                    Authorization: `Basic ${AUTH_TOKEN}`,
                },
            });
            this.logger.log(`Retrieved an area list on visiona api`);
            if (!response.data.observations) {
                this.logger.log(`No observations available for: ${urlTxt}`);
                return [];
            }
            const filteredObservations = [];
            for (const observation of response.data.observations) {
                const obsDate = observation.date.split('T');
                const imageFilter = calculateImageCoveredPercentage(observation);
                if (imageFilter < IMAGE_FILTER_THRESHOLD && !((_a = observation.stats.satellite) === null || _a === void 0 ? void 0 : _a.includes('Landsat'))) {
                    const filteredObservation = {
                        id: observation.id,
                        date: obsDate[0],
                        stats: {
                            indice: {
                                savi: {
                                    browseUrl: observation.stats.indice.savi ? observation.stats.indice.savi.browseUrl : '',
                                },
                                ndwi: {
                                    browseUrl: observation.stats.indice.ndwi ? observation.stats.indice.ndwi.browseUrl : '',
                                },
                                ndvi: {
                                    browseUrl: observation.stats.indice.ndvi ? observation.stats.indice.ndvi.browseUrl : '',
                                },
                                ndre: {
                                    browseUrl: observation.stats.indice.ndre ? observation.stats.indice.ndre.browseUrl : '',
                                },
                                land_cover: {
                                    browseUrl: observation.stats.indice.land_cover ? observation.stats.indice.land_cover.browseUrl : '',
                                },
                                greenness: {
                                    browseUrl: observation.stats.indice.greenness ? observation.stats.indice.greenness.browseUrl : '',
                                },
                                fcover: {
                                    browseUrl: observation.stats.indice.fcover ? observation.stats.indice.fcover.browseUrl : '',
                                },
                                true_color: {
                                    browseUrl: observation.stats.indice.true_color ? observation.stats.indice.true_color.browseUrl : '',
                                },
                                false_color: {
                                    browseUrl: observation.stats.indice.false_color ? observation.stats.indice.false_color.browseUrl : '',
                                },
                            },
                        },
                    };
                    filteredObservations.push(filteredObservation);
                }
            }
            return filteredObservations;
        }
        catch (error) {
            this.logger.error(`${error.message} for id:${fieldId !== null && fieldId !== void 0 ? fieldId : 0}`);
            return [];
        }
    }
    async createArea(fieldId) {
        var _a;
        const fieldData = await prisma.field.findUnique({
            where: {
                id: fieldId,
            },
            include: {
                crop: { orderBy: { sowing_date: `desc` } },
                area: {
                    include: { farm: true },
                },
            },
        });
        try {
            if (fieldData) {
                const coords = [];
                coords.push(fieldData === null || fieldData === void 0 ? void 0 : fieldData.coordinates);
                const b64Url = Buffer.from(BASE_URL, 'base64');
                const apiUrl = b64Url.toString('utf-8');
                let harvestDate = new Date().toLocaleDateString();
                if ((fieldData === null || fieldData === void 0 ? void 0 : fieldData.crop[0]) && (fieldData === null || fieldData === void 0 ? void 0 : fieldData.crop[0].expected_harvest_date))
                    harvestDate = fieldData === null || fieldData === void 0 ? void 0 : fieldData.crop[0].expected_harvest_date.toLocaleDateString();
                const response = await this.httpService.axiosRef({
                    method: 'post',
                    url: `${apiUrl}/areas/create`,
                    headers: {
                        Authorization: `Basic ${AUTH_TOKEN}`,
                        'content-type': 'application/json',
                    },
                    data: {
                        name: fieldData === null || fieldData === void 0 ? void 0 : fieldData.name,
                        geojson: {
                            type: 'Feature',
                            properties: {
                                nome_imovel: fieldData === null || fieldData === void 0 ? void 0 : fieldData.area.farm.fantasy_name,
                                nome_safra: harvestDate,
                            },
                            geometry: {
                                type: 'Polygon',
                                coordinates: coords,
                            },
                        },
                    },
                });
                console.log(response.status);
                if (response.data) {
                    const createdAreaId = response.data.id;
                    if (createdAreaId) {
                        const ok = await prisma.field.update({
                            data: {
                                visiona_area_id: createdAreaId,
                            },
                            where: {
                                id: fieldId,
                            },
                        });
                        this.logger.log(`Created an area on visiona api with id, response: ${response.data.id}, db: ${(_a = ok.visiona_area_id) !== null && _a !== void 0 ? _a : 'n/a'}`);
                    }
                    else {
                        this.logger.log(`No id was provided in the api response. Received data: ${response.data}`);
                    }
                    return response.data;
                }
            }
            else {
                throw new Error(`No field available with id ${fieldId}`);
            }
        }
        catch (error) {
            this.logger.error(error.message);
            return error.message;
        }
    }
    async createAreas(farmId) {
        const fields = await prisma.field.findMany({
            where: {
                area: {
                    farm: {
                        id: farmId,
                    },
                },
            },
        });
        for (const field of fields) {
            this.logger.log(await this.createArea(field.id));
        }
    }
    async deleteArea(fieldId) {
        var _a, _b;
        const fieldData = await prisma.field.findUnique({
            where: {
                id: fieldId,
            },
            include: {
                crop: { orderBy: { sowing_date: `desc` } },
                area: {
                    include: { farm: true },
                },
            },
        });
        try {
            if (fieldData) {
                const b64Url = Buffer.from(BASE_URL, 'base64');
                const apiUrl = b64Url.toString('utf-8');
                const response = await this.httpService.axiosRef({
                    method: 'get',
                    url: `${apiUrl}/areas/delete?id=${(_a = fieldData === null || fieldData === void 0 ? void 0 : fieldData.visiona_area_id) !== null && _a !== void 0 ? _a : 0}`,
                    headers: {
                        Authorization: `Basic ${AUTH_TOKEN}`,
                    },
                });
                if (response.data) {
                    await prisma.field.update({
                        data: {
                            visiona_area_id: null,
                        },
                        where: {
                            id: fieldId,
                        },
                    });
                    this.logger.log(`Deleted an area on visiona api with id: ${(_b = fieldData === null || fieldData === void 0 ? void 0 : fieldData.visiona_area_id) !== null && _b !== void 0 ? _b : 0}`);
                }
                else {
                    this.logger.log(response.statusText);
                    this.logger.log('No area was deleted on visiona API');
                }
            }
            else {
                throw new Error(`No field available with id ${fieldId}`);
            }
        }
        catch (error) {
            this.logger.error(error.message);
            return error.message;
        }
    }
    async deleteAreas(farmId) {
        const fields = await prisma.field.findMany({
            where: {
                area: {
                    farm: {
                        id: farmId,
                    },
                },
            },
        });
        for (const field of fields) {
            this.logger.log(await this.deleteArea(field.id));
        }
    }
    async listObservations(fieldId) {
        var _a;
        const b64Url = Buffer.from(BASE_URL, 'base64');
        const apiUrl = b64Url.toString('utf-8');
        if (fieldId) {
            const fieldData = await prisma.field.findUnique({
                where: {
                    id: fieldId,
                },
            });
            const urlTxt = `${apiUrl}/area/${(_a = fieldData === null || fieldData === void 0 ? void 0 : fieldData.visiona_area_id) !== null && _a !== void 0 ? _a : 0}`;
            try {
                const response = await this.httpService.axiosRef({
                    method: 'get',
                    url: urlTxt,
                    headers: {
                        Authorization: `Basic ${AUTH_TOKEN}`,
                    },
                });
                this.logger.log(`Fetch observations from visiona API`);
                return response.data;
            }
            catch (error) {
                this.logger.error(error);
            }
        }
    }
};
VisionaService = VisionaService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], VisionaService);
exports.VisionaService = VisionaService;
//# sourceMappingURL=visiona.service.js.map