import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { debug } from '../debug';

export async function getToken(): Promise<string | undefined> {
	if (!Constants.isDevice) {
		debug('getToken(): Not a device!');
		return;
	}

	const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	if (status !== 'granted') await Permissions.askAsync(Permissions.NOTIFICATIONS);
	return (await Notifications.getDevicePushTokenAsync())?.data;
}
