import React from 'react';
import { createTStyleSheet } from '../../src/utils/style';
import { MaterialIcons } from '@expo/vector-icons';

type CloseIconProps = {
	onPress: () => void;
};

export function CloseIcon(props: CloseIconProps) {
	return <MaterialIcons name="close" color="#888888" style={titleStyles.closeIcon} onPress={props.onPress} />;
}

export const titleStyles = createTStyleSheet({
	closeIcon: {
		fontSize: '20rem',
		paddingVertical: '8rem',
		paddingHorizontal: '16rem',
	},
});
