import React from 'react';
import { View, Text, Image } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { Button } from 'react-native-paper';
import { icons } from '../../src/assets';

type QuotationMethodProps = {
	method: 'plane' | 'drone';
	isHideDetailsButton?: boolean;
	onDetailsPress: () => void;
};

export function QuotationMethod(props: QuotationMethodProps) {
	return (
		<View style={styles.mainView}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View style={styles.iconView}>
					<Image style={styles.titleIcon} source={props.method === 'drone' ? icons.drone : icons.plane} />
				</View>

				<Text style={styles.titleText}>Pulverização por {props.method === 'drone' ? 'Drone' : 'Avião'}</Text>
			</View>
			{props.isHideDetailsButton ? undefined : (
				<Button uppercase mode="text" labelStyle={styles.buttonText} style={styles.button} onPress={props.onDetailsPress}>
					Detalhes
				</Button>
			)}
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#F7F7FA',
		elevation: 4,
	},
	$titlePadding: '16rem',
	titleText: {
		paddingLeft: '$titlePadding',
		fontSize: '16rem',
		color: '#6C6464',
	},
	$size: '32rem',
	titleIcon: {
		width: '$size',
		height: '$size',
		tintColor: 'white',
	},
	iconView: {
		backgroundColor: '#0D3845',
		padding: '24rem',
	},
	button: {
		height: '37rem',
		width: '109rem',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
