import React from 'react';
import { View, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { createTStyleSheet } from '../../src/utils/style';

import { icons, colors } from '../../src/assets';
import { Models } from '../../models';
import { getAllFieldsAreaHA } from '../../src/utils';

type AreaProps = {
	area: Models.area;
	onPress: () => void;
};

export function AreaCard(props: AreaProps) {
	return (
		<Card style={styles.card} onPress={props.onPress}>
			<View style={styles.contentView}>
				<Image source={icons.area} style={styles.image} />
				<View style={styles.textView}>
					<Text style={styles.textViewTextHeader}>{props.area.name}</Text>
					<Text style={styles.textViewTextContent}>
						{props.area.city ?? 'n/a'} - {props.area.state_initials ?? 'n/a'} - {getAllFieldsAreaHA(props.area).toFixed(2)} ha
					</Text>
				</View>
				<MaterialIcons name="navigate-next" color="#6C6464" style={styles.icon} />
			</View>
		</Card>
	);
}

const styles = createTStyleSheet({
	card: {
		borderRadius: '8rem',
		elevation: '4rem',
		marginVertical: '8rem',
		marginHorizontal: '16rem',
		padding: '20rem',
	},
	contentView: {
		flex: 1,
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
	},
	textView: {
		flex: 1,
		justifyContent: 'center',
		paddingLeft: '16rem',
	},
	textViewTextHeader: {
		fontSize: '16rem',
		color: '#454F63',
	},
	textViewTextContent: {
		fontSize: '14rem',
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
