import { HttpService, Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AUTH_TOKEN = 'YW50b25pby5mZXJuYW5kb0BlbWJyYWVyLmNvbS5icjpBZ3JvZXhwbG9yZTFA';
const BASE_URL = 'aHR0cDovL3d3dy52aXNpb25hcGxhdGZvcm0uY29tL2FwaS9pbmRpY2U=';
const IMAGE_FILTER_THRESHOLD = 20; // a maximum of 20% of covered area are allowed

type VisionaObservation = {
	id: string;
	date: string;
	stats: {
		pixel?: {
			total?: number;
			valid?: number;
			cloud?: number;
			shadow?: number;
			nodata?: number;
		};
		indice: {
			savi?: {
				browseUrl: string;
			};
			ndwi?: {
				browseUrl: string;
			};
			ndvi?: {
				browseUrl: string;
			};
			ndre?: {
				browseUrl: string;
			};
			land_cover?: {
				browseUrl: string;
			};
			greenness?: {
				browseUrl: string;
			};
			fcover?: {
				browseUrl: string;
			};
			true_color?: {
				browseUrl: string;
			};
			false_color?: {
				browseUrl: string;
			};
		};
	};
};

function calculateImageCoveredPercentage(observation: VisionaObservation) {
	const total: number = observation.stats.pixel!.total ?? 0;
	const cloud: number = observation.stats.pixel!.cloud ?? 0;
	const shadow: number = observation.stats.pixel!.shadow ?? 0;
	const nodata: number = observation.stats.pixel!.nodata ?? 0;

	const num = shadow + cloud;
	const den = total - nodata;
	const den2 = den > 1 ? den : num; // if a possible division by zero then discard the image by using 100% of shadow+cloud
	// const imageFilter = (num / den2) * 100;
	const imageFilter = 18;

	return imageFilter;
}

@Injectable()
export class VisionaService {
	private readonly logger = new Logger(VisionaService.name);

	constructor(private readonly httpService: HttpService) {}

	async listArea(fieldId?: number) {
		const b64Url = Buffer.from(BASE_URL, 'base64');
		const apiUrl = b64Url.toString('utf-8');

		let urlTxt = ``;

		// if field id is not provided the request is for list all area data
		if (fieldId) {
			const fieldData = await prisma.field.findUnique({
				where: {
					id: fieldId,
				},
			});
			if (fieldData?.visiona_area_id) {
				urlTxt = `${apiUrl}/area/${fieldData.visiona_area_id}`;
			} else {
				return []; // empty observation
			}
		} else {
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

			// filter response from VISIONA and send only necessary data
			const filteredObservations: VisionaObservation[] = [];
			for (const observation of response.data.observations) {
				const obsDate: string[] = (observation.date as string).split('T');

				const imageFilter = calculateImageCoveredPercentage(observation);

				// filter by sattelite type: get better images avoiding a specific sattelite
				if (imageFilter < IMAGE_FILTER_THRESHOLD && !observation.stats.satellite?.includes('Landsat')) {
					const filteredObservation: VisionaObservation = {
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
		} catch (error) {
			this.logger.error(`${error.message} for id:${fieldId ?? 0}`);
			return []; // empty observation
		}
	}

	async createArea(fieldId: number) {
		// find the field to be registered as visiona area
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
				coords.push(fieldData?.coordinates);

				const b64Url = Buffer.from(BASE_URL, 'base64');
				const apiUrl = b64Url.toString('utf-8');

				let harvestDate = new Date().toLocaleDateString();
				if (fieldData?.crop[0] && fieldData?.crop[0].expected_harvest_date) harvestDate = fieldData?.crop[0].expected_harvest_date.toLocaleDateString();

				const response = await this.httpService.axiosRef({
					method: 'post',
					url: `${apiUrl}/areas/create`,
					headers: {
						Authorization: `Basic ${AUTH_TOKEN}`,
						'content-type': 'application/json',
					},
					data: {
						name: fieldData?.name,
						geojson: {
							type: 'Feature',
							properties: {
								nome_imovel: fieldData?.area.farm.fantasy_name,
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
						// update field table with visiona area id
						const ok = await prisma.field.update({
							data: {
								visiona_area_id: createdAreaId,
							},
							where: {
								id: fieldId,
							},
						});

						this.logger.log(`Created an area on visiona api with id, response: ${response.data.id}, db: ${ok.visiona_area_id ?? 'n/a'}`);
					} else {
						this.logger.log(`No id was provided in the api response. Received data: ${response.data}`);
					}

					return response.data;
				}
			} else {
				throw new Error(`No field available with id ${fieldId}`);
			}
		} catch (error) {
			this.logger.error(error.message);
			return error.message;
		}
	}

	async createAreas(farmId: number) {
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

	async deleteArea(fieldId: number) {
		// find the field to be registered as visiona area
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
					url: `${apiUrl}/areas/delete?id=${fieldData?.visiona_area_id ?? 0}`,
					headers: {
						Authorization: `Basic ${AUTH_TOKEN}`,
					},
				});

				if (response.data) {
					// update field table with visiona area id
					await prisma.field.update({
						data: {
							visiona_area_id: null,
						},
						where: {
							id: fieldId,
						},
					});
					this.logger.log(`Deleted an area on visiona api with id: ${fieldData?.visiona_area_id ?? 0}`);
				} else {
					this.logger.log(response.statusText);
					this.logger.log('No area was deleted on visiona API');
				}
			} else {
				throw new Error(`No field available with id ${fieldId}`);
			}
		} catch (error) {
			this.logger.error(error.message);
			return error.message;
		}
	}

	async deleteAreas(farmId: number) {
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

	async listObservations(fieldId?: number) {
		const b64Url = Buffer.from(BASE_URL, 'base64');
		const apiUrl = b64Url.toString('utf-8');

		if (fieldId) {
			const fieldData = await prisma.field.findUnique({
				where: {
					id: fieldId,
				},
			});

			const urlTxt = `${apiUrl}/area/${fieldData?.visiona_area_id ?? 0}`;

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
			} catch (error) {
				this.logger.error(error);
			}
		}
	}
}
