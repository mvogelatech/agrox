import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { TouchableOpacity } from 'react-native-gesture-handler';

type TabButtonProps = {
	text: string;
	isSelected: boolean;
	onPress: () => void;
};

export function TabButtonTextHighLight(props: TabButtonProps) {
	return (
		<View style={styles.mainView}>
			<TouchableOpacity activeOpacity={0.5} style={styles.default} onPress={props.onPress}>
				{props.isSelected ? (
					<View style={styles.selectedIndicator}>
						<Text style={styles.selectedText}>{props.text}</Text>
					</View>
				) : (
					<Text style={styles.text}>{props.text}</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		paddingHorizontal: '8rem',
		paddingVertical: '2rem',
	},
	default: {
		height: '30rem',
		backgroundColor: '#0D3845',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: '12rem',
		color: 'white',
		paddingHorizontal: '8rem',
	},
	selectedText: {
		fontSize: '12rem',
		color: '#0D3845',
	},
	selectedIndicator: {
		paddingHorizontal: '8rem',
		paddingVertical: '2rem',
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
		borderBottomRightRadius: 4,
		borderBottomLeftRadius: 4,
		backgroundColor: 'white',
	},
});
