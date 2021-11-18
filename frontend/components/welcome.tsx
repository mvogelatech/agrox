import React from 'react';
import { ImageBackground } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { createTStyleSheet } from '../src/utils/style';

import { images } from '../src/assets';

export function Welcome() {
	return (
		<ImageBackground style={styles.background} source={images.screens.welcome}>
			<ActivityIndicator animating style={styles.indicator} color="white" />
		</ImageBackground>
	);
}

const styles = createTStyleSheet({
	background: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '120rem',
	},
});
