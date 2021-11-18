import React from 'react';
import { Text, Checkbox } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';

import { colors } from '../../src/assets';
import { createTStyleSheet, overrideTStyleSheet, ExtendedStyle } from '../../src/utils/style';

type CustomCheckboxProps = {
	title: string | JSX.Element;
	status: 'checked' | 'unchecked' | 'indeterminate';
	onPress: () => void;
	customStyle?: ExtendedStyle;
};

export function CustomCheckbox(props: CustomCheckboxProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		mainTouchable: props.customStyle ?? {},
	});
	return (
		<TouchableOpacity activeOpacity={0.5} style={styles.mainTouchable} onPress={props.onPress}>
			<Checkbox color={colors.secondary.green_30} status={props.status} />
			{typeof props.title === 'string' ? <Text style={styles.checkboxText}>{props.title}</Text> : props.title}
		</TouchableOpacity>
	);
}

const defaultStyleSheet = createTStyleSheet({
	mainTouchable: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkboxText: {
		fontSize: '14rem',
	},
});
