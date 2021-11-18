import React from 'react';
import { View } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { createTStyleSheet } from '../../../../../src/utils/style';

import { useMainSelector } from '../../../../../redux-things';
import { getFieldAffectedAreaHA } from '../../../../../src/utils';
import { InfestationStatus } from '../../../../00-common/infestation-status';
import { PlagueTypes } from '../../../plagues/plague-types';

import { useNavigation } from '@react-navigation/native';

export function General() {
	const navigation = useNavigation();
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;
	const affectedArea = getFieldAffectedAreaHA(field)!;

	return (
		<View style={styles.mainView}>
			<InfestationStatus affectedArea={affectedArea} totalArea={field.area_ha} />
			<Divider style={styles.divider} />
			<PlagueTypes field={field} />
			<Button mode="contained" onPress={() => navigation.navigate('HireDiagnostic')}>
				Contratar Diagnóstico
			</Button>
		</View>
	);
}

const styles = createTStyleSheet({
	divider: {
		marginVertical: '4rem',
	},
	mainView: {
		flexDirection: 'column',
		paddingHorizontal: '16rem',
		paddingVertical: '8rem',
		justifyContent: 'space-between',
	},
});
