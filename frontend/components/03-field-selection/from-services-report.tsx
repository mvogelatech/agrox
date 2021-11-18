import React, { useCallback } from 'react';
import { View, Text, Linking, AsyncStorage } from 'react-native';
import { Button, Divider, Card } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { MaterialIcons } from '@expo/vector-icons';

import { useBackButton } from '../../src/custom-hooks/use-back-button';
import { ky } from '../../src/network/ky';

import { SelectableFieldCard } from './selectable-field-card';

import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { dispatch, useMainSelector } from '../../redux-things';
import { Models, PulverizationMethod, PulverizationMethods } from '../../models';
import { ClosableHeader, Accordion, CustomCheckbox } from '../00-common';

import { AgroXScreenProps } from '../navigation-types';
import { confirmQuotationLeave } from '../../src/utils/alert-messages';
import { asFocusedOnlyComponent } from '../../src/utils/smart-lifecycle-components';
import { WHATSAPP_DEFAULT_NUMBER } from '../drawer-constants';
import { displayAlert } from '../../src/utils/alert-messages';
import { FileSystemUploadType } from 'expo-file-system';

type ScreenProps = AgroXScreenProps<'FieldSelectionFromServices'>;

async function postQuotation(fields: any, areaId: Models.area) {
	let areas = '';
	let talhao = '';
	for (const field of fields) {
		console.log('field', field.id);
		areas = areas + ', ' + field.area_id;
		talhao = talhao + ', ' + field.name;
		// 	fieldsWithMethods.set(field.id, PulverizationMethods.PLANE);
	}

	console.log('field', talhao);

	let reports = '';
	try {
		const AF = await AsyncStorage.getItem('AF');
		console.log('opa1', AF);

		if (AF === 'Análise de Falhas') {
			reports = reports + ' ' + AF;
			console.log('opa', reports);
		}
		const PP = await AsyncStorage.getItem('PP');
		if (PP === 'Potencial de Pisoteio') {
			reports = reports + ' ' + PP;
			console.log('opa', reports);
		}
		const LP = await AsyncStorage.getItem('LP');
		if (LP === 'Linhas de Plantio') {
			reports = reports + ' ' + LP;
			console.log('opa', reports);
		}
		const NDVI = await AsyncStorage.getItem('NDVI');
		if (NDVI === 'NDVI Drones') {
			reports = reports + ' ' + NDVI;
			console.log('opa', reports);
		}
	} catch (error) {
		console.log(error);
	}
	const msg = `"Time Agroexplore, Favor atender as seguintes demandas de contratação de Relatório." \n\n Área(s): ${areas} \n Talhões: ${talhao}\n Relatório(s): ${reports}`;
	try {
		const createdDemand = await ky
			.post('demand', {
				json: {
					id: areaId.id,
					demand: {
						reportss: reports,
						area: areas,
						talhoes: talhao,
						type: 'contratação de Relatório',
						date: new Date(),
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

export const FieldSelectionFromServicesReport = asFocusedOnlyComponent(({ navigation }: ScreenProps) => {
	const [checkedFields, setCheckedFields] = React.useState(new Set<Models.field>());

	const [expandedAreas, setExpandedAreas] = React.useState(new Set<Models.area>());

	const areas = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm.area)!;
	const fields = areas.flatMap((area) => area.field);
	const fieldsWithMethods = new Map<number, PulverizationMethod>();
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;
	const areac = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const areaId = useMainSelector((state) => state.interactionData.general.currentArea);

	checkedFields.add(field);
	expandedAreas.add(areac);

	const onClose = useCallback(() => {
		setCheckedFields(new Set<Models.field>());
	}, []);

	useBackButton(() => {
		onClose();
		return 'PROCEED';
	}, [onClose]);

	function compare(a, b) {
		if (a.code < b.code) return -1;
		if (a.code > b.code) return 1;
		return 0;
	}

	function areaFieldsList(area: Models.area) {
		area.field.sort(compare);
		return (
			<View style={styles.listView}>
				{area.field.map((field) => (
					<SelectableFieldCard
						key={field.id.toString()}
						isSelected={checkedFields.has(field)}
						field={field}
						isDiagnosisMode={false}
						onPress={() => {
							setCheckedFields((checkedFields) => {
								if (checkedFields.has(field)) checkedFields.delete(field);
								else checkedFields.add(field);
								return new Set(checkedFields);
							});
						}}
					/>
				))}
			</View>
		);
	}

	function countSelectedFields(area: Models.area) {
		let counter = 0;
		for (const field of area.field) {
			if (checkedFields.has(field)) counter++;
		}

		return counter;
	}

	type AreaAccordionProps = {
		area: Models.area;
		isCurrentAreaAllSelected: boolean;
	};

	function AreaAccordion(props: AreaAccordionProps) {
		const { area, isCurrentAreaAllSelected: currentAreaAllSelected } = props;
		return (
			<Accordion
				key={area.id.toString()}
				isExpanded={expandedAreas.has(area)}
				title={area.name}
				titleRight={
					<View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Text style={styles.subtitle}>{`${area.field.length} TALHÕES`}</Text>
						<Text style={styles.selected}>{countSelectedFields(area)} Selecionados</Text>
					</View>
				}
				divider={<Divider style={{ width: '93%' }} />}
				onPress={() => {
					setExpandedAreas((expandedAreas) => {
						if (expandedAreas.has(area)) {
							console.log('kjkjkjkjkj', expandedAreas);
							expandedAreas.delete(areac);

							expandedAreas.delete(area);
						} else expandedAreas.add(area);
						return new Set(expandedAreas);
					});
				}}
			>
				<View>
					<CustomCheckbox
						title="Todos os talhões desta área"
						status={currentAreaAllSelected ? 'checked' : 'unchecked'}
						customStyle={{ marginVertical: '15rem' }}
						onPress={() => {
							setCheckedFields((checkedFields) => {
								if (currentAreaAllSelected)
									for (const field of area.field) {
										checkedFields.delete(field);
									}
								else {
									for (const field of area.field) {
										checkedFields.add(field);
									}
								}

								return new Set(checkedFields);
							});
						}}
					/>

					{areaFieldsList(area)}
				</View>
			</Accordion>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<ClosableHeader
				onClose={() => {
					onClose();
					void confirmQuotationLeave(navigation);
				}}
			/>
			<View style={styles.mainView}>
				<Text style={styles.titleText}>{'Quais talhões você\nquer contratar?'}</Text>
				<View style={styles.checkboxView}>
					<CustomCheckbox
						title={
							<View style={{ alignItems: 'flex-start' }}>
								<Text style={styles.subtitle}>Todos os talhões</Text>
								<Text style={styles.selected}>{checkedFields.size} Selecionados</Text>
							</View>
						}
						status={fields.length === checkedFields.size ? 'checked' : 'unchecked'}
						onPress={() => {
							setCheckedFields(fields.length === checkedFields.size ? new Set() : new Set(fields));
						}}
					/>
					<TouchableOpacity
						activeOpacity={0.5}
						style={styles.expandButton}
						onPress={() => {
							setExpandedAreas(areas.length === expandedAreas.size ? new Set() : new Set(areas));
						}}
					>
						<Text style={{ fontWeight: 'bold', color: '#327387' }}>{areas.length === expandedAreas.size ? 'Recolher' : 'Expandir'} áreas</Text>
					</TouchableOpacity>
				</View>
				{/* <Card style={styles.card}>
					<TouchableOpacity activeOpacity={0.5} style={styles.touchable}>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
							<MaterialIcons name="keyboard-arrow-down" color="#6C6464" style={styles.icon} /> */}
				<ScrollView style={styles.scrollView}>
					<View>
						{/* <Text numberOfLines={1} style={styles.title}>
									aviao
								</Text> */}
						{true ? (
							<ScrollView style={styles.scrollView}>
								{areas.map((area) => {
									const currentAreaAllSelected = area.field.every((field) => checkedFields.has(field));
									return <AreaAccordion key={area.id.toString()} area={area} isCurrentAreaAllSelected={currentAreaAllSelected} />;
								})}
							</ScrollView>
						) : undefined}
					</View>
				</ScrollView>

				{/* </View> */}
				{/* </TouchableOpacity>
				</Card> */}

				<Button
					uppercase={false}
					disabled={checkedFields.size === 0}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={async () => {
						// for (const field of checkedFields) {
						// 	fieldsWithMethods.set(field.id, PulverizationMethods.PLANE);
						// }

						// dispatch({ type: 'SET_SERVICES_PULVERIZATION', state: true });
						// dispatch({ type: 'CHANGE_FIELD_WITH_METHODS', fieldsWithMethods });
						// console.log('opanjbkj', checkedFields);
						await postQuotation(checkedFields, areaId);

						navigation.navigate('FeedbackQuotationReport');
					}}
				>
					Contratar
				</Button>
			</View>
		</View>
	);
});

const styles = createTStyleSheet({
	card: {
		elevation: '4rem',
		marginHorizontal: '2rem',
		marginTop: '2rem',
		marginBottom: '16rem',
		borderRadius: '10rem',
	},
	touchable: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: '16rem',
		paddingVertical: '16rem',
	},
	mainView: {
		flex: 1,
		backgroundColor: 'white',
		paddingHorizontal: '14rem',
	},
	checkboxView: {
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: '20rem',
		flexDirection: 'row',
	},
	listView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	scrollView: {
		paddingVertical: '8rem',
	},
	expandButton: {
		padding: '15rem',
	},
	button: {
		marginVertical: '24rem',
		marginHorizontal: '11rem',
		height: '45rem',
		justifyContent: 'center',
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
	titleText: {
		paddingLeft: '8rem',
		fontSize: '23rem',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
