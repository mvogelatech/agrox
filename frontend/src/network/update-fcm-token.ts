import { ky } from './ky';
import { getToken } from '../notifications/get-token';

import { debug } from '../debug';

let lastKnownToken: string | undefined;
let mustTellBackend = false;

async function updateLastKnownToken(): Promise<void> {
	const token = await getToken();

	if (!token) {
		return;
	}

	if (token !== lastKnownToken) {
		lastKnownToken = token;
		mustTellBackend = true;
	}
}

async function tellBackendIfApplicable(): Promise<void> {
	debug('FCM token:', lastKnownToken);

	if (!mustTellBackend || !lastKnownToken) {
		return;
	}

	try {
		await ky.post('register-fcm-token', { json: { token: lastKnownToken } });
		mustTellBackend = false;
	} catch (error) {
		if (__DEV__) {
			console.warn(`Failed to tell backend FCM token: ${error.message as string}`);
		}
	}
}

async function _tryToUpdateFcmToken(): Promise<void> {
	try {
		// This function is called when the app becomes online or the user fetch is completed (see redux sagas)
		await updateLastKnownToken();
		await tellBackendIfApplicable();
	} catch {}
}

export function tryToUpdateFcmToken(): void {
	void _tryToUpdateFcmToken();
}
