import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { VisionaService } from './visiona.service';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

function assertAccessTokenValid(token: string): void {
	if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
		throw new Error(`Invalid access token: ${token}`);
	}
}

export class VisionaDTO {
	@IsNotEmpty()
	@IsString()
	accessToken!: string;

	id!: number; // can be a farm id or field id (depending on the endpoint beign called)
}

export class ImageDTO {
	@IsNotEmpty()
	@IsString()
	accessToken!: string;

	@IsNotEmpty()
	@IsString()
	url!: string;
}

@Controller('visiona')
export class VisionaController {
	constructor(private readonly visionaService: VisionaService) {}

	@Post('list-area')
	@UsePipes(new ValidationPipe())
	async listArea(@Body() data: VisionaDTO) {
		assertAccessTokenValid(data.accessToken);
		if (data.id) return this.visionaService.listArea(data.id);
		return this.visionaService.listArea();
	}

	@Post('create-area')
	@UsePipes(new ValidationPipe())
	async createArea(@Body() data: VisionaDTO) {
		assertAccessTokenValid(data.accessToken);
		return this.visionaService.createArea(data.id);
	}

	@Post('create-areas')
	@UsePipes(new ValidationPipe())
	async createAreas(@Body() data: VisionaDTO) {
		assertAccessTokenValid(data.accessToken);
		return this.visionaService.createAreas(data.id); // farm id
	}

	@Post('delete-area')
	@UsePipes(new ValidationPipe())
	async deleteArea(@Body() data: VisionaDTO) {
		assertAccessTokenValid(data.accessToken);
		return this.visionaService.deleteArea(data.id);
	}

	@Post('delete-areas')
	@UsePipes(new ValidationPipe())
	async deleteAreas(@Body() data: VisionaDTO) {
		assertAccessTokenValid(data.accessToken);
		return this.visionaService.deleteAreas(data.id); // farm id
	}

	@Post('list-observations')
	@UsePipes(new ValidationPipe())
	async listObservations(@Body() data: VisionaDTO) {
		assertAccessTokenValid(data.accessToken);
		return this.visionaService.listObservations(data.id);
	}
}
