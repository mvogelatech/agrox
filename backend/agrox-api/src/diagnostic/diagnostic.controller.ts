import { Controller, Request, Post, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { DiagnosticService } from './diagnostic.service';
import { MailService } from '../mail/mail.service';
import { AgroRequest } from '../types';

export class DiagnosticDto {
	@IsNotEmpty()
	@IsDateString()
	pulverizationStartDate!: string;

	@IsNotEmpty()
	@IsDateString()
	pulverizationEndDate!: string;

	@IsNotEmpty({ each: true })
	fieldsWithMethods!: Record<string, number>;
}

@Controller('diagnostic')
@UseGuards(JwtAuthGuard)
export class DiagnosticController {
	constructor(readonly diagnosticService: DiagnosticService, readonly mailService: MailService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	async createDiagnostic(@Request() req: AgroRequest): Promise<string> {
		// const createdPackage = await this.diagnosticService.createQuotationPackage(
		// 	req.user.userId!,
		// 	new Date(quotation.pulverizationStartDate),
		// 	new Date(quotation.pulverizationEndDate),
		// 	new Map(Object.entries(quotation.fieldsWithMethods).map((pair) => [Number(pair[0]), pair[1]])),
		// );

		// console.log('aqui para teste se foi ');
		const QUOTATION_MAIL_DESTINATIONS = await this.diagnosticService.getMails();
		const mailMessage = await this.diagnosticService.getMessageData(req.user.userId!, req.body);

		await this.mailService.sendMail({
			to: QUOTATION_MAIL_DESTINATIONS,
			subject: `[Novo Orçamento] - Usuário: ${req.user.userId!}`,
			text: `${mailMessage}\n\n\nTimestamp: ${new Date().toISOString()}`,
		});

		return JSON.stringify(mailMessage, undefined, '\t');
	}

	// @Get()
	// async getQuotationPackages(@Request() req: AgroRequest): Promise<string> {
	// 	const packages = await this.diagnosticService.getQuotationPackages(req.user.userId);
	// 	return JSON.stringify(packages, undefined, '\t');
	// }
}
