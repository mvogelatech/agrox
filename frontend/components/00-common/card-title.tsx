import React from 'react';
import { Text } from 'react-native-paper';
import { View } from 'react-native';
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';
import { CloseIcon } from './close-icon';

type IconType = 'location' | 'info';

type CardTitleProps = {
	text: string;
	titleIcon: IconType;
	onClose?: () => void;
};

export function CardTitle(props: CardTitleProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		mainView: {
			paddingVertical: props.onClose ? '8rem' : '16rem',
		},
	});

	function getIconComponent(type: IconType) {
		if (type === 'location') {
			return <SimpleLineIcons name="location-pin" style={styles.titleIcon} />;
		}

		return <MaterialIcons name="info-outline" style={styles.titleIcon} />;
	}

	return (
		<View style={styles.mainView}>
			<View style={{ flexDirection: 'row' }}>
				{getIconComponent(props.titleIcon)}
				<Text style={styles.titleText}>{props.text}</Text>
			</View>
			{props.onClose && <CloseIcon onPress={props.onClose} />}
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
	mainView: {
		paddingLeft: '16rem',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	titleText: {
		paddingLeft: '9rem',
		fontSize: '16rem',
		fontWeight: '400',
	},
	titleIcon: {
		fontSize: '20rem',
	},
});
