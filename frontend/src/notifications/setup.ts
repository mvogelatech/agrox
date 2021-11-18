import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AppState, AppStateStatus } from 'react-native';
import { debug } from '../debug';
import { parseAgroNotification, ParsedAgroNotification } from './parse-agro-notification';

Notifications.setNotificationHandler({
	async handleNotification(notification) {
		// This function is the first thing that runs when a notification is received AND the app is in foreground. It decides what to do.
		// This function does not run if the app is not in foreground.

		const parsedNotification = parseAgroNotification(notification);

		debug('Received notification while in foreground:', {
			raw: notification,
			parsed: parsedNotification,
		});

		/// Raw notification example:
		///
		/// {
		/// 	request: {
		/// 		content: {
		/// 			autoDismiss: true,
		/// 			sound: 'default',
		/// 			data: { foowowowoow: 'barwiwowoow' },
		/// 			body: 'Hello world! 123',
		/// 			badge: null,
		/// 			title: 'Hello world? 123',
		/// 			subtitle: null,
		/// 		},
		/// 		trigger: {
		/// 			remoteMessage: {
		/// 				originalPriority: 2,
		/// 				notification: null,
		/// 				from: '787336713843',
		/// 				ttl: 2419200,
		/// 				sentTime: 1600622429526,
		/// 				data: {
		/// 					message: 'Hello world! 123',
		/// 					title: 'Hello world? 123',
		/// 					icon: 'https://docs.expo.io/static/images/favicon.ico',
		/// 					body: '{"foowowowoow":"barwiwowoow"}',
		/// 					experienceId: '@anonymous/embraer-agro',
		/// 				},
		/// 				to: null,
		/// 				collapseKey: null,
		/// 				messageType: null,
		/// 				priority: 2,
		/// 				messageId: '0:1600622429538869%374b94d1f9fd7ecd',
		/// 			},
		/// 			type: 'push',
		/// 		},
		/// 		identifier: '0:1600622429538869%374b94d1f9fd7ecd',
		/// 	},
		/// 	date: 1600622429526,
		/// }

		const { silent } = parsedNotification;

		return {
			shouldShowAlert: !silent,
			shouldPlaySound: !silent,
			shouldSetBadge: !silent,
		};
	},

	handleSuccess(notificationMessageId: string) {
		// '0:1600620931569895%374b94d1f9fd7ecd'
		debug(`Successfully received push notification with FCM ID ${notificationMessageId}`);
	},

	handleError(...args) {
		debug('Error handling notification! Args:', args);
	},
});

async function getCurrentlyShowingNotifications(): Promise<ParsedAgroNotification[]> {
	const rawNotifications = await Notifications.getPresentedNotificationsAsync();
	return rawNotifications.map((rawNotification) => parseAgroNotification(rawNotification));
}

export type AgroNotificationListener = (notification: ParsedAgroNotification) => void | Promise<void>;

export type AgroNotificationListeners = {
	/**
	 * This listener will be called when a notification arrives and the app is in foreground.
	 */
	receivedForeground?: AgroNotificationListener;

	/**
	 * This listener will be called when the app comes to foreground and notices one or more notifications that arrived while it was in background.
	 * The listener will be called once for each notification, in series.
	 */
	receivedNotForeground?: AgroNotificationListener;

	/**
	 * This listener will be called when the user presses a notification (regardless the app being in foreground or not)
	 */
	pressed?: AgroNotificationListener;
};

const notificationIdsAlreadyDetected = new Set<string>();

/**
 * This function must be called ASAP when the app starts. Ideally inside an `useEffect` in the app root.
 */
export function setupNotificationListeners(listeners: AgroNotificationListeners): () => void {
	async function appStateChangeHandlerForNotifications(newState: AppStateStatus) {
		if (newState !== 'active') return;

		// App has just come to foreground.

		const currentlyShowingNotifications = await getCurrentlyShowingNotifications();

		const newlyDetectedNotifications: ParsedAgroNotification[] = [];

		for (const notification of currentlyShowingNotifications) {
			if (!notificationIdsAlreadyDetected.has(notification.fcmMessageId)) {
				notificationIdsAlreadyDetected.add(notification.fcmMessageId);
				newlyDetectedNotifications.push(notification);
			}
		}

		for (const notification of newlyDetectedNotifications) {
			await listeners.receivedNotForeground?.(notification);
		}
	}

	try {
		debug('Constants.manifest.id', Constants.manifest.id);

		const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
			const parsed = parseAgroNotification(notification);
			notificationIdsAlreadyDetected.add(parsed.fcmMessageId);
			void listeners.receivedForeground?.(parsed);
		});

		const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
			const parsed = parseAgroNotification(response.notification);
			notificationIdsAlreadyDetected.add(parsed.fcmMessageId);
			void listeners.pressed?.(parsed);
		});

		AppState.addEventListener('change', appStateChangeHandlerForNotifications);

		return () => {
			debug('Removing notification listeners...');
			subscription1.remove();
			subscription2.remove();
			AppState.removeEventListener('change', appStateChangeHandlerForNotifications);
		};
	} catch (error) {
		debug('Error setting up notification listeners:', error);
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return () => {};
	}
}
