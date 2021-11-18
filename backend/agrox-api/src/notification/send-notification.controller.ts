import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { NotificationService } from './notification.service';

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

function assertAccessTokenValid(token: string): void {
	if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
		throw new Error(`Invalid access token: ${token}`);
	}
}

export class NotifySimpleMessageDto {
	@IsNotEmpty()
	@IsString()
	accessToken!: string;

	@IsNotEmpty()
	@IsInt()
	userId!: number;

	@IsNotEmpty()
	@IsString()
	messageTitle!: string;

	@IsNotEmpty()
	@IsString()
	messageContent!: string;
}

class SetReadDto {
	@IsNotEmpty()
	@IsInt()
	notificationId!: number;
}

export class NotifySimpleMessageLinkDto extends NotifySimpleMessageDto {
	@IsNotEmpty()
	@IsString()
	link!: string;
}

export class NotifySomethingReadyDto {
	@IsNotEmpty()
	@IsString()
	accessToken!: string;

	@IsNotEmpty()
	@IsInt()
	userId!: number;

	@IsNotEmpty()
	@IsInt()
	genericId!: number;

	@IsNotEmpty()
	@IsString()
	messageTitle!: string;

	@IsNotEmpty()
	@IsString()
	messageContent!: string;
}

@Controller('notification')
export class NotificationController {
	constructor(readonly notificationService: NotificationService) {}

	@Post('set-read')
	@UsePipes(new ValidationPipe())
	async setRead(@Body() data: SetReadDto): Promise<void> {
		console.log(`Notification ${data.notificationId} was read`);

		await this.notificationService.setNotificationRead(data.notificationId);
	}
}

@Controller('send-notification')
export class SendNotificationController {
	constructor(readonly notificationService: NotificationService) {}

	@Post('simple-message')
	@UsePipes(new ValidationPipe())
	async notifySimpleMessage(@Body() data: NotifySimpleMessageDto): Promise<void> {
		assertAccessTokenValid(data.accessToken);

		console.log(`Will send simple-message notification for user ${data.userId}`);

		await this.notificationService.sendSimpleMessageNotification(data.userId, {
			title: data.messageTitle,
			message: data.messageContent,
		});
	}

	@Post('quotation-ready')
	@UsePipes(new ValidationPipe())
	async notifyQuotationReady(@Body() data: NotifySomethingReadyDto): Promise<void> {
		assertAccessTokenValid(data.accessToken);

		console.log(`Will send quotation-ready notification for user ${data.userId} (quotation ${data.genericId})`);

		await this.notificationService.sendQuotationReadyNotification(data.userId, {
			title: data.messageTitle,
			message: data.messageContent,
			genericId: data.genericId,
		});
	}

	@Post('prescription-ready')
	@UsePipes(new ValidationPipe())
	async notifyPrescriptionReady(@Body() data: NotifySomethingReadyDto): Promise<void> {
		assertAccessTokenValid(data.accessToken);

		console.log(`Will send prescription-ready notification for user ${data.userId} (prescription ${data.genericId})`);

		await this.notificationService.sendPrescriptionReadyNotification(data.userId, {
			title: data.messageTitle,
			message: data.messageContent,
			genericId: data.genericId,
		});
	}

	@Post('diagnosis-ready')
	@UsePipes(new ValidationPipe())
	async notifyDiagnosisReady(@Body() data: NotifySomethingReadyDto): Promise<void> {
		assertAccessTokenValid(data.accessToken);

		console.log(`Will send diagnosis-ready notification for user ${data.userId} (diagnosis ${data.genericId})`);

		await this.notificationService.sendDiagnosisReadyNotification(data.userId, {
			title: data.messageTitle,
			message: data.messageContent,
			genericId: data.genericId,
		});
	}

	@Post('new-terms-and-conditions')
	@UsePipes(new ValidationPipe())
	async notifyNewTermsAndConditions(@Body() data: NotifySimpleMessageDto): Promise<void> {
		assertAccessTokenValid(data.accessToken);

		console.log(`Will send new-terms-and-conditions notification for user ${data.userId}`);

		await this.notificationService.sendTermsAndConditionsNotification(data.userId, {
			title: data.messageTitle,
			message: data.messageContent,
		});
	}

	@Post('app-update')
	@UsePipes(new ValidationPipe())
	async notifyAppUpdate(@Body() data: NotifySimpleMessageLinkDto): Promise<void> {
		assertAccessTokenValid(data.accessToken);

		console.log(`Will send app-update notification for user ${data.userId}`);

		await this.notificationService.sendAppUpdateNotification(data.userId, {
			title: data.messageTitle,
			message: data.messageContent,
			link: data.link,
		});
	}
}
