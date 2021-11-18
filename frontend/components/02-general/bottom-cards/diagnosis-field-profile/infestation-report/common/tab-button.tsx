import React from 'react';
import { View } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { createTStyleSheet, overrideTStyleSheet } from '../../../../../../src/utils/style';

type TabProps = {
	text: string;
	isSelected: boolean;
	onPress: () => void;
};

export function Tab(props: TabProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		indicator: {
			backgroundColor: props.isSelected ? '#469BA2' : 'white',
		},
	});
	return (
		<View style={styles.default}>
			<TouchableOpacity activeOpacity={0.5} style={styles.touchableOpacity} onPress={props.onPress}>
				<Text style={styles.text}>{props.text}</Text>
				<Divider style={styles.indicator} />
			</TouchableOpacity>
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
	$indicatorHeight: '2rem',
	$indicatorWidth: '80%',
	$indicatorMarginTop: '5rem',
	default: {
		flexBasis: 0,
		flexGrow: 1,
		// height: '45rem',
		paddingTop: '10rem',
		// backgroundColor: 'gray',
		justifyContent: 'center',
	},
	touchableOpacity: {
		alignItems: 'center',
	},
	text: {
		color: '#454F63',
		fontSize: '14rem',
	},
	indicator: {
		height: '$indicatorHeight',
		width: '$indicatorWidth',
		marginTop: '$indicatorMarginTop',
	},
});
