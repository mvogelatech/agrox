import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { Icon, colors } from '../../src/assets';
import { RoundIcon } from '../00-common';
import { displayAlert, serviceNotAvailable } from '../../src/utils/alert-messages';

type ServiceCardProps = {
	isEnabled: boolean;
	text: string;
	icon: Icon;
	onPress: () => void;
};

export function ServiceCard(props: ServiceCardProps) {
	const propsDependentStyles = createTStyleSheet({
		text: {
			fontSize: '14rem',
			fontWeight: '500',
			textAlign: 'center',
			color: props.isEnabled ? 'black' : colors.gray,
		},
	});

	return (
		<View style={styles.mainview}>
			<Card style={styles.card}>
				<TouchableOpacity
					activeOpacity={0.5}
					style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
					onPress={props.isEnabled ? props.onPress : () => displayAlert(serviceNotAvailable)}
				>
					<RoundIcon isEnabled={props.isEnabled} icon={props.icon} color={colors.orange} size="50rem" />
					<Text style={propsDependentStyles.text}>{props.text}</Text>
				</TouchableOpacity>
			</Card>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		height: '105rem',
		width: '100rem',
		marginBottom: '20rem',
	},
	$size: '42rem',
	icon: {
		marginBottom: '10rem',
		width: '$size',
		height: '$size',
	},
});
