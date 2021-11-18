import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { Icon, colors } from '../../src/assets';
import { RoundIcon } from '../00-common';
import { displayAlert, serviceNotAvailable } from '../../src/utils/alert-messages';
import { useNavigation } from '@react-navigation/native';

type MenuCardProps = {
	text: string;
	image: string;
	cons: {};
	consText: {};
	textStyle: {};
	isEnabled: boolean;
	onPress: () => void;
};

export function MenuCard(props: MenuCardProps) {
	const propsDependentStyles = createTStyleSheet({
		card: {
			height: '155rem',
			width: '160rem',
			marginBottom: '20rem',
			backgroundColor: '#EFF0F0',
			paddingBottom: '-20rem',
			borderRadius: '10rem',
			opacity: props.isEnabled ? 1 : 0.2,
			// color: props.isEnabled ? 'black' : colors.gray,
		},
		$size: '50rem',
		img: {
			marginBottom: '5rem',
			width: '$size',
			height: '$size',
			marginTop: '2%',
			// opacity: props.isEnabled ? 1 : 0.2,
		},
	});
	const navigation = useNavigation();

	return (
		<View style={styles.mainview}>
			<Card style={propsDependentStyles.card}>
				<TouchableOpacity
					activeOpacity={0.5}
					style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
					onPress={props.isEnabled ? props.onPress : () => displayAlert(serviceNotAvailable)}
				>
					<Image source={{ uri: props.image }} style={propsDependentStyles.img} />
					<Text style={props.textStyle}>{props.text}</Text>
					<View style={props.cons}>
						<Text style={props.consText}>consultar</Text>
					</View>
				</TouchableOpacity>
			</Card>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		// alignItems: 'center',
		// justifyContent: 'center',
	},
});
