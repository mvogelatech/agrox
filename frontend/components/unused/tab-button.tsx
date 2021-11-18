import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { icons, colors } from '../../src/assets';
import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';

type TabButtonProps = {
	enabled: boolean;
	text: string;
	icon: 'weed' | 'bug';
	selected: boolean;
	onPress: () => void;
};

export function TabButton(props: TabButtonProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		text: {
			color: props.enabled ? '#6C6464' : '#CACACA',
		},
		indicator: {
			backgroundColor: props.enabled ? '#327387' : 'white',
		},
		tabIcon: {
			tintColor: props.enabled ? colors.lightBlue : colors.gray,
		},
	});
	return (
		<View style={{ flex: 1 }}>
			<TouchableOpacity activeOpacity={0.5} style={styles.default} onPress={props.onPress}>
				<Image source={props.icon === 'weed' ? icons.weed : icons.bug} style={styles.tabIcon} resizeMode="contain" />
				<Text style={styles.text}>{props.text}</Text>
			</TouchableOpacity>
			<View style={styles.indicator} />
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
	$indicatorSize: '5rem',
	$tabHeight: '50rem',
	default: {
		flexDirection: 'row',
		height: '$tabHeight - $indicatorSize',
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		paddingTop: '$indicatorSize',
		marginLeft: '8rem',
		fontSize: '14rem',
	},
	indicator: {
		backgroundColor: '#327387',
		height: '$indicatorSize',
	},
	$iconSize: '20rem',
	tabIcon: {
		marginTop: '$indicatorSize',
		width: '$iconSize',
		height: '$iconSize',
	},
});
