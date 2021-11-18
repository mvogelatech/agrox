import React from 'react';
import { View } from 'react-native';
import { createTStyleSheet } from '../../../../src/utils/style';

import { CardTitle } from '../../../00-common/card-title';
import { MainState, useMainSelector } from '../../../../redux-things';
import { CloseableBottomCardProps } from '../closeable-bottom-card-props';
import { General, Prescription, Pulverization } from './infestation-report';

import { TabBar } from './infestation-report/common/tab-bar';
import { displayAlert, defaultNotImplemented, pulverizationQuoteNotAllowed } from '../../../../src/utils/alert-messages';
import { RoleTypeFarmManager, Models } from '../../../../models';

function getBottomComponent(
	card: MainState['interactionData']['infestation']['currentCard'],
	user: Models.user,
	onHirePulverizationButtonPress: () => void,
) {
	const role = user.user_role.find((obj) => obj.role.name === RoleTypeFarmManager);

	if (card === 'General') return <General />;
	if (card === 'Prescription') return <Prescription />;
	if (card === 'Pulverization')
		if (role) {
			return (
				<Pulverization onHirePulverizationButtonPress={onHirePulverizationButtonPress} onWhatsAppButtonPress={() => displayAlert(defaultNotImplemented)} />
			);
		} else {
			return (
				<Pulverization
					onHirePulverizationButtonPress={() => displayAlert(pulverizationQuoteNotAllowed)}
					onWhatsAppButtonPress={() => displayAlert(defaultNotImplemented)}
				/>
			);
		}
}

export function DiagnosisFieldProfile(props: CloseableBottomCardProps) {
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;
	const card = useMainSelector((state) => state.interactionData.infestation.currentCard)!;
	const user = useMainSelector((state) => state.backendData.user)!;

	return (
		<View style={styles.mainView}>
			<CardTitle text={field.name} titleIcon="location" onClose={props.onClose} />
			<TabBar />
			{getBottomComponent(card, user, props.onHirePulverizationButtonPress)}
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		backgroundColor: 'white',
		flexDirection: 'column',
	},
});
