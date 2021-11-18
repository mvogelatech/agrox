import React from 'react';
import { View, Image } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LiteralUnion } from 'type-fest';

import { Color, colors, icons, Icon } from '../../src/assets';
import { createTStyleSheet, overrideTStyleSheet, ExtendedStyle } from '../../src/utils/style';

type RoundIconProps = {
	isEnabled: boolean;
	hasMaterial?: boolean;
	icon: LiteralUnion<Icon, string>; // Same as `Icon | string`, but with better autocomplete
	color: Color;
	size: string;
	iconSize?: string;
	customIconStyle?: ExtendedStyle;
};

export function RoundIcon(props: RoundIconProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		$circleSize: props.size,
		$iconSize: props.iconSize,
		$circleColor: props.color,
		circle: {
			color: props.isEnabled ? '$circleColor' : colors.gray,
		},
		icon: props.customIconStyle ?? {},
	});

	return (
		<View style={styles.mainView}>
			<View style={styles.iconView}>
				{props.hasMaterial ? (
					<MaterialIcons name={props.icon} style={styles.iconM} color="white" />
				) : (
					<Image source={icons[props.icon as Icon]} resizeMode="contain" style={styles.icon} />
				)}
			</View>
			<FontAwesome name="circle" style={styles.circle} />
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
	// Initialization values that will be overrided
	$circleSize: 0,
	$circleColor: 0,

	mainView: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	circle: {
		fontSize: '$circleSize',
	},
	$iconSize: '$circleSize/2.3rem',
	$iconCenter: '$iconSize/2rem',
	iconView: {
		zIndex: 1,
		position: 'absolute',
		width: '$iconSize',
		height: '$iconSize',
		alignSelf: 'center',
	},
	icon: {
		width: '$iconSize',
		height: '$iconSize',
		tintColor: 'white',
	},
	iconM: {
		fontSize: '$iconSize',
	},
});
