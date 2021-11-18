import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createTStyleSheet } from '../../../src/utils/style';
import { FontAwesome } from '@expo/vector-icons';
import { Models } from '../../../models';
import { REM_SCALE } from '../../../src/utils';

type PlagueItemProps = {
	plague: Models.plague;
	percentage: number;
};

export function PlagueItem(props: PlagueItemProps) {
	return (
		<View style={styles.mainView}>
			<FontAwesome name="circle" style={{ paddingTop: 12 * REM_SCALE, color: props.plague.color }} />

			<View style={styles.textView}>
				<Text style={styles.typeText}>{props.plague.display_name}</Text>
				<Text>{props.percentage.toFixed(2)}%</Text>
			</View>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginHorizontal: '0rem',
	},
	textView: {
		flexDirection: 'column',
		padding: '8rem',
	},
	typeText: {
		fontWeight: '500',
		fontSize: '14rem',
	},
});
