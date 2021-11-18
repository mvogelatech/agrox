import React from 'react';
import { View } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { createTStyleSheet } from '../../../../../src/utils/style';

import { useMainSelector } from '../../../../../redux-things';
import { getFieldAffectedAreaHA, getLatestDiagnosis, getLatestPrescriptionPulverizationMethod, getPrescriptionStatus } from '../../../../../src/utils';
import { getSemaphoreColor, useThresholds } from '../../../../../src/utils/semaphore';
import { CardButton, RoundIcon } from '../../../../00-common';
import { SuggestedMethod } from './common/suggested-method';
import { Message } from '../../../../00-common/message';
import { PulverizationMethods } from '../../../../../models';
import { pulverizationNotInfested, pulverizationNotAvailable, dbHasNoCompanies } from '../../../../../src/utils/alert-messages';
import { colors } from '../../../../../src/assets';

type PulverizationProps = {
	onHirePulverizationButtonPress: () => void;
	onWhatsAppButtonPress: () => void;
};

export function Pulverization(props: PulverizationProps) {
	const semaphoreThresholds = useThresholds();
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;
	const affectedArea = getFieldAffectedAreaHA(field)!;
	const fieldInfestationPercentage = ((affectedArea / field.area_ha) * 100).toFixed(2);
	const latestDiagnosis = getLatestDiagnosis(field)!;
	const pulverizationMethod = getLatestPrescriptionPulverizationMethod(field);
	const status = getPrescriptionStatus(latestDiagnosis);

	const companies = useMainSelector((state) => state.backendData.companies)!;
	const dbHasCompanies = companies.length > 0;

	if (status === 'not-infested') return <Message {...pulverizationNotInfested} />;
	if (status === 'not-available') return <Message {...pulverizationNotAvailable} />;

	// console.log('aqui', latestDiagnosis.prescription[0].content.recommended_method);
	// function dateDiagnosi(field: Models.field) {

	// 	if (field.crop[0].diagnosis[0]) {
	// 		const now = new Date(); // Data de hoje
	// 		const past = new Date(field.crop[0].diagnosis[0].report_date); // Outra data no passado
	// 		const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
	// 		const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).
	// 		console.log('estou aqui', days);

	// 		if (days <= 30) {
	// 			navigation.navigate('HireDiagnostic');
	// 		}

	// 		if (days > 60) {
	// 			displayAlert(alertDatePrescription);
	// 			navigation.navigate('HireDiagnostic');
	// 		}

	// 		if (days > 30) {
	// 			displayAlert(alertDatePrescription);
	// 			navigation.navigate('HireDiagnostic');
	// 		}
	// 	}
	// }

	return (
		<View style={styles.mainView}>
			<View style={styles.contentView}>
				<View>
					<Text style={styles.header}>MÉTODO{'\n'}SUGERIDO</Text>
					{/* <SuggestedMethod method={pulverizationMethod === null ? null : pulverizationMethod === PulverizationMethods.DRONE ? 'drone' : 'plane'} /> */}
					<SuggestedMethod method={latestDiagnosis.prescription[0].content.recommended_method} />
				</View>

				<View>
					<Text style={styles.header}>ÁREA AFETADA{'\n'}TOTAL (HA)</Text>
					<Text numberOfLines={1} style={styles.contentBig}>
						{affectedArea.toFixed(2)}
					</Text>
				</View>

				<View>
					<Text style={styles.header}>INFESTAÇÃO{'\n'}TOTAL</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<RoundIcon
							isEnabled
							icon="warning"
							color={getSemaphoreColor(Number.parseFloat(fieldInfestationPercentage), semaphoreThresholds)}
							size="16rem"
						/>
						<Divider style={styles.horizontalSpacer} />
						<Text numberOfLines={1} style={styles.contentBig}>
							{fieldInfestationPercentage}%
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.buttonView}>
				<CardButton
					enabled={dbHasCompanies}
					disabledMessage={dbHasNoCompanies}
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
		flexDirection: 'column',
		marginHorizontal: '16rem',
		marginVertical: '16rem',
		backgroundColor: 'white',
	},
	contentView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	header: {
		fontSize: '14rem',
		color: '#78849E',
		fontWeight: '500',
	},
	contentBig: {
		fontSize: '26rem',
	},
	buttonView: {
		width: '100%',
		marginTop: '16rem',
	},
	horizontalSpacer: {
		width: 0,
		height: 0,
		backgroundColor: 'white',
		margin: '2rem',
	},
});
