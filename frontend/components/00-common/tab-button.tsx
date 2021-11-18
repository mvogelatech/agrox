import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

type TabButtonProps = {
	text: string;
	icon: 'equalizer' | 'gradient' | 'wifi-tethering';
	isSelected: boolean;
	onPress: () => void;
};

function selectIcon(icon: 'equalizer' | 'gradient' | 'wifi-tethering') {
	let selected: 'equalizer' | 'gradient' | 'wifi-tethering' = 'wifi-tethering';
	if (icon === 'gradient') {
		selected = 'gradient';
	} else if (icon === 'equalizer') {
		selected = 'equalizer';
	}

	return selected;
}

export function TabButton(props: TabButtonProps) {
	return (
		<View style={{ flex: 1 }}>
			<TouchableOpacity activeOpacity={0.5} style={styles.default} onPress={props.onPress}>
				<MaterialIcons name={selectIcon(props.icon)} color="white" style={styles.tabIcon} />
				<Text style={styles.text}>{props.text}</Text>
			</TouchableOpacity>
			{props.isSelected ? <View style={styles.selectedIndicator} /> : <View style={styles.unselectedIndicator} />}
		</View>
	);
}

const styles = createTStyleSheet({
	$indicatorSize: '6rem',
	$tabHeight: '50rem',
	default: {
		flexDirection: 'row',
		height: '$tabHeight - $indicatorSize',
		backgroundColor: '#0D3845',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		paddingTop: '$indicatorSize',
		marginLeft: '8rem',
		fontSize: '12rem',
		color: 'white',
	},
	selectedIndicator: {
		backgroundColor: '#99D19D',
		height: '$indicatorSize',
	},
	unselectedIndicator: {
		backgroundColor: '#0D3845',
		height: '$indicatorSize',
	},
	tabIcon: {
		paddingTop: '$indicatorSize',
		fontSize: '17rem',
	},
});
