import React from 'react';
import { Text, Appbar } from 'react-native-paper';
import { View } from 'react-native';

import { createTStyleSheet, overrideTStyleSheet, ExtendedStyle } from '../../src/utils/style';
import { REM_SCALE } from '../../src/utils';

type ClosableHeaderProps = {
	title?: string;
	customStyle?: ExtendedStyle;
	onBackPress?: () => void;
	onClose?: () => void;
};

export function ClosableHeader(props: ClosableHeaderProps) {
	const styles = overrideTStyleSheet(
		defaultStyleSheet,
		{
			mainView: {
				alignItems: props.onBackPress ? 'center' : 'flex-start',
			},
		},
		{
			titleText: props.customStyle ?? {},
		},
	);
	return (
		<Appbar.Header style={styles.appbar}>
			<View style={styles.mainView}>
				{props.onBackPress ? <Appbar.BackAction size={24 * REM_SCALE} onPress={props.onBackPress} /> : undefined}
				<Text style={styles.titleText}>{props.title ?? ''}</Text>
				{props.onClose ? <Appbar.Action icon="close" size={24 * REM_SCALE} onPress={props.onClose} /> : undefined}
			</View>
		</Appbar.Header>
	);
}

const defaultStyleSheet = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		width: '100%',
	},
	titleText: {
		fontSize: '23rem',
	},
	appbar: {
		backgroundColor: 'white',
		height: 'auto',
		elevation: 0,
	},
});
