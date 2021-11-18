import type { Notification } from 'expo-notifications';
import { Models } from '../../models';

export type ParsedAgroNotification = {
	// Fields defined by backend, see `backend/agrox-api/src/notification/helpers/push-to-token.ts`
	messageTitle?: string;
	messageContent?: string;
	agroNotification: Models.notification;
	silent: boolean;

	// Extra fields available in frontend
	fcmMessageId: string;
	fcmDate: Date;
};

function millisecondsToDate(ms: number): Date {
	const result = new Date();
	result.setTime(ms);
	return result;
}

export function parseAgroNotification(notification: Notification): ParsedAgroNotification {
	// We have the convention of considering a notification to be silent if it has set the `__agro_silent__` data field to anything truthy.
	const silent = notification.request.content.data.__agro_silent__; // The `content.data` comes from `data.body` backend request to FCM server

	return {
		messageTitle: notification.request.content.title ?? undefined, // This comes from `data.title` backend request to FCM server
		messageContent: notification.request.content.body ?? undefined, // This comes from `data.message` backend request to FCM server
		agroNotification: notification.request.content.data.agroNotification as Models.notification, // The `content.data` comes from `data.body` backend request to FCM server
		silent: Boolean(silent),
		fcmMessageId: notification.request.identifier,
		fcmDate: millisecondsToDate(notification.date),
	};
}
