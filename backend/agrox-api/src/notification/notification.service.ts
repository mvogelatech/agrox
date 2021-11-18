import { Injectable } from '@nestjs/common';
import { InputJsonObject, PrismaClient } from '@prisma/client';
import pMap = require('p-map');

import { sendPushNotificationToToken, PushNotificationData } from './helpers/push-to-token';
import { notificationTypeToMagicNumber, NotificationType } from './helpers/notification-types';

const prisma = new PrismaClient();

const DEVICE_TOKEN_SEPARATOR = '###';

type BaseNotification = {
	title?: string;
	message?: string;
};

export type SimpleMessageNotificationData = {
	title: string;
	message: string;
};

export type SimpleMessageLinkNotificationData = {
	title: string;
	message: string;
	link: string;
};

export type ReadyNotificationData = {
	title: string;
	message: string;
	genericId: number;
};

@Injectable()
export class NotificationService {
	async saveUserToken(userId: number, token: string): Promise<void> {
		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) throw new Error(`User with id ${userId} not found.`);

		if (!user.fcm_token?.includes(token)) {
			const newTokenString = user.fcm_token ? `${user.fcm_token}${DEVICE_TOKEN_SEPARATOR}${token}` : token;

			await prisma.user.update({
				where: { id: userId },
				data: { fcm_token: newTokenString },
			});
		}
	}

	async setNotificationRead(id: number): Promise<void> {
		await prisma.notification.update({
			where: { id },
			data: {
				read_date: new Date(),
			},
		});
	}

	async sendSimpleMessageNotification(userId: number, data: SimpleMessageNotificationData): Promise<void> {
		await this.createAndSendNotification(userId, 'MESSAGE', data, false);
	}

	async sendTermsAndConditionsNotification(userId: number, data: SimpleMessageNotificationData): Promise<void> {
		await this.createAndSendNotification(userId, 'TERMS', data, false);
	}

	async sendQuotationReadyNotification(userId: number, data: ReadyNotificationData): Promise<void> {
		await this.createAndSendNotification(userId, 'QUOTATION', data, false);
	}

	async sendPrescriptionReadyNotification(userId: number, data: ReadyNotificationData): Promise<void> {
		await this.createAndSendNotification(userId, 'PRESCRIPTION', data, false);
	}

	async sendDiagnosisReadyNotification(userId: number, data: ReadyNotificationData): Promise<void> {
		await this.createAndSendNotification(userId, 'DIAGNOSIS', data, false);
	}

	async sendAppUpdateNotification(userId: number, data: SimpleMessageLinkNotificationData): Promise<void> {
		await this.createAndSendNotification(userId, 'APPUPDATE', data, false);
	}

	private async getUserTokens(userId: number): Promise<string[]> {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) throw new Error(`User with id ${userId} not found.`);
		if (!user.fcm_token) return [];
		return user.fcm_token.split(DEVICE_TOKEN_SEPARATOR);
	}

	private async createAndSendNotification(userId: number, type: NotificationType, data: BaseNotification, silent: boolean) {
		const notification = await this.prismaCreateNotification(userId, type, data);
		console.log(`Created notification #${notification.id} in our database.`);

		await this.sendPushNotificationToUser(userId, {
			silent,
			messageTitle: data.title,
			messageContent: data.message,
			agroNotification: notification,
		});
		console.log(`Sent push notification to user's devices.`);
	}

	private async prismaCreateNotification(userId: number, type: NotificationType, data: InputJsonObject) {
		return prisma.notification.create({
			data: {
				type: notificationTypeToMagicNumber(type),
				body: data,
				sent_date: new Date(),
				user: {
					connect: { id: userId },
				},
			},
		});
	}

	private async sendPushNotificationToUser(userId: number, data: PushNotificationData): Promise<void> {
		const tokens = await this.getUserTokens(userId);

		if (tokens.length === 0) throw new Error(`User with id ${userId} does not have any FCM token.`);

		await pMap(tokens, async (token) => {
			await sendPushNotificationToToken(token, data);
		});
	}
}
