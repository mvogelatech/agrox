import React, { useState } from 'react';
import * as ExpoNotifications from 'expo-notifications';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { View, Text, Linking } from 'react-native';

import { createTStyleSheet } from '../../src/utils/style';
import { AgroXScreenProps } from '../navigation-types';
import { BackHeader } from '../00-common/back-header';
import { NotificationCard } from './notification-card';
import { isDebugModeEnabled } from '../../src/debug';
import { dispatch, useMainSelector } from '../../redux-things';
import { Models } from '../../models';
import { translateNotificationType } from './type-translation';
import { ky } from '../../src/network/ky';
import { displayAlert } from '../../src/utils/alert-messages';
import { WHATSTAPP_DEFAULT_URL } from '../drawer-constants';

// import { makeDummyMessageNotification } from './fake-messages-for-testing';
//  const dummyExtraNotifications = [
//	makeDummyMessageNotification(),
//	makeDummyMessageNotification(),
// 	makeDummyQuotationReadyNotification(),
// 	makeDummyMessageNotification(),
// 	makeDummyQuotationReadyNotification(),
//  ];

function testLocalNotification() {
	const localNotification = {
		title: 'Oi sou uma notification',
		body: 'Alguma novidade será exibida aqui !',
		icon: '../../assets/android/drawable-xxhdpi/ic_action_ic_static_launcher.png',
		ios: {
			sound: true,
		},
		android: {
			sound: true,
			priority: 'high',
			icon: '../../assets/android/drawable-xxhdpi/ic_action_ic_static_launcher.png',
			color: '#42949D',
			sticky: false,
			vibrate: true,
		},
	};

	void ExpoNotifications.presentNotificationAsync(localNotification);

	console.log('notification sent');
}

async function postNotificationRead(notificationId: number) {
	try {
		await ky.post('notification/set-read', {
			json: {
				notificationId,
			},
		});
	} catch (error) {
		console.log('Post Notification Read', error);
	}
}

export function Notifications({ navigation, route }: AgroXScreenProps<'Notifications'>) {
	const { fromPushNotification } = route.params ?? {};

	const realNotifications = useMainSelector((state) => state.backendData.user!.notification);
	const areas = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm.area);

	function processNotification(notification: Models.notification) {
		void postNotificationRead(notification.id);
		const type = translateNotificationType(notification.type);
		if (type === 'DIAGNOSIS' || type === 'PRESCRIPTION') {
			gotoArea(notification.body.genericId);
		} else if (type === 'QUOTATION') {
			gotoQuotations();
		} else if (type === 'TERMS') {
			navigation.navigate('TermsAndConditions');
		} else if (type === 'MESSAGE') {
			displayAlert({
				title: notification.body.title,
				body: notification.body.message,
				buttonText: 'Ok',
			});
		} else if (type === 'APPUPDATE') {
			void Linking.openURL(notification.body.link ?? WHATSTAPP_DEFAULT_URL);
		}
	}

	function gotoArea(id: number) {
		const desiredArea = areas.find((area) => {
			return area.id === id;
		});
		console.log(desiredArea);
		if (desiredArea) {
			// Set the states
			dispatch({ type: 'CHANGE_GENERAL_TAB', tab: 'Diagnosis' });
			dispatch({ type: 'CHANGE_GENERAL_CARD', card: 'Fields' });
			dispatch({ type: 'CHANGE_FIELD', field: undefined });
			dispatch({ type: 'SET_SERVICES_PULVERIZATION', state: false });
			dispatch({ type: 'CHANGE_QUOTATION_TAB', tab: 'Preparing' });
			dispatch({ type: 'CHANGE_AREA', area: desiredArea });
			navigation.navigate('General');
		}
	}

	function gotoQuotations() {
		dispatch({ type: 'CHANGE_QUOTATION_TAB', tab: 'Available' });
		navigation.navigate('Quotations');
	}

	const [deleteAll, setDeleteAll] = useState(false);

	const notifications: Models.notification[] = [];
	for (const notification of realNotifications) {
		if (notification.read_date === null && !deleteAll) notifications.push(notification);
	}

	// const notifications = __DEV__ || isDebugModeEnabled() ? [...realNotifications, ...dummyExtraNotifications] : realNotifications;

	function getBottomComponent() {
		if (notifications.length > 0)
			return (
				<View style={styles.mainView}>
					<View style={styles.listView}>
						<ScrollView>
							{notifications.map((notification) => (
								<NotificationCard key={notification.id} notification={notification} onPress={() => processNotification(notification)} />
							))}
							<View style={{ alignItems: 'flex-end' }}>
								<Button
									uppercase
									disabled={false}
									mode="text"
									style={styles.button}
									labelStyle={styles.buttonText}
									onPress={() => {
										for (const notification of notifications) {
											setDeleteAll(true);
											void postNotificationRead(notification.id);
										}
									}}
								>
									Apagar Todas
								</Button>
							</View>
						</ScrollView>
					</View>
				</View>
			);

		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<MaterialCommunityIcons name="bell-ring" style={styles.icon} />
				<Text style={styles.noQuotationText}>Você não tem nenhuma notificação</Text>
			</View>
		);
	}

	return (
		<View style={styles.mainView}>
			<BackHeader title="Notificações" onBackPress={() => navigation.goBack()} />
			{__DEV__ || isDebugModeEnabled() ? (
				<View>
					<Button uppercase={false} disabled={false} mode="contained" onPress={testLocalNotification}>
						Test
					</Button>
					<Text>Você chegou aqui a partir da notificação: {JSON.stringify(fromPushNotification ?? 'NONE', undefined, '\t')}</Text>
				</View>
			) : undefined}
			{getBottomComponent()}
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		backgroundColor: 'white',
	},
	listView: {
		marginVertical: '8rem',
		justifyContent: 'flex-end',
	},
	icon: {
		fontSize: '80rem',
		color: '#D5D5DA',
	},
	noQuotationText: {
		marginTop: '16rem',
		color: '#78849E',
		fontWeight: 'bold',
	},
	button: {
		margin: '16rem',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
