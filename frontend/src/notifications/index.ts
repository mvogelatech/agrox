import { setupNotificationListeners } from './setup';
import { navigate } from '../navigate-from-anywhere';
import { dispatch } from '../../redux-things';
import { debug } from '../debug';

export function setupAgroXNotificationListeners() {
	setupNotificationListeners({
		pressed(notification) {
			debug(`Pressed notification with title "${notification.messageTitle!}"`);
			navigate('Notifications', { fromPushNotification: notification.agroNotification });
			dispatch({ type: 'BACKEND_DATA__NEW_PUSH_NOTIFICATION', notification: notification.agroNotification });
		},
		receivedForeground(notification) {
			debug(`Received notification in foreground with title "${notification.messageTitle!}"`);
			dispatch({ type: 'BACKEND_DATA__NEW_PUSH_NOTIFICATION', notification: notification.agroNotification });
		},
		receivedNotForeground(notification) {
			debug(`Received notification not in foreground with title "${notification.messageTitle!}"`);
			dispatch({ type: 'BACKEND_DATA__NEW_PUSH_NOTIFICATION', notification: notification.agroNotification });
		},
	});
}
