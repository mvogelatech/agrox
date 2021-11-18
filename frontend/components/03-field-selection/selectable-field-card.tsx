import React from 'react';
import { Card, Checkbox, Divider } from 'react-native-paper';
import { View } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { Models } from '../../models';
import { colors } from '../../src/assets';
import { FieldCard } from '../00-common/field-card';

type SelectableFieldCardProps = {
	isSelected: boolean;
	field: Models.field;
	isDiagnosisMode: boolean;
	onPress: () => void;
};

export function SelectableFieldCard(props: SelectableFieldCardProps) {
	return (
		<View style={styles.mainView}>
			<Card style={styles.card} onPress={props.onPress}>
				<View style={styles.checkboxView}>
					<Checkbox color={colors.lightBlue} status={props.isSelected ? 'checked' : 'unchecked'} />
				</View>
				<Divider style={styles.divider} />
				<View style={styles.fieldView}>
					<FieldCard isHideCircle isIndexNotAvailable={false} isDiagnosisMode={props.isDiagnosisMode} isElevated={false} field={props.field} />
				</View>
			</Card>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexBasis: '33.333%',
	},
	card: {
		elevation: '4rem',
		margin: '8rem',
		borderRadius: '5rem',
	},
	checkboxView: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '32 rem',
	},
	fieldView: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '114rem',
	},
	divider: {
		height: '1rem',
	},
});
