import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { Models } from '../../models';
import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';
import { colors } from '../../src/assets';
import { formatDateWithTime } from '../../src/utils';
import { RoundIcon } from '../00-common';
import { NotificationType, translateNotificationType } from './type-translation';

type NotificationCardProps = {
	notification: Models.notification;
	onPress: () => void;
};

function getIconName(type: NotificationType): string {
	if (type === 'DIAGNOSIS') return 'assignment';
	if (type === 'PRESCRIPTION') return 'format-list-bulleted';
	if (type === 'TERMS') return 'assignment-turned-in';
	if (type === 'QUOTATION') return 'receipt';
	if (type === 'APPUPDATE') return 'system-update';
	return 'message';
}

export function NotificationCard(props: NotificationCardProps) {
	const [disabled, setDisabled] = useState(props.notification.read_date ?? false);

	const type = translateNotificationType(props.notification.type);
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		textViewTextHeader: {
			fontWeight: disabled ? 'normal' : 'bold',
		},
	});

	return (
		<Card
			style={styles.card}
			onPress={() => {
				setDisabled(true);
				props.onPress();
			}}
		>
			<View style={styles.contentView}>
				<View style={styles.iconView}>
					<RoundIcon hasMaterial isEnabled={!disabled} icon={getIconName(type)} color={colors.supportSuccess.lighter} size="41rem" iconSize="20rem" />
				</View>
				<View style={styles.textView}>
					<Text numberOfLines={1} style={styles.textViewTextHeader}>
						{props.notification.body.title}
					</Text>
					{props.notification.body.message && (
						<Text numberOfLines={1} style={styles.textViewTextContent}>
							{props.notification.body.message}
						</Text>
					)}
					{props.notification.body.quotationId && (
						<Text numberOfLines={1} style={styles.textViewTextContent}>
							This notification came with a quotationId: {props.notification.body.quotationId}
						</Text>
					)}
					<Text numberOfLines={1} style={styles.textViewTextContent}>
						{formatDateWithTime(props.notification.sent_date)}
					</Text>
				</View>
				<MaterialIcons name="navigate-next" color="#6C6464" style={styles.icon} />
			</View>
		</Card>
	);
}

const defaultStyleSheet = createTStyleSheet({
	card: {
		borderRadius: '8rem',
		elevation: '4rem',
		marginVertical: '8rem',
		marginHorizontal: '16rem',
		padding: '16rem',
	},
	contentView: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
	},
	iconView: {
		height: '100%',
		justifyContent: 'flex-start',
	},
	textView: {
		flex: 1,
		justifyContent: 'center',
		paddingLeft: '16rem',
	},
	textViewTextHeader: {
		fontSize: '13rem',
		fontWeight: 'bold',
	},
	textViewTextContent: {
		marginTop: '4rem',
		fontSize: '12rem',
		color: '#78849E',
	},

	icon: {
		fontSize: '22rem',
	},
	$imageSize: '30rem',
	image: {
		width: '$imageSize',
		height: '$imageSize',
		tintColor: colors.lightGreen,
	},
});
