import React from 'react';
import { Appbar } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { REM_SCALE } from '../../src/utils';

type BackHeaderProps = {
	title: string;
	onBackPress: () => void;
	onNotificationPress?: () => void;
};

export function BackHeader(props: BackHeaderProps) {
	return (
		<Appbar.Header style={styles.appbar}>
			<Appbar.BackAction size={24 * REM_SCALE} onPress={props.onBackPress} />
			<Appbar.Content title={props.title} style={styles.content} titleStyle={styles.titleText} />
			{props.onNotificationPress && <Appbar.Action icon="bell" size={24 * REM_SCALE} onPress={props.onNotificationPress} />}
		</Appbar.Header>
	);
}

const styles = createTStyleSheet({
	content: {
		alignItems: 'center',
	},
	titleText: {
		fontSize: '20rem',
	},
	appbar: {
		height: '56.4rem',
	},
});
