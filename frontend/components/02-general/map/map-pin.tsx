import React from 'react';
import { View, Image, Text } from 'react-native';
import { createTStyleSheet, overrideTStyleSheet } from '../../../src/utils/style';

import { Color, images } from '../../../src/assets';

type MapPinProps = {
	id: number;
	pinColor: Color;
};

export function MapPin(props: MapPinProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		image: {
			tintColor: props.pinColor,
		},
	});
	return (
		<View style={styles.viewContainer}>
			<Image style={styles.image} source={images.mapPin} resizeMode="contain" />
			<Text numberOfLines={1} style={styles.text}>
				{props.id}
			</Text>
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
	viewContainer: {
		flex: 1,
		alignItems: 'center',
	},
	image: {
		flex: 1,
		height: '39rem',
		width: '26rem',
		tintColor: 'gray',
	},
	text: {
		position: 'absolute',
		fontSize: '12rem',
		paddingTop: '5rem',
		fontWeight: 'bold',
	},
});
