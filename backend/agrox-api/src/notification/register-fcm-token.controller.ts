import { Controller, Request, Post, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { AgroRequest } from '../types';
import { NotificationService } from './notification.service';

export class RegisterFCMTokenDto {
	@IsNotEmpty()
	@IsString()
	token!: string;
}

@Controller('register-fcm-token')
@UseGuards(JwtAuthGuard)
export class RegisterFCMTokenController {
	constructor(readonly notificationService: NotificationService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	async createQuotation(@Request() req: AgroRequest, @Body() data: RegisterFCMTokenDto): Promise<void> {
		console.log(`Received new FCM token for user #${req.user.userId!}: ${data.token}`);
		await this.notificationService.saveUserToken(req.user.userId!, data.token);
	}
}
