import { Controller, Get, Param, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { DiagnosisReportService } from './diagnosis-report.service';
import { Response } from 'express';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

function assertAccessTokenValid(token: string): void {
	if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
		throw new Error(`Invalid access token: ${token}`);
	}
}

@Controller('diagnosis')
export class DiagnosisReportController {
	constructor(private readonly diagnosisService: DiagnosisReportService) {}

	@Get(':field_id/:diagnosis_id/:token')
	@UsePipes(new ValidationPipe())
	async getDiagnosis(@Param('field_id') fieldId: string, @Param('diagnosis_id') diagnosisId: string, @Param('token') token: string, @Res() res: Response) {
		// TODO this is a kludge !!!! the correct way to use this is to receive bearer token in a header
		// but the frontend component is not working so for now we pass the validation pipe token in the uri
		const buff = Buffer.from(token, 'base64');
		const decodedToken = buff.toString('ascii');
		assertAccessTokenValid(decodedToken);
		const img = await this.diagnosisService.generateFieldDiagnosisPNG(Number.parseInt(diagnosisId, 10));
		res.type('png').send(img);
	}

	@Get(':diagnosis_id/:date_path/:zoom/:token/')
	@UsePipes(new ValidationPipe())
	async getDiagnosisWithMap(
		@Param('diagnosis_id') diagnosisId: string,
		@Param('date_path') datePath: string,
		@Param('zoom') zoom: string,
		@Param('token') token: string,
		@Res() res: Response,
	) {
		// TODO this is a kludge !!!! the correct way to use this is to receive bearer token in a header
		// but the frontend component is not working so for now we pass the validation pipe token in the uri
		const buff = Buffer.from(token, 'base64');
		const decodedToken = buff.toString('ascii');
		assertAccessTokenValid(decodedToken);
		const img = await this.diagnosisService.generateFieldDiagnosisPNG(Number.parseInt(diagnosisId, 10), datePath, Number.parseInt(zoom, 10));
		res.type('png').send(img);
	}
}
