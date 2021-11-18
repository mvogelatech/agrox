import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';

import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';

import { ChoosableFieldCard } from './choosable-field-card-report';

import { ScrollView } from 'react-native-gesture-handler';
import { dispatch, useMainSelector } from '../../redux-things';
import { ClosableHeader } from '../00-common';

import { AgroXScreenProps } from '../navigation-types';
import { Models, PulverizationMethod, PulverizationMethods } from '../../models';
import { getLatestDiagnosis, getLatestPrescriptionPulverizationMethod } from '../../src/utils';
import { asyncCancelableAlert, confirmQuotationLeave, userHasChangedSuggestedMethod } from '../../src/utils/alert-messages';

type ScreenProps = AgroXScreenProps<'MethodSelection'>;

function userHasChanged(initialState: Map<number, PulverizationMethod | undefined>, finalState: Map<number, PulverizationMethod | undefined>) {
	let testVal;
	if (initialState.size !== finalState.size) {
		return true;
	}

	for (const [key, val] of initialState) {
		testVal = finalState.get(key);
		// in cases of an undefined value, make sure the key
		// actually exists on the object so there are no false positives
		if (testVal !== val || (testVal === undefined && !finalState.has(key))) {
			return true;
		}
	}

	return false;
}

export const MethodSelectionReport = asAliveOnlyScreenComponent(({ navigation }: ScreenProps) => {
	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	// const initialState = generateStartingMap(route.params.selectedFields);
	// const [fieldsWithMethods, setFieldsWithMethods] = React.useState(initialState);

	function compare(a: Models.field, b: Models.field) {
		if (getLatestDiagnosis(a)!.affected_area_ha > getLatestDiagnosis(b)!.affected_area_ha) return -1;
		if (getLatestDiagnosis(b)!.affected_area_ha > getLatestDiagnosis(a)!.affected_area_ha) return 1;
		return 0;
	}

	return (
		<View style={{ flex: 1 }}>
			<ClosableHeader
				onClose={() => {
					void confirmQuotationLeave(navigation);
				}}
			/>

			<View style={styles.mainView}>
				<Text style={styles.titleText}>{`Selecione os tipos relatórios que você deseja contratar`}</Text>
				<ScrollView>
					<View style={styles.listView}>
						<ChoosableFieldCard />
					</View>
				</ScrollView>
				<Button
					uppercase={false}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={async () => {
						// if (userHasChanged(initialState, fieldsWithMethods)) {
						// 	const response = await asyncCancelableAlert(userHasChangedSuggestedMethod);
						// 	if (response === 'CONFIRM') {
						// 		// dispatch({ type: 'CHANGE_FIELD_WITH_METHODS', fieldsWithMethods });
						navigation.navigate('FieldSelectionFromServicesReport');
						// 	}
						// } else {
						// 	// dispatch({ type: 'CHANGE_FIELD_WITH_METHODS', fieldsWithMethods });
						// 	navigation.navigate('DateSelection');
						// }
					}}
				>
					Continuar
				</Button>
			</View>
		</View>
	);
});

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		paddingHorizontal: '16rem',
		backgroundColor: 'white',
	},
	titleText: {
		paddingLeft: '8rem',
		paddingVertical: '8rem',
		fontSize: '23rem',
	},

	listView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginHorizontal: '2rem',
	},
	button: {
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		width: '100%',
	},
	subtitle: {
		fontSize: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selected: {
		fontSize: '12rem',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#78849E',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
