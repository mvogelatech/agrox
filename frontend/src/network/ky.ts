import ky_ from 'ky';
import Constants from 'expo-constants';
import { getAuthDataWithoutStateUpdate } from '../../redux-things/utils';

export async function getAuthorizationHeader(): Promise<string | undefined> {
	const { userToken } = getAuthDataWithoutStateUpdate();
	if (!userToken) return;
	return `Bearer ${userToken}`;
}

function getDevIpAddress() {
	const DEV_BACKEND_CONNECTION_PORT = 8080;

	if (!Constants.isDevice) {
		// https://developer.android.com/studio/run/emulator-networking#networkaddresses
		return `http://192.168.1.8:${DEV_BACKEND_CONNECTION_PORT}`;
	}

	try {
		const url = Constants.manifest.bundleUrl || Constants.manifest.debuggerHost;
		const [protocol, rest] = url!.split('://');
		const cleanUrl = rest.replace(/[/:].*$/, '');
		return `${protocol}://${cleanUrl}:${DEV_BACKEND_CONNECTION_PORT}`;
	} catch {
		throw new Error('I see you are running in DEV mode in a real device and I could not find your local IP address...');
	}
}

// the backend url for deploy type will be injected by CI during APK generation according to the selected environment (production or development)
export const BACKEND_BASE_URL = __DEV__ ? getDevIpAddress() : 'https://agroxdev.rj.r.appspot.com';

export const kyWithoutAuth = ky_.extend({
	prefixUrl: BACKEND_BASE_URL,
	timeout: false,
	hooks: {
		beforeRequest: [
			async (request) => {
				// const header = await getAuthorizationHeader();
				// if (!header) throw new Error(`Refusing to start unauthenticated request.`);
				// request.headers.set('Authorization', header);
				console.log('request', request);
				// console.log('response', response);
			},
		],
	},
	throwHttpErrors: true,
});

export const ky = kyWithoutAuth.extend({
	hooks: {
		beforeRequest: [
			async (request) => {
				const header = await getAuthorizationHeader();
				if (!header) throw new Error(`Refusing to start unauthenticated request.`);
				request.headers.set('Authorization', header);
			},
		],
	},
	timeout: 15000,
});
