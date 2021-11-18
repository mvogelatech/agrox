import React from 'react';
import { Linking, View } from 'react-native';
import { createTStyleSheet } from '../../../../../src/utils/style';

import { useMainSelector } from '../../../../../redux-things';
import { getLatestDiagnosis, getPrescriptionStatus } from '../../../../../src/utils';
import { Message } from '../../../../00-common/message';
import { prescriptionNotInfested, prescriptionNotAvailable, displayAlert } from '../../../../../src/utils/alert-messages';
import { PrescriptionTable } from '../../../../00-common/prescription-table';
import { formatWhatsAppURL, WHATSAPP_DEFAULT_NUMBER } from '../../../../drawer-constants';

export function Prescription() {
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;
	const farmName = useMainSelector((state) => state.backendData.user?.many_user_has_many_farm[0].farm.fantasy_name)!;
	const latestDiagnosis = getLatestDiagnosis(field)!;
	const prescription = latestDiagnosis.prescription[0];

	const status = getPrescriptionStatus(latestDiagnosis);
	if (status === 'not-infested') return <Message {...prescriptionNotInfested} />;
	if (status === 'not-available') return <Message {...prescriptionNotAvailable} />;

	async function whatsAppButtonPress() {
		if (prescription.author && prescription.phone_number) {
			const msg = `Olá ${prescription.author} estou precisando de uma ajuda referente ao receituário emitido pelo Sr. para o ${field.name} da fazenda ${farmName}`;
			try {
				const ret = await Linking.openURL(formatWhatsAppURL(msg, prescription.phone_number));
				return ret;
			} catch (error) {
				displayAlert({
					title: `Informação`,
					body: `Não foi possível abrir o WhatsApp, favor entrar em contato pelo telefone: ${WHATSAPP_DEFAULT_NUMBER}`,
					buttonText: 'Ok',
				});
				return error.message;
			}
		}

		displayAlert({
			title: `Informação`,
			body: `Não há um contato associado a este receituário, favor solicitar ajuda usando o botão de 'Ajuda' no menu principal do aplicativo.`,
			buttonText: 'Ok',
		});
	}

	return (
		<View style={styles.mainView}>
			<PrescriptionTable mode="card" prescription={prescription} onWhatsAppButtonPress={whatsAppButtonPress} />
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
});
