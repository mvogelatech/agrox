import { Body, Request, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { IsNotEmpty, IsInt } from 'class-validator';
import { AgroRequest } from '../types';

class SetReadDto {
	@IsNotEmpty()
	@IsInt()
	termsAndConditionsId!: number;
}

@Controller('terms-and-conditions')
@UseGuards(JwtAuthGuard)
export class TermsAndConditionsController {
	constructor(readonly termsAndConditionsService: TermsAndConditionsService) {}

	@Get()
	async getCompanies(): Promise<string> {
		const termsAndConditions = await this.termsAndConditionsService.getTermsAndConditions();
		return JSON.stringify(termsAndConditions, undefined, '\t');
	}

	@Post('set-read')
	@UsePipes(new ValidationPipe())
	async createUserAcceptedTerms(@Request() req: AgroRequest, @Body() data: SetReadDto): Promise<string> {
		console.log(`Terms And Conditions ${data.termsAndConditionsId} was read`);

		const acceptedTerms = await this.termsAndConditionsService.createUserAcceptedTerms(req.user.userId!, data.termsAndConditionsId);
		return JSON.stringify(acceptedTerms, undefined, '\t');
	}
}
