import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { GeoJSONObject } from '@turf/helpers';
import { IsNotEmpty, IsString } from 'class-validator';
import { FieldMapService, IFieldFeatureCollection } from './field-map.service';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

function assertAccessTokenValid(token: string): void {
	if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
		throw new Error(`Invalid access token: ${token}`);
	}
}

export class FieldMapDTO {
	@IsNotEmpty()
	@IsString()
	accessToken!: string;

	@IsNotEmpty()
	geojsonData!: GeoJSONObject;
}

@Controller('field-map')
export class FieldMapController {
	constructor(private readonly fieldMapService: FieldMapService) {}

	@Post('create-update')
	@UsePipes(new ValidationPipe())
	async createUpdateFieldMap(@Body() data: FieldMapDTO): Promise<IFieldFeatureCollection> {
		assertAccessTokenValid(data.accessToken);
		return this.fieldMapService.insertFieldData(data.geojsonData);
	}
}
