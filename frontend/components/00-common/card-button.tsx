import React from 'react';
import { Card } from 'react-native-paper';
import { View, TouchableOpacity, Text } from 'react-native';

import { Icon, Color, colors } from '../../src/assets';
import { RoundIcon } from './round-icon';
import { createTStyleSheet, overrideTStyleSheet, ExtendedStyle } from '../../src/utils/style';

import { displayAlert, alertDatePrescription } from '../../src/utils/alert-messages';

type DisabledMessageType = {
	title: string;
	body: string;
	buttonText: string;
};

type EnabledProp = {
	enabled: true;
};

type DisabledProp = {
	enabled: false;
	disabledMessage: DisabledMessageType;
};

type CardButtonProps = {
	text: string;
	icon: Icon;
	iconColor: Color;
	customStyle?: ExtendedStyle;
	onPress: () => void;
} & (EnabledProp | DisabledProp);

export function CardButton(props: CardButtonProps) {
	// const field = useMainSelector((state) => state.interactionData.general.currentField)!;
	// if (field.crop[0].diagnosis[0]) {
	// 	const now = new Date(); // Data de hoje
	// 	const past = new Date(field.crop[0].diagnosis[0].report_date); // Outra data no passado
	// 	const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
	// 	const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).
	// 	console.log('estou aqui', days);

	// 	if (days > 60) {
	// 		control = false;
	// 		displayAlert(alertDatePrescription);
	// 	}

	// 	if (days > 30) {
	// 		control = false;
	// 		displayAlert(alertDatePrescription);
	// 	}
	// }
	displayAlert(alertDatePrescription);

	const styles = overrideTStyleSheet(defaultStyleSheet, {
		card: props.customStyle ?? {},
		text: {
			color: props.enabled ? undefined : colors.gray,
		},
	});
	return (
		<View style={styles.mainview}>
			<Card style={styles.card}>
				<TouchableOpacity
					activeOpacity={0.5}
					style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
					onPress={props.enabled ? props.onPress : () => displayAlert(props.disabledMessage)}
				>
					<RoundIcon isEnabled={props.enabled} icon={props.icon} color={props.iconColor} size="30rem" />
					<Text style={styles.text}>{props.text}</Text>
				</TouchableOpacity>
			</Card>
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
	mainView: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		elevation: '4rem',
		height: '44rem',
		width: '100%',
	},
	text: {
		marginLeft: '10rem',
		fontSize: '14rem',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: '500',
	},
});
