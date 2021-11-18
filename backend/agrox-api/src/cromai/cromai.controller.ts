import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { CromaiParserService, IDiagnosisReport } from './cromaitask.service';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

function assertAccessTokenValid(token: string): void {
	if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
		throw new Error(`Invalid access token: ${token}`);
	}
}

export class DiagnosisDTO {
	@IsNotEmpty()
	@IsString()
	accessToken!: string;

	@IsNotEmpty()
	diagnosis!: Record<string, IDiagnosisReport>;
}

@Controller('cromai')
export class CromaiController {
	constructor(private readonly diagnosisParser: CromaiParserService) {}

	@Post('update-diagnosis-data')
	@UsePipes(new ValidationPipe())
	async updateDiagnosisData(@Body() data: DiagnosisDTO) {
		assertAccessTokenValid(data.accessToken);
		await this.diagnosisParser.updateFieldPlagueDiagnosisData(data.diagnosis);
	}
}
