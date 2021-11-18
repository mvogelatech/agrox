import React, { useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Divider, Button } from 'react-native-paper';
import { createTStyleSheet } from '../../../../src/utils/style';

import { dispatch, useMainSelector } from '../../../../redux-things';

import { FieldCard } from '../../../00-common/field-card';
import { CardTitle } from '../../../00-common/card-title';
import { getAreaState, getFieldState, scrollToEndAndBack } from '../../../../src/utils';
import { fieldNotHired, areaNotHired, areaHiredUnavailable, displayAlert, fieldIndexNotAvailable } from '../../../../src/utils/alert-messages';
import { Models } from '../../../../models';
import { isAnyIndexAvailableForArea, isIndexAvailable } from '../../../../src/utils/visiona-indices';
import { useNavigation } from '@react-navigation/native';

export function AllFields() {
	const navigation = useNavigation();

	const flatListRef = useRef<FlatList>(null);

	const tab = useMainSelector((state) => state.interactionData.general.currentTab);
	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;

	const fields = area.field;

	function compare(a: Models.field, b: Models.field) {
		if (a.code > b.code) return 1;
		if (b.code > a.code) return -1;
		return 0;
	}

	return (
		<View style={styles.mainView}>
			{/* <Button
				uppercase={true}
				disabled={false}
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonText}
				onPress={() => {
					// const pulverizationStartDate = startDate.toDate();
					// const pulverizationEndDate = endDate.toDate();
					// dispatch({ type: 'CHANGE_START_DATE', pulverizationStartDate });
					// dispatch({ type: 'CHANGE_END_DATE', pulverizationEndDate });

					// navigation.navigate('QuotationSummary');

					navigation.navigate('MenuService');
				}}
			>
				dev
			</Button> */}
			<CardTitle text="Talhões" titleIcon="location" />

			<View style={styles.listView}>
				<FlatList
					ref={flatListRef}
					horizontal
					data={fields.slice().sort(compare)}
					renderItem={({ item: field }) => (
						<FieldCard
							isElevated
							isDiagnosisMode={tab === 'Diagnosis'}
							customStyle={{ marginTop: '1rem', marginBottom: '28rem' }}
							field={field}
							isIndexNotAvailable={tab === 'Indices' && !isIndexAvailable(field)}
							onFieldPress={() => {
								const fieldState = getFieldState(field);
								dispatch({ type: 'CHANGE_FIELD', field });
								if (tab === 'Diagnosis' && fieldState === 'hired_diagnosis_unavailable') return navigation.navigate('HireDiagnostic');
								if (tab === 'Diagnosis' && fieldState === 'not_hired') return displayAlert(fieldNotHired);
								if (tab === 'Indices' && !isIndexAvailable(field)) return displayAlert(fieldIndexNotAvailable);
								dispatch({ type: 'CHANGE_GENERAL_CARD', card: 'Profile' });
							}}
						/>
					)}
					keyExtractor={(item) => item.id.toString()}
					style={{ flexGrow: 0, alignSelf: 'center' }}
					contentContainerStyle={{ paddingHorizontal: 16 }}
					onLayout={() => scrollToEndAndBack(flatListRef, 'flatlist')}
				/>
			</View>
			<Divider />
			<TouchableOpacity
				style={styles.buttonView}
				onPress={() => {
					const areaState = getAreaState(area);
					const areaIndexAvailable = isAnyIndexAvailableForArea(area);
					if (tab === 'Diagnosis' && areaState === 'not_hired') return displayAlert(areaNotHired);
					if (tab === 'Indices' && !areaIndexAvailable) return displayAlert(fieldIndexNotAvailable);
					dispatch({ type: 'CHANGE_GENERAL_CARD', card: 'Details' });
					if (tab === 'Diagnosis' && areaState === 'hired_diagnosis_unavailable') return displayAlert(areaHiredUnavailable);
				}}
			>
				<Text style={styles.buttonViewText}>Ver Detalhes</Text>
				<MaterialIcons name="keyboard-arrow-up" color="#6C6464" style={styles.buttonViewIcon} />
			</TouchableOpacity>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexDirection: 'column',
		alignItems: 'stretch',
		justifyContent: 'flex-end',
		backgroundColor: 'white',
	},
	listView: {
		height: '130rem',
	},
	buttonView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: '55rem',
		paddingBottom: '8rem',
	},
	buttonViewText: {
		fontWeight: 'normal',
		color: '#6C6464',
		fontSize: '16rem',
	},
	buttonViewIcon: {
		paddingTop: '4rem',
		paddingHorizontal: '8rem',
		fontSize: '20rem',
	},
});
