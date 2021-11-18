import { Controller, Get, Post, Param, Body, Res, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { RecordService } from './record.service';
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

@Controller('record')
export class RecordController {
	constructor(private readonly RecordService: RecordService, readonly quotationService: QuotationService, readonly mailService: MailService) {}

	@Get('recordId/:id')
	async getDiagnosisWithMap(@Param('id') field_id: string): Promise<string> {
		const data = await this.RecordService.getFarmDataByUserId(field_id);
		// return the base64 encoded image as string
		// res.type('json').send({''});
		return data!;
	}

	// @Get()
	// @UsePipes(new ValidationPipe())
	// async getDiagnosisWithMap(@Request() req: any, @Body() record: any): Promise<string> {
	// 	console.log('teste');

	// 	const data = await this.RecordService.getFarmDataByUserId(record);
	// 	// const QUOTATION_MAIL_DESTINATIONS = await this.quotationService.getMails();
	// 	// await this.mailService.sendMail({
	// 	// 	to: QUOTATION_MAIL_DESTINATIONS,
	// 	// 	subject: `[Novo Orçamento] - Usuário: $10 - ID do Pacote: 10`,
	// 	// 	text: ` orimeiro teste do email Timestamp: ${new Date().toISOString()}`,
	// 	// });
	// 	// console.log(JSON.stringify(data, undefined, '\t'));
	// 	return JSON.stringify(data, undefined, '\t');
	// }

	@Post()
	@UsePipes(new ValidationPipe())
	async updateDiagnosisData(@Request() req: any, @Body() record: any): Promise<string> {
		// const data = JSON.stringify(req.IncomingMessage);
		// console.log('postData', record);
		const update = await this.RecordService.saveRecord(record);
		return '';
	}
}
