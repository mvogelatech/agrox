import React, { useState, useEffect } from 'react';
import { View, Text, Linking, AsyncStorage } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { RadioButton, Card } from 'react-native-paper';

import { ClosableHeader } from '../00-common';
import { AgroXScreenProps } from '../navigation-types';
import { PackageDetails } from './package-details';

import { Models, PulverizationMethods } from '../../models';
import { MainState, dispatch, useMainSelector, useIsOffline } from '../../redux-things';
import { ky } from '../../src/network/ky';
import { Button } from 'react-native-paper';
import { displayAlert, needsToBeOnline, confirmQuotationLeave, displayTimeoutErrorSnackbar, needModal } from '../../src/utils/alert-messages';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { WaitOverlay } from '../00-common/wait-overlay';
import { WHATSAPP_DEFAULT_NUMBER } from '../drawer-constants';

type ScreenProps = AgroXScreenProps<'QuotationSummary'>;

async function postQuotation(newQuotation: MainState['interactionData']['newQuotation'], field: any, areaId: Models.area, checked: string) {
	// const createdQuotation = await ky
	// 	.post('quotation', {
	// 		json: {
	// 			pulverizationStartDate: newQuotation.pulverizationStartDate,
	// 			pulverizationEndDate: newQuotation.pulverizationEndDate,
	// 			fieldsWithMethods: Object.fromEntries(newQuotation.fieldsWithMethods!),
	// 		},
	// 	})
	// 	.json<Models.quotation_package>();
	let plagues = '';
	// getData = async () => {
	try {
		const di = await AsyncStorage.getItem('DI');
		console.log('opa1', di);

		if (di === 'Daninhas Indefinidas') {
			plagues = plagues + ' ' + di;
			console.log('opa', plagues);
		}
		const GA = await AsyncStorage.getItem('GA');
		if (GA === 'Gramíneas Porte Alto') {
			plagues = plagues + ' ' + GA;
			console.log('opa', plagues);
		}
		const GB = await AsyncStorage.getItem('GB');
		if (GB === 'Gramíneas Porte Baixo') {
			plagues = plagues + ' ' + GB;
			console.log('opa', plagues);
		}
		const M = await AsyncStorage.getItem('M');
		if (M === 'Mamona') {
			plagues = plagues + ' ' + M;
			console.log('opa', plagues);
		}
		const OFL = await AsyncStorage.getItem('OFL');
		if (OFL === 'Outras Folhas Largas') {
			plagues = plagues + ' ' + OFL;
			console.log('opa', plagues);
		}
		const T = await AsyncStorage.getItem('T');
		if (T === 'Trepadeiras') {
			plagues = plagues + ' ' + T;
			console.log('opa', plagues);
		}
	} catch (error) {
		console.log(error);
	}
	// };

	const area = [...new Set(field.flatMap((field: any) => field.area_id))].slice().sort(undefined).join(', ');
	const talhao = [...new Set(field.flatMap((field: any) => field.name.split(' ')[1]))].slice().sort(undefined).join(', ');

	// const talhao = [...new Set(newRequest.flatMap((field: any) => field.name.split(' ')[1]))].slice().sort(undefined).join(', ');
	const msg = `"Time Agroexplore, Favor atender as seguintes demandas de contratação de Pulverização." \n\n Área(s): ${area} \n Talhões: ${talhao} \n Daninhas: ${plagues}
	\n Data: ${newQuotation.pulverizationEndDate}`;

	// const areaId = useMainSelector((state) => state.interactionData.general.currentArea);

	try {
		const createdDemand = await ky
			.post('demand', {
				json: {
					id: areaId.id,
					demand: {
						date: newQuotation.pulverizationEndDate,
						daninhas: plagues,
						area: area,
						talhoes: talhao,
						type: checked,
					},
				},
			})
			.json<String>();

		// const ret = await Linking.openURL(`whatsapp://send?text=${msg}&phone=${WHATSAPP_DEFAULT_NUMBER}`);
		return createdDemand;
	} catch (error) {
		console.log(error);
		// displayAlert({
		// 	title: `Informação`,
		// 	body: `Não foi possível abrir o WhatsApp, favor entrar em contato pelo telefone: ${WHATSAPP_DEFAULT_NUMBER}`,
		// 	buttonText: 'Ok',
		// });
	}

	(async () => {
		await AsyncStorage.setItem('OFL', '');
		await AsyncStorage.setItem('DI', '');
		await AsyncStorage.setItem('GB', '');
		await AsyncStorage.setItem('GA', '');
		await AsyncStorage.setItem('M', '');
		await AsyncStorage.setItem('T', '');
	})();
	// dispatch({ type: 'BACKEND_DATA__POSTED_NEW_QUOTATION_PACKAGE', package: createdQuotation });
}

function getFieldsById(id: number, areas: Models.area[]) {
	for (const area of areas) {
		for (const field of area.field) {
			if (field.id === id) return field;
		}
	}
}

export const QuotationSummary = asAliveOnlyScreenComponent(({ navigation }: ScreenProps) => {
	const newQuotation = useMainSelector((state) => state.interactionData.newQuotation);
	const fieldsWithMethods = useMainSelector((state) => state.interactionData.newQuotation.fieldsWithMethods);
	const fromServices = useMainSelector((state) => state.interactionData.general.servicesPulverization);
	const areaId = useMainSelector((state) => state.interactionData.general.currentArea);

	const [checked, setChecked] = React.useState('');

	const areas = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm.area);

	const isOnline = !useIsOffline();

	const [showIndicator, setShowIndicator] = useState(false);
	// console.log('aqui10', teate);

	const planeFields: Models.field[] = [];
	const droneFields: Models.field[] = [];
	const terrestrialFields: Models.field[] = [];
	const manualFields: Models.field[] = [];

	[...fieldsWithMethods!.keys()].forEach((fieldId) => {
		const aux = getFieldsById(fieldId, areas)!;
		if (aux.crop[0].diagnosis.length > 0) {
			if (aux.crop[0].diagnosis[0].prescription.length > 0) {
				aux.crop[0].diagnosis[0].prescription[0].content.recommended_method.forEach((element) => {
					if (element === 1) {
						droneFields.push(getFieldsById(fieldId, areas)!);
					} else if (element === 2) {
						planeFields.push(getFieldsById(fieldId, areas)!);
					} else if (element === 3) {
						manualFields.push(getFieldsById(fieldId, areas)!);
					} else {
						terrestrialFields.push(getFieldsById(fieldId, areas)!);
					}
				});
			}
		}

		// metodFields.push(getFieldsById(fieldId, areas)!);

		// fieldsWithMethods!.get(fieldId) === PulverizationMethods.DRONE
		// 	? droneFields.push(getFieldsById(fieldId, areas)!)
		// 	: planeFields.push(getFieldsById(fieldId, areas)!);
	});

	// useEffect(() => {
	// 	console.log(fieldsWithMethods);
	// }, []);

	return (
		<View style={{ flex: 1 }}>
			{showIndicator ? <WaitOverlay text="Aguarde" /> : undefined}
			<ClosableHeader
				onBackPress={() => {
					navigation.goBack();
				}}
				onClose={() => {
					void confirmQuotationLeave(navigation);
				}}
			/>

			<View style={styles.mainView}>
				<View style={styles.contentView}>
					<Text style={styles.titleText}>{`Selecionar os modais dos quais você deseja orçar pulverização`}</Text>

					{planeFields.length > 0 ? (
						<Card style={styles.card}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RadioButton value="plane" status={checked === 'plane' ? 'checked' : 'unchecked'} onPress={() => setChecked('plane')} />

								<PackageDetails
									method="plane"
									isShowDetailsButton={!fromServices}
									fields={planeFields.map((field) => field.name)}
									onSeeMorePress={() => {
										navigation.navigate('Details', { method: PulverizationMethods.PLANE, fields: planeFields });
									}}
								/>
							</View>
						</Card>
					) : undefined}

					{droneFields.length > 0 ? (
						<Card style={styles.card}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RadioButton value="drone" status={checked === 'drone' ? 'checked' : 'unchecked'} onPress={() => setChecked('drone')} />

								<PackageDetails
									method="drone"
									isShowDetailsButton={!fromServices}
									fields={droneFields.map((field) => field.name)}
									onSeeMorePress={() => {
										navigation.navigate('Details', { method: PulverizationMethods.DRONE, fields: droneFields });
									}}
								/>
							</View>
						</Card>
					) : undefined}

					{terrestrialFields.length > 0 ? (
						<Card style={styles.card}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RadioButton value="tractor" status={checked === 'tractor' ? 'checked' : 'unchecked'} onPress={() => displayAlert(needModal)} />

								<PackageDetails
									method="tractor"
									isShowDetailsButton={!fromServices}
									fields={terrestrialFields.map((field) => field.name)}
									onSeeMorePress={() => {
										navigation.navigate('Details', { method: PulverizationMethods.TRACTOR, fields: terrestrialFields });
									}}
								/>
							</View>
						</Card>
					) : undefined}

					{manualFields.length > 0 ? (
						<Card style={styles.card}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RadioButton value="tractor" status={checked === 'tractor' ? 'checked' : 'unchecked'} onPress={() => displayAlert(needModal)} />

								<PackageDetails
									method="manual"
									isShowDetailsButton={!fromServices}
									fields={manualFields.map((field) => field.name)}
									onSeeMorePress={() => {
										navigation.navigate('Details', { method: PulverizationMethods.NOT_AVAILABLE, fields: manualFields });
									}}
								/>
							</View>
						</Card>
					) : undefined}
				</View>

				<Button
					disabled={checked ? false : true}
					uppercase={false}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={async () => {
						if (isOnline) {
							setShowIndicator(true);

							try {
								if (checked === 'drone') {
									await postQuotation(newQuotation, droneFields, areaId, checked);
									navigation.navigate('FeedbackQuotation');
								} else if (checked === 'plane') {
									await postQuotation(newQuotation, planeFields, areaId, checked);
									navigation.navigate('FeedbackQuotation');
								} else {
									await postQuotation(newQuotation, terrestrialFields, areaId, checked);
									navigation.navigate('FeedbackQuotation');
								}
							} catch (error) {
								setShowIndicator(false);
								displayTimeoutErrorSnackbar(error, 'Post Quotation');
							}
						} else {
							displayAlert(needsToBeOnline);
						}
					}}
				>
					Orçar Pulverização
				</Button>
			</View>
		</View>
	);
});

const styles = createTStyleSheet({
	card: {
		marginTop: '10rem',
		paddingTop: '8rem',
		paddingBottom: '8rem',
		paddingHorizontal: '5rem',
		elevation: 4,
		borderRadius: '16rem',
	},
	mainView: {
		flex: 1,
		backgroundColor: 'white',
		paddingHorizontal: '16rem',
		justifyContent: 'space-between',
	},
	titleText: {
		paddingLeft: '8rem',
		paddingVertical: '8rem',
		fontSize: '23rem',
	},
	contentView: {},
	button: {
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		width: '100%',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
