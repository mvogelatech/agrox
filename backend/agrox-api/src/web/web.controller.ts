import { Controller, Get, Post, Param, Body, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebService } from './web.service';
import { QuotationService } from '../quotation/quotation.service';
import { MailService } from '../mail/mail.service';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

function assertAccessTokenValid(token: string): void {
	if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
		throw new Error(`Invalid access token: ${token}`);
	}
}

type BODY = {
	data: string;
};

@Controller('web')
export class WebController {
	constructor(private readonly WebService: WebService, readonly quotationService: QuotationService, readonly mailService: MailService) {}

	@Get()
	@UsePipes(new ValidationPipe())
	async getDiagnosisWithMap(@Param('diagnosis_id') diagnosisId: string): Promise<string> {
		console.log('teste');

		const data = await this.WebService.getFarmDataByUserId(2);
		// const QUOTATION_MAIL_DESTINATIONS = await this.quotationService.getMails();
		// await this.mailService.sendMail({
		// 	to: QUOTATION_MAIL_DESTINATIONS,
		// 	subject: `[Novo Orçamento] - Usuário: $10 - ID do Pacote: 10`,
		// 	text: ` orimeiro teste do email Timestamp: ${new Date().toISOString()}`,
		// });
		// console.log(JSON.stringify(data, undefined, '\t'));
		return JSON.stringify(data, undefined, '\t');
	}

	@Get('demand')
	@UsePipes(new ValidationPipe())
	async getDemands(): Promise<string> {
		console.log('teste');

		const data = await this.WebService.getRequests();
		// const QUOTATION_MAIL_DESTINATIONS = await this.quotationService.getMails();
		// await this.mailService.sendMail({
		// 	to: QUOTATION_MAIL_DESTINATIONS,
		// 	subject: `[Novo Orçamento] - Usuário: $10 - ID do Pacote: 10`,
		// 	text: ` orimeiro teste do email Timestamp: ${new Date().toISOString()}`,
		// });
		// console.log(JSON.stringify(data, undefined, '\t'));
		return JSON.stringify(data, undefined, '\t');
	}

	// @Get()
	// @UsePipes(new ValidationPipe())
	// async getRequests(): Promise<string> {
	// 	console.log('teste');

	// 	const data = await this.WebService.getRequests();
	// 	// const QUOTATION_MAIL_DESTINATIONS = await this.quotationService.getMails();
	// 	// await this.mailService.sendMail({
	// 	// 	to: QUOTATION_MAIL_DESTINATIONS,
	// 	// 	subject: `[Novo Orçamento] - Usuário: $10 - ID do Pacote: 10`,
	// 	// 	text: ` orimeiro teste do email Timestamp: ${new Date().toISOString()}`,
	// 	// });
	// 	// console.log(JSON.stringify(data, undefined, '\t'));
	// 	return JSON.stringify(data, undefined, '\t');
	// }

	@Post('update')
	@UsePipes(new ValidationPipe())
	async updateDiagnosisData(@Body() body: BODY) {
		console.log('post');
		const update = await this.WebService.savePrescription(body.data);
		console.log('data', update);
		return update;
	}
}
