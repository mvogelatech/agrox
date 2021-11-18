import { Body, Request, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrivacyPolicyService } from './privacy-policy.service';
import { IsNotEmpty, IsInt } from 'class-validator';
import { AgroRequest } from '../types';

class SetReadDto {
	@IsNotEmpty()
	@IsInt()
	privacyPolicyId!: number;
}

@Controller('privacy-policy')
@UseGuards(JwtAuthGuard)
export class PrivacyPolicyController {
	constructor(readonly privacyPolicyService: PrivacyPolicyService) {}

	@Get()
	async getCompanies(): Promise<string> {
		const privacyPolicy = await this.privacyPolicyService.getPrivacyPolicy();
		return JSON.stringify(privacyPolicy, undefined, '\t');
	}

	@Post('set-read')
	@UsePipes(new ValidationPipe())
	async createUserAcceptedTerms(@Request() req: AgroRequest, @Body() data: SetReadDto): Promise<string> {
		console.log(`Privacy Policy ${data.privacyPolicyId} was read`);

		const acceptedTerms = await this.privacyPolicyService.createUserAcceptedPrivacyPolicy(req.user.userId!, data.privacyPolicyId);
		return JSON.stringify(acceptedTerms, undefined, '\t');
	}
}
