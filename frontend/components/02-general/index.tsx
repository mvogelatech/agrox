import React from 'react';

import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';

import { useBackButton } from '../../src/custom-hooks/use-back-button';

import { MainState, dispatch, useMainSelector } from '../../redux-things';

import { AgroXScreenProps } from '../navigation-types';

import { TabButton } from '../00-common/tab-button';
import { Map } from './map/map';
import { AllFields, DiagnosisFieldProfile, DiagnosisDetails, OverviewFieldProfile, OverviewDetails } from './bottom-cards';

import { DrawerActions } from '@react-navigation/native';
import { DefaultHeader } from '../00-common';
import { getLatestDiagnosis } from '../../src/utils';
import { fieldHiredUnavailable, displayAlert, pulverizationQuoteNotAllowed } from '../../src/utils/alert-messages';
import { asFocusedOnlyComponent } from '../../src/utils/smart-lifecycle-components';
import { RoleTypeFarmManager, Models } from '../../models';
import { IndicesSelection } from './bottom-cards/indices-overview/indices-selection';
import { IndicesSelectionArea } from './bottom-cards/indices-overview/indices-selection-area';

type ScreenProps = AgroXScreenProps<'General'>;

function Tabs() {
	const field = useMainSelector((state) => state.interactionData.general.currentField);
	const tab = useMainSelector((state) => state.interactionData.general.currentTab);

	return (
		<View style={styles.default}>
			<TabButton
				isSelected={tab === 'Overview'}
				icon="gradient"
				text="VISÃO GERAL"
				onPress={() => {
					dispatch({ type: 'CHANGE_GENERAL_TAB', tab: 'Overview' });
				}}
			/>
			<Divider style={styles.divider} />
			<TabButton
				isSelected={tab === 'Diagnosis'}
				icon="equalizer"
				text="DIAGNÓSTICOS"
				onPress={() => {
					if (field && !getLatestDiagnosis(field)) displayAlert(fieldHiredUnavailable);
					else {
						dispatch({ type: 'CHANGE_GENERAL_TAB', tab: 'Diagnosis' });
					}
				}}
			/>
			<Divider style={styles.divider} />
			<TabButton
				isSelected={tab === 'Indices'}
				icon="wifi-tethering"
				text="ÍNDICES"
				onPress={() => {
					dispatch({ type: 'CHANGE_GENERAL_TAB', tab: 'Indices' });
				}}
			/>
		</View>
	);
}

function getGeneralBottomComponent(
	card: MainState['interactionData']['general']['currentCard'],
	tab: MainState['interactionData']['general']['currentTab'],
	user: Models.user,
	navigation: ScreenProps['navigation'],
) {
	const role = user.user_role.find((obj) => obj.role.name === RoleTypeFarmManager);

	if (card === 'Fields') {
		return <AllFields />;
	}

	let BottomComponent;
	if (card === 'Details') {
		switch (tab) {
			case 'Diagnosis':
				BottomComponent = DiagnosisDetails;
				break;
			case 'Indices':
				BottomComponent = IndicesSelectionArea;
				break;
			default:
				// Overview
				BottomComponent = OverviewDetails;
		}
	} else {
		switch (tab) {
			case 'Diagnosis':
				BottomComponent = DiagnosisFieldProfile;
				break;
			case 'Indices':
				BottomComponent = IndicesSelection;
				break;
			default:
				// Overview
				BottomComponent = OverviewFieldProfile;
		}
	}

	let pulverizationQuoteCallback;
	if (role) {
		pulverizationQuoteCallback = () => navigation.navigate('FieldSelectionFromGeneral');
	} else {
		pulverizationQuoteCallback = () => displayAlert(pulverizationQuoteNotAllowed);
	}

	return (
		<BottomComponent
			onClose={() => {
				dispatch({ type: 'CHANGE_GENERAL_CARD', card: 'Fields' });
				dispatch({ type: 'CHANGE_FIELD', field: undefined });
				dispatch({ type: 'CHANGE_INFESTATION_CARD', card: 'General' });
				dispatch({ type: 'CHANGE_INDICES_DATE', indexDate: undefined });
			}}
			onHirePulverizationButtonPress={pulverizationQuoteCallback}
		/>
	);
}

export const General = asFocusedOnlyComponent(({ navigation }: ScreenProps) => {
	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const card = useMainSelector((state) => state.interactionData.general.currentCard)!;
	const tab = useMainSelector((state) => state.interactionData.general.currentTab)!;
	const user = useMainSelector((state) => state.backendData.user)!;

	useBackButton(() => {
		if (card === 'Profile' || card === 'Details') {
			dispatch({ type: 'CHANGE_GENERAL_CARD', card: 'Fields' });
			dispatch({ type: 'CHANGE_FIELD', field: undefined });
			dispatch({ type: 'CHANGE_INFESTATION_CARD', card: 'General' });
			dispatch({ type: 'CHANGE_INDICES_DATE', indexDate: undefined });
			return 'CANCEL';
		}

		return 'PROCEED';
	}, [card]);

	return (
		<View style={{ flex: 1 }}>
			<DefaultHeader
				title={area.name}
				onDrawerPress={() => navigation.dispatch(DrawerActions.openDrawer())}
				onNotificationPress={() => navigation.navigate('Notifications')}
			/>
			<Tabs />
			<Map />
			{getGeneralBottomComponent(card, tab, user, navigation)}
		</View>
	);
});

const styles = createTStyleSheet({
	default: {
		backgroundColor: '#fff',
		flexDirection: 'row',
	},
	divider: {
		width: '1rem',
		height: '50rem',
		backgroundColor: 'black',
	},
});
