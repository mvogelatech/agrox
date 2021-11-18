import React, { useEffect } from 'react';
import { View, Text, FlatList, AsyncStorage } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { RoundIcon } from '../00-common';
import { AgroXScreenProps } from '../navigation-types';
import { getLatestDiagnosis, getPrescriptionStatus } from '../../src/utils';

import { Models, PulverizationMethods } from '../../models';
import { prescriptionNotInfested, prescriptionNotAvailable, displayAlert, defaultNotImplemented } from '../../src/utils/alert-messages';
import { DetailsFieldCard } from './details-field-card';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { Message } from '../00-common/message';
import { PrescriptionTable } from '../00-common/prescription-table';
import { FAB } from 'react-native-paper';
import Constants from 'expo-constants';
import { colors } from '../../src/assets';

function compare(a: Models.field, b: Models.field) {
	if (getLatestDiagnosis(a)!.affected_area_ha > getLatestDiagnosis(b)!.affected_area_ha) return -1;
	if (getLatestDiagnosis(b)!.affected_area_ha > getLatestDiagnosis(a)!.affected_area_ha) return 1;
	return 0;
}

type ScreenProps = AgroXScreenProps<'Details'>;

export const Details = asAliveOnlyScreenComponent(({ navigation, route }: ScreenProps) => {
	const { fields } = route.params;
	const [selectedField, setSelectedField] = React.useState(fields.slice().sort(compare)[0]);
	const pulverizationMethod = route.params.method;
	const latestDiagnosis = getLatestDiagnosis(selectedField)!;
	const prescription = latestDiagnosis.prescription[0];
	const status = getPrescriptionStatus(latestDiagnosis);

	useEffect(() => {
		(async () => {
			// await AsyncStorage.getItem('method');
			console.log(await AsyncStorage.getItem('method'));
		})();
	}, []);

	return (
		<View style={styles.mainView}>
			{/* eslint-disable-next-line  react/jsx-pascal-case */}
			<FAB
				small
				style={styles.fab}
				color="#6F6F6F"
				icon="close"
				onPress={() => {
					navigation.goBack();
				}}
			/>

			<View style={styles.titleView}>
				<RoundIcon
					isEnabled
					icon={
						pulverizationMethod === PulverizationMethods.DRONE
							? 'drone'
							: pulverizationMethod === PulverizationMethods.PLANE
							? 'plane'
							: pulverizationMethod === PulverizationMethods.TRACTOR
							? 'tractor'
							: 'manual'
					}
					color={colors.lightBlue}
					size="50rem"
				/>
				<Text style={styles.recommendedText}>MÉTODO SELECIONADO</Text>
				<Text style={styles.methodText}>
					Pulverização{' '}
					{pulverizationMethod === PulverizationMethods.DRONE
						? 'por Drone'
						: pulverizationMethod === PulverizationMethods.PLANE
						? 'por Avião'
						: pulverizationMethod === PulverizationMethods.TRACTOR
						? 'Terrestre'
						: 'Terrestre Manual'}
				</Text>
			</View>

			<View style={styles.fieldsView}>
				<Text style={styles.fieldsText}>TALHÕES</Text>
				<FlatList
					persistentScrollbar
					horizontal
					showsHorizontalScrollIndicator
					data={fields}
					renderItem={({ item: field }) => (
						<DetailsFieldCard field={field} isSelected={field === selectedField} onFieldPress={() => setSelectedField(field)} />
					)}
					keyExtractor={(item) => item.id.toString()}
					style={{ flexGrow: 0, alignSelf: 'center' }}
				/>
			</View>
			<Text style={styles.selectedFieldText}>RECEITUÁRIO DO TALHÃO {selectedField.name.split(' ')[1]}</Text>

			{status === 'not-infested' ? (
				<Message {...prescriptionNotInfested} />
			) : status === 'not-available' ? (
				<Message {...prescriptionNotAvailable} />
			) : (
				<View style={{ flex: 1 }}>
					<PrescriptionTable mode="details" prescription={prescription} onWhatsAppButtonPress={() => displayAlert(defaultNotImplemented)} />
				</View>
			)}
		</View>
	);
});

const styles = createTStyleSheet({
	fab: {
		position: 'absolute',
		top: Constants.statusBarHeight,
		left: 0,
		backgroundColor: 'transparent',
		elevation: 0,
		paddingLeft: '8rem',
	},
	mainView: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'white',
		justifyContent: 'space-between',
		paddingBottom: '8rem',
	},
	titleView: {
		paddingTop: Constants.statusBarHeight,
		paddingHorizontal: '24rem',
		backgroundColor: 'white',
	},
	recommendedText: {
		fontSize: '14rem',
		textAlign: 'center',
		color: '#78849E',
	},
	methodText: {
		fontSize: '18rem',
		textAlign: 'center',
	},
	fieldsText: {
		// marginTop: '8rem',
		marginBottom: '16rem',

		fontSize: '14rem',
		textAlign: 'center',
		color: '#78849E',
	},
	selectedFieldText: {
		fontWeight: 'bold',
		color: '#78849E',
		textAlign: 'center',
		marginVertical: '12rem',
	},
	fieldsView: {
		marginTop: '8rem',
	},
	contentView: {
		flexDirection: 'row',
		paddingTop: '16rem',
	},

	header: {
		fontSize: '14rem',
		color: '#78849E',
		fontWeight: '500',
	},

	buttonView: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		marginTop: '32rem',
		marginBottom: '16rem',
		width: '100%',
	},
});
