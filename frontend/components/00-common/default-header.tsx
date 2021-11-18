import React, { useState } from 'react';
import { Appbar, Badge } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { REM_SCALE } from '../../src/utils';
import { View } from 'react-native';
import { fetchUserUnreadNotificationCount } from '../../src/network';
import { useFocusEffect } from '@react-navigation/native';

type DefaultHeaderProps = {
	title: string;
	onDrawerPress: () => void;
	onNotificationPress: () => void;
};

export function DefaultHeader(props: DefaultHeaderProps) {
	const [notificationCount, setNotificationCount] = useState(0);

	useFocusEffect(() => {
		(async () => {
			const num = await fetchUserUnreadNotificationCount();
			setNotificationCount(num);
		})();
	});

	return (
		<Appbar.Header style={styles.appbar}>
			<Appbar.Action icon="menu" size={24 * REM_SCALE} onPress={props.onDrawerPress} />
			<Appbar.Content title={props.title} style={styles.content} titleStyle={styles.titleText} />
			<View>
				<Badge visible={notificationCount > 0} size={16 * REM_SCALE} style={styles.badge}>
					{notificationCount}
				</Badge>
				<Appbar.Action color="white" icon="bell" size={24 * REM_SCALE} onPress={props.onNotificationPress} />
			</View>
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
	badge: {
		position: 'absolute',
		top: '5rem',
		right: '5rem',
	},
});
