import React from 'react';
import { View } from 'react-native';
import { createTStyleSheet } from '../../../../src/utils/style';

import { CardTitle } from '../../../00-common/card-title';
import { useMainSelector } from '../../../../redux-things';
import { CloseableBottomCardProps } from '../closeable-bottom-card-props';
import { getAreaAffectedAreaHA, getAllFieldsAreaHA, getLatestPrescriptionPulverizationMethod } from '../../../../src/utils';
import { InfestationStatus } from '../../../00-common/infestation-status';
import { PlagueTypes } from '../../plagues/plague-types';
import { Divider } from 'react-native-paper';
import { CardButton } from '../../../00-common';
import { dbHasNoCompanies, waitingForPrescription } from '../../../../src/utils/alert-messages';
import { colors } from '../../../../src/assets';

export function DiagnosisDetails(props: CloseableBottomCardProps) {
	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const companies = useMainSelector((state) => state.backendData.companies)!;
	const affectedArea = getAreaAffectedAreaHA(area)!;

	const allFieldsHavePrecriptions = area.field.every((field) => getLatestPrescriptionPulverizationMethod(field));
	const dbHasCompanies = companies.length > 0;

	function getDisabledMessage() {
		if (!allFieldsHavePrecriptions) return waitingForPrescription;
		return dbHasNoCompanies;
	}

	function getenabledStatus() {
		if (!dbHasCompanies) return false;
		if (!allFieldsHavePrecriptions) return false;
		return true;
	}

	return (
		<View style={styles.mainView}>
			<CardTitle text="Detalhes" titleIcon="info" onClose={props.onClose} />
			<View style={styles.contentView}>
				<InfestationStatus affectedArea={affectedArea} totalArea={getAllFieldsAreaHA(area)} />
				<Divider style={styles.divider} />
				<PlagueTypes area={area} />
				<CardButton
					disabledMessage={getDisabledMessage()}
					enabled={getenabledStatus()}
					text="Orçar Pulverização"
					icon="pulverization"
					iconColor={colors.secondary.green_30}
					customStyle={{ marginVertical: '16rem' }}
					onPress={props.onHirePulverizationButtonPress}
				/>
			</View>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		backgroundColor: 'white',
	},
	divider: {
		marginVertical: '8rem',
	},
	contentView: {
		marginHorizontal: '16rem',
		marginTop: '8rem',
	},
});
