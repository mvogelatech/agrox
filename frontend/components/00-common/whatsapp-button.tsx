import React from 'react';
import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { createTStyleSheet, overrideTStyleSheet, ExtendedStyle } from '../../src/utils/style';
import { FontAwesome } from '@expo/vector-icons';

type WhatsappButtonProps = {
	text: string;
	customStyle?: ExtendedStyle;
	onPress: () => void;
};

export function WhatsappButton(props: WhatsappButtonProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		mainView: props.customStyle ?? {},
	});
	return (
		<TouchableOpacity activeOpacity={0.5} style={styles.mainView} onPress={props.onPress}>
			<FontAwesome name="whatsapp" style={styles.icon} />
			<Text style={styles.text}>{props.text}</Text>
		</TouchableOpacity>
	);
}

const defaultStyleSheet = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '30rem',
	},
	icon: {
		marginHorizontal: '7rem',
		fontSize: '20rem',
		color: '#469BA2',
	},
	text: {
		fontSize: '14rem',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: '500',
		color: '#469BA2',
	},
});
