import got from 'got';
import { notification } from '@prisma/client';
// import { JWT } from 'google-auth-library';
// import jetpack = require('fs-jetpack');

const SERVER_KEY = process.env.NOTIFICATIONS_SERVER_KEY;
const EXPERIENCE_ID = process.env.NOTIFICATIONS_EXPERIENCE_ID; // https://github.com/expo/expo/pull/10154

/*
const GCP_PROJECT_ID_STRING = process.env.GCP_PROJECT_ID;
// Auth code for the V1 version of the FCM API
async function getAccessToken(): Promise<string> {
	const service_account_key_content = jetpack.read(process.env.SERVICE_ACCOUNT_KEY!);
	const key = JSON.parse(service_account_key_content!);
	return new Promise(function (resolve, reject) {
		const jwtClient = new JWT(key.client_email, undefined, key.private_key, ['https://www.googleapis.com/auth/firebase.messaging'], undefined);
		jwtClient.authorize(function (err, tokens) {
			if (err) {
				reject(err);
				return;
			}

			resolve(tokens!.access_token as string);
		});
	});
}
*/

export type PushNotificationData = {
	// See `frontend/src/notifications/parse-notification.ts`
	messageTitle?: string;
	messageContent?: string;
	agroNotification: notification;
	silent: boolean;
};

export async function sendPushNotificationToToken(deviceToken: string, data: PushNotificationData): Promise<void> {
	// TODO migrate from Legacy API to V1 API:
	// https://firebase.google.com/docs/cloud-messaging/migrate-v1

	// code for V1 to work
	// const authToken: string = await getAccessToken();
	// const v1Uri = `https://fcm.googleapis.com/v1/projects/${GCP_PROJECT_ID_STRING!}/messages:send`;

	await got
		.post('https://fcm.googleapis.com/fcm/send', {
			headers: {
				Authorization: `key=${SERVER_KEY!}`, // Authorization: `Bearer ${authToken}`,
			},
			json: {
				to: deviceToken,
				priority: 'normal',
				data: {
					experienceId: EXPERIENCE_ID,
					title: data.messageTitle,
					message: data.messageContent,
					body: {
						agroNotification: data.agroNotification,
						__agro_silent__: data.silent, // See `frontend/src/notifications/parse-notification.ts`
					},
				},
			},
		})
		.json();
}
