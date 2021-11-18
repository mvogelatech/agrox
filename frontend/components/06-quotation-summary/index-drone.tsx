import React, { useState } from 'react';
import { View, Text, Linking, AsyncStorage } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';

import { ClosableHeader } from '../00-common';
import { AgroXScreenProps } from '../navigation-types';
import { PackageDetails } from './package-details';

import { Models, PulverizationMethods } from '../../models';
import { MainState, dispatch, useMainSelector, useIsOffline } from '../../redux-things';
import { ky } from '../../src/network/ky';
import { Button } from 'react-native-paper';
import { displayAlert, needsToBeOnline, confirmQuotationLeave, displayTimeoutErrorSnackbar } from '../../src/utils/alert-messages';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { WaitOverlay } from '../00-common/wait-overlay';
import { WHATSAPP_DEFAULT_NUMBER } from '../drawer-constants';

type ScreenProps = AgroXScreenProps<'QuotationSummary'>;

async function postQuotation(newQuotation: MainState['interactionData']['newQuotation'], field: any) {
	// const createdQuotation = await ky
	// 	.post('quotation', {
	// 		json: {
	// 			pulverizationStartDate: newQuotation.pulverizationStartDate,
	// 			pulverizationEndDate: newQuotation.pulverizationEndDate,
	// 			fieldsWithMethods: Object.fromEntries(newQuotation.fieldsWithMethods!),
	// 		},
	// 	})
	// 	.json<Models.quotation_package>();
	const area = [...new Set(field.flatMap((field: any) => field.area_id))].slice().sort(undefined).join(', ');
	const talhao = [...new Set(field.flatMap((field: any) => field.name.split(' ')[1]))].slice().sort(undefined).join(', ');

	console.log('opa', talhao);
	let areaId;

	let text = area;
	if (text.search(',') !== -1) {
		areaId = text.split(',')[0];
	} else {
		areaId = text;
	}
	let plagues = '';
	// getData = async () => {
	try {
		const di = await AsyncStorage.getItem('Herbicidas');
		if (di === 'Herbicidas') {
			plagues = plagues + ' ' + di;
			console.log('opa', plagues);
		}
		const GA = await AsyncStorage.getItem('Fungicidas');
		if (GA === 'Fungicidas') {
			plagues = plagues + ' ' + GA;
			console.log('opa', plagues);
		}
		const GB = await AsyncStorage.getItem('Inseticidas');
		if (GB === 'Inseticidas') {
			plagues = plagues + ' ' + GB;
			console.log('opa', plagues);
		}
		const M = await AsyncStorage.getItem('Maturador');
		if (M === 'Maturador') {
			plagues = plagues + ' ' + M;
			console.log('opa', plagues);
		}
		const OFL = await AsyncStorage.getItem('Fertilizantes');
		if (OFL === 'Fertilizantes') {
			plagues = plagues + ' ' + OFL;
			console.log('opa', plagues);
		}
		const T = await AsyncStorage.getItem('Outros');
		if (T === 'Outros') {
			plagues = plagues + ' ' + T;
			console.log('opa', plagues);
		}
	} catch (error) {
		console.log(error);
	}
	(async () => {
		await AsyncStorage.setItem('Herbicidas', '');
		await AsyncStorage.setItem('Fungicidas', '');
		await AsyncStorage.setItem('Inseticidas', '');
		await AsyncStorage.setItem('Maturador', '');
		await AsyncStorage.setItem('Fertilizantes', '');
		await AsyncStorage.setItem('Outros', '');
	})();
	// const talhao = [...new Set(newRequest.flatMap((field: any) => field.name.split(' ')[1]))].slice().sort(undefined).join(', ');
	// const msg = `"Time Agroexplore, Favor atender as seguintes demandas de contratação de Pulverização." \n\n Área(s): ${area} \n Talhões: ${talhao}`;
	try {
		const createdDemand = await ky
			.post('demand', {
				json: {
					id: parseInt(areaId),
					demand: {
						aplication: plagues,
						type: 'Drone Geral',
						date: newQuotation.pulverizationEndDate,
						area: area,
						talhoes: talhao,
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

	// dispatch({ type: 'BACKEND_DATA__POSTED_NEW_QUOTATION_PACKAGE', package: createdQuotation });
}

function getFieldsById(id: number, areas: Models.area[]) {
	for (const area of areas) {
		for (const field of area.field) {
			if (field.id === id) return field;
		}
	}
}

export const QuotationSummaryDrone = asAliveOnlyScreenComponent(({ navigation }: ScreenProps) => {
	const newQuotation = useMainSelector((state) => state.interactionData.newQuotation);
	const fieldsWithMethods = useMainSelector((state) => state.interactionData.newQuotation.fieldsWithMethods);
	const fromServices = useMainSelector((state) => state.interactionData.general.servicesPulverization);

	const areas = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm.area);

	const isOnline = !useIsOffline();

	const [showIndicator, setShowIndicator] = useState(false);

	const areaId = useMainSelector((state) => state.interactionData.general.currentArea);

	const planeFields: Models.field[] = [];
	const droneFields: Models.field[] = [];
	[...fieldsWithMethods!.keys()].forEach((fieldId) =>
		fieldsWithMethods!.get(fieldId) === PulverizationMethods.DRONE
			? droneFields.push(getFieldsById(fieldId, areas)!)
			: planeFields.push(getFieldsById(fieldId, areas)!),
	);

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
					<Text style={styles.titleText}>{`Veja o resumo do seu\norçamento de pulverização`}</Text>
					{/* {planeFields.length > 0 ? (
						<PackageDetails
							method="plane"
							isShowDetailsButton={!fromServices}
							fields={planeFields.map((field) => field.name)}
							onSeeMorePress={() => {
								navigation.navigate('Details', { method: PulverizationMethods.PLANE, fields: planeFields });
							}}
						/>
					) : undefined} */}

					{/* {droneFields.length > 0 ? ( */}
					<PackageDetails
						method="drone"
						isShowDetailsButton={!fromServices}
						fields={droneFields.map((field) => field.name)}
						onSeeMorePress={() => {
							navigation.navigate('Details', { method: PulverizationMethods.DRONE, fields: droneFields });
						}}
					/>
					{/* ) : undefined} */}
				</View>

				<Button
					uppercase={false}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={async () => {
						if (isOnline) {
							setShowIndicator(true);
							try {
								await postQuotation(newQuotation, droneFields);
								navigation.navigate('FeedbackQuotation');
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
