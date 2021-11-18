import { Controller, Get, Param, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { MapTilesService } from './map-tiles.service';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

function assertAccessTokenValid(token: string): void {
	if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
		throw new Error(`Invalid access token: ${token}`);
	}
}

@Controller('map-tiles')
export class MapTilesController {
	constructor(private readonly mapTilesService: MapTilesService) {}

	@Get(':farmid/:date/:z/:x/:y/:token')
	@UsePipes(new ValidationPipe())
	async getTile(
		@Param('farmid') farmid: string,
		@Param('date') date: string,
		@Param('z') z: string,
		@Param('x') x: string,
		@Param('y') y: string,
		@Param('token') token: string,
		@Res() res: Response,
	) {
		// TODO this is a kludge !!!! the correct way to use this is to receive bearer token in a header
		// but the frontend component is not working so for now we pass the validation pipe token in the uri
		const buff = Buffer.from(token, 'base64');
		const decodedToken = buff.toString('ascii');
		assertAccessTokenValid(decodedToken);
		const img = await this.mapTilesService.tileUrl(farmid, date, z, x, y);
		if (img && img.length > 0) res.type('png').send(img);
	}
}
