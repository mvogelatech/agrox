import React, { useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';

import { useBackButton } from '../../src/custom-hooks/use-back-button';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';

import { SelectableFieldCard } from './selectable-field-card';

import { ScrollView } from 'react-native-gesture-handler';
import { useMainSelector } from '../../redux-things';
import { ClosableHeader, CustomCheckbox, Accordion } from '../00-common';

import { AgroXScreenProps } from '../navigation-types';
import { Models, PulverizationMethods } from '../../models';
// import { getLatestDiagnosis, getLatestPrescriptionPulverizationMethod } from '../../src/utils';
import { getLatestPrescriptionPulverizationMethod } from '../../src/utils';
import { confirmQuotationLeave } from '../../src/utils/alert-messages';
import { asyncCancelableAlert } from '../../src/utils/alert-messages';

type ScreenProps = AgroXScreenProps<'FieldSelectionFromGeneral'>;

export const FieldSelectionFromGeneral = asAliveOnlyScreenComponent(({ navigation }: ScreenProps) => {
	const [checkedFields, setCheckedFields] = React.useState(new Set<Models.field>());
	const [checkedFieldsDrone, setCheckedFieldsDrone] = React.useState(new Set<Models.field>());
	const [checkedFieldsAviao, setCheckedFieldsAviao] = React.useState(new Set<Models.field>());
	const [checkedFieldsTerrestre, setCheckedFieldsTerrestre] = React.useState(new Set<Models.field>());
	const [expandedAreas, setExpandedAreas] = React.useState(new Set<Models.area>());
	const [expandedDrone, setExpandedDrone] = React.useState(new Set<string>());
	const [expandedAviao, setExpandedAviao] = React.useState(new Set<string>());
	const [expandedTerrestre, setExpandedTerrestre] = React.useState(new Set<string>());
	const areas = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm.area)!;

	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const fields: Models.field[] = [];
	for (const field of area.field) {
		if (getLatestPrescriptionPulverizationMethod(field) !== PulverizationMethods.NOT_AVAILABLE) fields.push(field);
	}

	for (const areaField of areas) {
		for (const field of areaField.field) {
			if (field.crop[0].diagnosis[0]) {
				if (new Date(field.crop[0].diagnosis[0].report_date) < new Date(field.crop[0].diagnosis[0].prescription[0].date)) {
					checkedFields.add(field);
				}
			}
		}
	}

	const onClose = useCallback(() => {
		setCheckedFields(new Set<Models.field>());
	}, []);

	useBackButton(() => {
		onClose();
		return 'PROCEED';
	}, [onClose]);

	// function compare(a: Models.field, b: Models.field) {
	// 	if (getLatestDiagnosis(a)!.affected_area_ha > getLatestDiagnosis(b)!.affected_area_ha) return -1;
	// 	if (getLatestDiagnosis(b)!.affected_area_ha > getLatestDiagnosis(a)!.affected_area_ha) return 1;
	// 	return 0;
	// }

	function countSelectedFields(area: Models.area) {
		let counter = 0;
		for (const field of area.field) {
			if (checkedFields.has(field)) counter++;
		}

		return counter;
	}

	function countSelectedFieldsDrone(area: Models.area) {
		let counter = 0;
		for (const field of area.field) {
			if (checkedFieldsDrone.has(field)) counter++;
		}

		return counter;
	}

	function countSelectedFieldsAviao(area: Models.area) {
		let counter = 0;
		for (const field of area.field) {
			if (checkedFieldsAviao.has(field)) counter++;
		}

		return counter;
	}

	function countSelectedFieldsTerrestre(area: Models.area) {
		let counter = 0;
		for (const field of area.field) {
			if (checkedFieldsTerrestre.has(field)) counter++;
		}

		return counter;
	}

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

	type AreaAccordionProps = {
		area: Models.area;
		isCurrentAreaAllSelected: boolean;
		control: number;
	};

	function AreaAccordion(props: AreaAccordionProps) {
		const { area, isCurrentAreaAllSelected: currentAreaAllSelected, control } = props;
		return (
			<Accordion
				key={area.id.toString()}
				isExpanded={expandedAreas.has(area)}
				title={area.name}
				titleRight={
					<View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Text style={styles.subtitle}>{`${area.field.length} TALHÕES`}</Text>
						{/* <Text style={styles.selected}>
							{control === 1 ? countSelectedFieldsDrone(area) : control === 2 ? countSelectedFieldsAviao(area) : countSelectedFieldsTerrestre(area)}{' '}
							Selecionados
						</Text> */}
					</View>
				}
				divider={<Divider style={{ width: '93%' }} />}
				onPress={() => {
					setExpandedAreas((expandedAreas) => {
						if (expandedAreas.has(area)) expandedAreas.delete(area);
						else expandedAreas.add(area);
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
										console.log(control);
										checkedFields.delete(field);
										if (control === 1) {
											setCheckedFieldsDrone((checkedFieldsDrone) => {
												// checkedFieldsDrone.delete(field);
												return new Set(checkedFieldsDrone);
											});
										} else if (control === 2) {
											setCheckedFieldsAviao((checkedFieldsAviao) => {
												// checkedFieldsAviao.delete(field);
												return new Set(checkedFieldsAviao);
											});
										} else {
											setCheckedFieldsTerrestre((checkedFieldsTerrestre) => {
												checkedFieldsTerrestre.delete(field);
												return new Set(checkedFieldsTerrestre);
											});
										}
									}
								else {
									for (const field of area.field) {
										checkedFields.add(field);
										if (control === 1) {
											setCheckedFieldsDrone((checkedFieldsDrone) => {
												checkedFieldsDrone.add(field);
												return new Set(checkedFieldsDrone);
											});
										} else if (control === 2) {
											setCheckedFieldsAviao((checkedFieldsAviao) => {
												checkedFieldsAviao.add(field);
												return new Set(checkedFieldsAviao);
											});
										} else {
											setCheckedFieldsTerrestre((checkedFieldsTerrestre) => {
												checkedFieldsTerrestre.add(field);
												return new Set(checkedFieldsTerrestre);
											});
										}
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
				<Text style={styles.titleText}>{`Quais talhões você\nquer pulverizar?`}</Text>

				<ScrollView style={styles.scrollView}>
					<ScrollView style={styles.scrollView}>
						{areas.map((area) => {
							const currentAreaAllSelected = area.field.every((field) => checkedFields.has(field));
							return <AreaAccordion key={area.id.toString()} area={area} isCurrentAreaAllSelected={currentAreaAllSelected} control={2} />;
						})}
						{/* <AreaAccordion key={area.id} area={area} isCurrentAreaAllSelected={area.field.every((field) => checkedFields.has(field))} control={2} /> */}
					</ScrollView>
				</ScrollView>
				<Button
					uppercase={false}
					disabled={checkedFields.size === 0}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={async () => {
						const selectedFields = [...checkedFields];
						let alertFields = [];
						selectedFields.forEach((element) => {
							if (!element.crop[0].diagnosis[0]) {
								alertFields.push(element.name);
							} else {
								if (new Date(element.crop[0].diagnosis[0].report_date) > new Date(element.crop[0].diagnosis[0].prescription[0].date)) {
									alertFields.push(element.name);
								}
							}
						});
						if (alertFields.length !== 0) {
							const response = await asyncCancelableAlert({
								title: 'Diagnóstico(s) Desatualizado(s)',
								body: `Para o(s) talhão(ões): ${alertFields.toString()} O(s) diagnóstico(s) esta(ão) desatualizados. \n \n Deseja continuar mesmo assim?`,
								confirmButtonText: 'Continuar',
								cancelButtonText: 'Cancelar',
							});
							if (response === 'CONFIRM') {
								navigation.navigate('MethodSelection', { selectedFields: [...checkedFields] });
							} else {
								// openPdf();
							}
						} else {
							navigation.navigate('MethodSelection', { selectedFields: [...checkedFields] });
						}

						// // console.log('drone', checkedFields);
						// console.log('aviao', checkedFieldsAviao);
						// console.log('TERRESTRE', checkedFieldsTerrestre);
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
		backgroundColor: 'white',
		paddingHorizontal: '24rem',
	},
	checkboxView: {
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: '16rem',
		flexDirection: 'row',
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
	titleText: {
		paddingLeft: '8rem',
		fontSize: '23rem',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
