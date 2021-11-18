import { Controller, Request, Post, Get, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { QuotationService } from './quotation.service';
import { MailService } from '../mail/mail.service';
import { AgroRequest } from '../types';

export class QuotationDto {
	@IsNotEmpty()
	@IsDateString()
	pulverizationStartDate!: string;

	@IsNotEmpty()
	@IsDateString()
	pulverizationEndDate!: string;

	@IsNotEmpty({ each: true })
	fieldsWithMethods!: Record<string, number>;
}

@Controller('quotation')
@UseGuards(JwtAuthGuard)
export class QuotationController {
	constructor(readonly quotationService: QuotationService, readonly mailService: MailService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	async createQuotation(@Request() req: AgroRequest, @Body() quotation: QuotationDto): Promise<string> {
		const createdPackage = await this.quotationService.createQuotationPackage(
			req.user.userId!,
			new Date(quotation.pulverizationStartDate),
			new Date(quotation.pulverizationEndDate),
			new Map(Object.entries(quotation.fieldsWithMethods).map((pair) => [Number(pair[0]), pair[1]])),
		);

		const QUOTATION_MAIL_DESTINATIONS = await this.quotationService.getMails();
		const mailMessage = await this.quotationService.getMessageData(req.user.userId!, createdPackage);

		await this.mailService.sendMail({
			to: QUOTATION_MAIL_DESTINATIONS,
			subject: `[Novo Orçamento] - Usuário: ${req.user.userId!} - ID do Pacote: ${createdPackage.id}`,
			text: `${mailMessage}\n\n\nTimestamp: ${new Date().toISOString()}`,
		});

		return JSON.stringify(createdPackage, undefined, '\t');
	}

	@Get()
	async getQuotationPackages(@Request() req: AgroRequest): Promise<string> {
		const packages = await this.quotationService.getQuotationPackages(req.user.userId);
		return JSON.stringify(packages, undefined, '\t');
	}
}
