import React from 'react';
import { Text, ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';

type WaitOverlayProps = {
	text: string;
};

export function WaitOverlay(props: WaitOverlayProps) {
	return (
		<View style={styles.sending}>
			<ActivityIndicator animating size="large" style={{ alignItems: 'center', justifyContent: 'center' }} color="white" />
			<Text style={styles.sendingText}>{props.text}</Text>
		</View>
	);
}

export const styles = createTStyleSheet({
	sending: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.6)',
		zIndex: 999,
		elevation: 5,
	},
	sendingText: {
		marginTop: '16rem',
		color: 'white',
		fontSize: '20rem',
		fontWeight: 'bold',
	},
});
