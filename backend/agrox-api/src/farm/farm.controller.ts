import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InputJsonObject } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FarmService } from './farm.service';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

function assertAccessTokenValid(token: string): void {
	if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
		throw new Error(`Invalid access token: ${token}`);
	}
}

export class UserRegistrationDTO {
	@IsNotEmpty()
	@IsString()
	firstName!: string;

	@IsNotEmpty()
	@IsString()
	lastName!: string;

	@IsNotEmpty()
	@IsString()
	username!: string;

	@IsNotEmpty()
	@IsString()
	password!: string;

	@IsNotEmpty()
	@IsString()
	cpf!: string;

	@IsNotEmpty()
	@IsString()
	phoneNumber!: string;

	@IsNotEmpty()
	@IsString()
	email!: string;

	@IsNotEmpty()
	@IsString()
	roleName!: string;
}

export class AddressRegistrationDTO {
	@IsNotEmpty()
	@IsString()
	street!: string;

	@IsNotEmpty()
	@IsString()
	city!: string;

	@IsNotEmpty()
	@IsNumber()
	number!: number;

	@IsNotEmpty()
	@IsNumber()
	km!: number;

	@IsNotEmpty()
	@IsString()
	postalCode!: string;

	@IsNotEmpty()
	@IsString()
	complement!: string;

	@IsNotEmpty()
	@IsString()
	neighborhood!: string;

	@IsNotEmpty()
	@IsString()
	phoneNumber!: string;

	@IsNotEmpty()
	@IsString()
	contactName!: string;

	@IsNotEmpty()
	@IsString()
	stateInitials!: string;
}

export class FarmRegistrationDTO {
	@IsNotEmpty()
	@IsString()
	cnpj!: string;

	@IsNotEmpty()
	@IsString()
	socialName!: string;

	@IsNotEmpty()
	@IsString()
	fantasyName!: string;

	@IsNotEmpty()
	@IsNumber()
	lat!: number;

	@IsNotEmpty()
	@IsNumber()
	long!: number;
}

export class AreaRegistrationDTO {
	@IsNotEmpty()
	@IsNumber()
	code!: number;

	@IsNotEmpty()
	@IsNumber()
	lat!: number;

	@IsNotEmpty()
	@IsNumber()
	long!: number;

	@IsNotEmpty()
	@IsString()
	name!: string;

	@IsString()
	stateInitials!: string;

	@IsString()
	city!: string;

	@IsString()
	zone!: string;
}

export class FieldRegistrationDTO {
	@IsNotEmpty()
	@IsNumber()
	code!: number;

	@IsNotEmpty()
	@IsNumber()
	areaHA!: number;

	@IsNotEmpty()
	@IsNumber()
	lat!: number;

	@IsNotEmpty()
	@IsNumber()
	long!: number;

	@IsNotEmpty()
	@IsString()
	name!: string;

	@IsNotEmpty()
	@IsString()
	coordinates!: InputJsonObject;
}

export class CropRegistrationDTO {
	@IsNotEmpty()
	@IsString()
	cropType!: string;

	@IsNotEmpty()
	@IsString()
	variety!: string;

	@IsNotEmpty()
	sowingDate!: string;

	@IsNotEmpty()
	expectedHarvestDate!: string;

	@IsNotEmpty()
	@IsNumber()
	number!: number;
}

export class AreaFieldCropRegistrationDTO {
	@IsNotEmpty()
	areaData!: AreaRegistrationDTO;

	@IsNotEmpty()
	fieldData!: FieldRegistrationDTO;

	@IsNotEmpty()
	cropData!: CropRegistrationDTO;
}

export class RegistrationDTO {
	@IsNotEmpty()
	@IsString()
	accessToken!: string;

	@IsNotEmpty()
	farmData!: FarmRegistrationDTO;

	@IsNotEmpty()
	addressData!: AddressRegistrationDTO;

	@IsNotEmpty()
	userListData!: UserRegistrationDTO[];

	@IsNotEmpty()
	areaFieldCropListData!: AreaFieldCropRegistrationDTO[];
}

@Controller('farm')
export class FarmController {
	constructor(private readonly farmService: FarmService) {}

	@Post('register-farm')
	@UsePipes(new ValidationPipe())
	async registerFarm(@Body() data: RegistrationDTO) {
		assertAccessTokenValid(data.accessToken);
		await this.farmService.registerFarmBulk(data);
	}
}
