import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlagueService } from './plague.service';

@Controller('plague')
@UseGuards(JwtAuthGuard)
export class PlagueController {
	constructor(readonly plagueService: PlagueService) {}

	@Get()
	async getPlagues(): Promise<string> {
		const plagues = await this.plagueService.getPlagues();
		return JSON.stringify(plagues, undefined, '\t');
	}
}
