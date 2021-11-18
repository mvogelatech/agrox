import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyService } from './company.service';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
	constructor(readonly companyService: CompanyService) {}

	@Get()
	async getCompanies(): Promise<string> {
		const companies = await this.companyService.getCompanies();
		return JSON.stringify(companies, undefined, '\t');
	}
}
