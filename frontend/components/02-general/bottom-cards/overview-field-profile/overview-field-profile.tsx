import React, { useRef, useCallback, useEffect } from 'react';
import { createTStyleSheet } from '../../../../src/utils/style';
import { TouchableOpacity, Text, View, Linking, Image, FlatList, ScrollView } from 'react-native';
// import { Entypo } from '@expo/vector-icons';
import { Card, Divider, Button } from 'react-native-paper';
import { CardTitle } from '../../../00-common/card-title';
import { useMainSelector } from '../../../../redux-things';
import { CloseableBottomCardProps } from '../closeable-bottom-card-props';
import { getLatestCrop, formatDate } from '../../../../src/utils';
// import { TrueColor } from '../../../../models';
import { plantingReport, asyncCancelableAlert } from '../../../../src/utils/alert-messages';
import { useNavigation } from '@react-navigation/native';
import { scrollToEndAndBack } from '../../../../src/utils';
import { icons } from '../../../../src/assets';
import { white } from 'react-native-paper/lib/typescript/src/styles/colors';
import { ClosableHeader, Accordion, CustomCheckbox, AccordionTable } from '../../../00-common';
import { useBackButton } from '../../../../src/custom-hooks/use-back-button';
import { asAliveOnlyScreenComponent } from '../../../../src/utils/smart-lifecycle-components';
// import { SelectableFieldCard } from 'selectable-field-card';
import {} from 'react-native-gesture-handler';
import { AgroXScreenProps } from '../../../navigation-types';
import { Models, PulverizationMethods } from '../../../../models';
// import { getLatestDiagnosis, getLatestPrescriptionPulverizationMethod } from '../../src/utils';
import { getLatestPrescriptionPulverizationMethod } from '../../../../src/utils';
export { BACKEND_BASE_URL } from '../../../../src/network/ky';
import { ky } from '../../../../src/network/ky';
import { confirmQuotationLeave } from '../../../../src/utils/alert-messages';
import { forSlideLeft } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/HeaderStyleInterpolators';
export function OverviewFieldProfile(props: CloseableBottomCardProps) {
	const scrollViewRef = useRef<ScrollView>(null);
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;
	const latestCrop = getLatestCrop(field);
	const cropNotAvailableText = '-';
	const navigation = useNavigation();
	const [checkedFields, setCheckedFields] = React.useState(new Set<Models.field>());
	const [expandedAreas, setExpandedAreas] = React.useState(new Set<Models.area>());
	const [expandedTable, setExpandedTable] = React.useState(new Set<String>());
	const [dataTeste, setDataTeste] = React.useState(JSON);
	const areas = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm.area)!;
	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const fields: Models.field[] = [];
	for (const field of area.field) {
		if (getLatestPrescriptionPulverizationMethod(field) !== PulverizationMethods.NOT_AVAILABLE) fields.push(field);
	}
	useEffect(() => {
		(async () => {
			const data = await ky.get(`record/recordId/${field.id.toString()}`).json<JSON>();
			setDataTeste(data);
		})();
	}, []);
	const onClose = useCallback(() => {
		setCheckedFields(new Set<Models.field>());
	}, []);
	useBackButton(() => {
		onClose();
		return 'PROCEED';
	}, [onClose]);
	type AreaAccordionProps = {
		area: Models.area;
	};
	async function openPdf() {
		try {
			const ret = await Linking.openURL(`https://storage.googleapis.com/agrodev_pdf/${field.area_id}/${field.id}/NDVI.pdf`);
			return ret;
		} catch (error) {
			console.log(error);
			// displayAlert({
			// 	title: `Informação`,
			// 	body: `Não foi possível abrir o WhatsApp, favor entrar em contato pelo telefone: ${WHATSAPP_DEFAULT_NUMBER}`,
			// 	buttonText: 'Ok',
			// });
		}
	}
	return (
		<View style={styles.mainView}>
			<CardTitle text={field.name} titleIcon="location" onClose={props.onClose} />

			<ScrollView ref={scrollViewRef} style={styles.scrollBar} onLayout={() => scrollToEndAndBack(scrollViewRef, 'scrollview')}>
				<View style={styles.contentView}>
					<View style={{ flexDirection: 'column' }}>
						<Text numberOfLines={1} style={styles.header}>
							TIPO DE PLANTIO
						</Text>
						<Text numberOfLines={1} style={styles.content}>
							{latestCrop ? latestCrop.crop_type : cropNotAvailableText}
						</Text>
						<View style={styles.spacer} />
						<Text numberOfLines={1} style={styles.header}>
							VARIEDADE
						</Text>
						<Text numberOfLines={1} style={styles.content}>
							{latestCrop ? latestCrop.variety : cropNotAvailableText}
						</Text>
					</View>
					<View style={{ flexDirection: 'column' }}>
						<Text numberOfLines={1} style={styles.header}>
							ÁREA (HA)
						</Text>
						<Text numberOfLines={1} style={styles.content}>
							{field.area_ha.toFixed(2)}
						</Text>
						<View style={styles.spacer} />
						<Text numberOfLines={2} style={styles.header}>
							DATA DE{'\n'}PLANTIO
						</Text>
						<Text numberOfLines={1} style={styles.content}>
							{latestCrop ? formatDate(latestCrop.sowing_date) : cropNotAvailableText}
						</Text>
					</View>
					<View style={{ flexDirection: 'column' }}>
						<Text numberOfLines={1} style={styles.header}>
							CORTE
						</Text>
						<Text numberOfLines={1} style={styles.content}>
							{field.crop.length > 0 ? field.crop.length : cropNotAvailableText}
						</Text>
						<View style={styles.spacer} />
						<Text numberOfLines={2} style={styles.header}>
							PREVISÃO{'\n'}DE COLHEITA
						</Text>
						<Text numberOfLines={1} style={styles.content}>
							{latestCrop ? formatDate(latestCrop.expected_harvest_date) : cropNotAvailableText}
						</Text>
					</View>
				</View>

				<View>
					<Text style={styles.hs}>Histórico</Text>
				</View>
				<View style={styles.headerContentTable}>
					<Text style={styles.headerTable}>Data</Text>
					<Text style={styles.headerTable}>Operação</Text>
					<Text style={styles.headerTableLast}>Detalhes</Text>
				</View>
				<Divider style={styles.divider} />
				{/* <Text style={styles.headerTableContentLast}>
                        <Image source={icons.vector} style={styles.logo} />
                    </Text> */}
				<View>
					<FlatList
						data={dataTeste}
						renderItem={({ item }) => (
							<AccordionTable
								key={item.date}
								isExpanded={expandedTable.has(item)}
								date={item.date.split('T')[0].split('-')[2] + '/' + item.date.split('T')[0].split('-')[1] + '/' + item.date.split('T')[0].split('-')[0]}
								operation={item.operation}
								onPress={() => {
									setExpandedTable((expandedTable) => {
										if (expandedTable.has(item)) expandedTable.delete(item);
										else expandedTable.add(item);
										return new Set(expandedTable);
									});
								}}
							>
								<View style={styles.contentDetails}>
									<Text style={styles.boxDetails}>{item.description}</Text>
								</View>
							</AccordionTable>
						)}
						keyExtractor={(item) => item.date}
					/>
				</View>
			</ScrollView>
			<View style={styles.buttonView2}>
				<Card style={styles.card}>
					<TouchableOpacity
						activeOpacity={0.5}
						style={styles.button}
						onPress={async () => {
							navigation.navigate('IncludeRecord');
						}}
					>
						<Text style={styles.text2}>Incluir Registro</Text>
					</TouchableOpacity>
				</Card>
			</View>

			<View style={styles.buttonView2}>
				<Card style={styles.cardButton}>
					<TouchableOpacity
						activeOpacity={0.5}
						style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
						onPress={async () => {
							// plantingReport.body = ``;
							const response = await asyncCancelableAlert(plantingReport);
							if (response === 'CONFIRM') {
								navigation.navigate('MethodSelectionReport');
							} else {
								openPdf();
							}
							// openPdf();
						}}
					>
						<Text style={styles.text2}>Relatórios de Plantio</Text>
					</TouchableOpacity>
				</Card>
			</View>
		</View>
	);
}
const styles = createTStyleSheet({
	logo: {
		width: '10rem',
		height: '10rem',
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	},
	boxDetails: {
		fontSize: '14rem',
		color: '#78849E',
		fontWeight: '500',
		marginTop: '16rem',
		marginHorizontal: '10rem',
	},
	$marginVertical: '0rem',
	divider: {
		height: '3rem',
		marginVertical: '$marginVertical',
		backgroundColor: '#FFFFFF',
	},
	scrollBar: {
		paddingRight: '10rem',
		maxHeight: '300rem',
	},
	headerContentTable: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: '16rem',
		marginTop: '16rem',
		marginLeft: '10rem',
		// marginRight: '10rem',
		backgroundColor: '#EFF0F0',
		paddingHorizontal: '10rem',
	},
	contentTable: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: '16rem',
		marginLeft: '10rem',
		backgroundColor: '#EFF0F0',
		paddingHorizontal: '10rem',
	},
	contentDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: '16rem',
		marginLeft: '10rem',
		backgroundColor: '#F8F8F8',
		paddingHorizontal: '10rem',
	},
	mainView2: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '80%',
		height: '30rem',
	},
	icon: {
		marginHorizontal: '7rem',
		fontSize: '20rem',
		color: '#469BA2',
	},
	text: {
		fontSize: '14rem',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: '500',
		color: '#469BA2',
	},
	card: {
		height: '44rem',
		backgroundColor: '#469BA2',
		width: '90%',
		marginLeft: '20rem',
		marginBottom: '16rem',
		marginTop: '16rem',
	},
	cardButton: {
		height: '44rem',
		backgroundColor: '#469BA2',
		width: '90%',
		marginLeft: '20rem',
		marginBottom: '16rem',
	},
	text2: {
		marginLeft: '10rem',
		fontSize: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: '300',
		color: '#ffffff',
	},
	mainView: {
		flexDirection: 'column',
		alignItems: 'stretch',
		justifyContent: 'flex-end',
		backgroundColor: 'white',
	},
	buttonView: {
		width: '100%',
	},
	contentView: {
		paddingBottom: '16rem',
		marginTop: '16rem',
		marginHorizontal: '16rem',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	header: {
		fontSize: '14rem',
		color: '#78849E',
	},
	headerTable: {
		fontSize: '14rem',
		color: '#469BA2',
		fontWeight: 'bold',
		marginTop: '16rem',
		maxWidth: '95rem',
		minWidth: '95rem',
	},
	headerTableLast: {
		fontSize: '14rem',
		color: '#469BA2',
		fontWeight: 'bold',
		paddingRight: '10rem',
		marginTop: '16rem',
	},
	headerTableContent: {
		fontSize: '14rem',
		color: '#767F82',
		fontWeight: 'normal',
		marginTop: '16rem',
		maxWidth: '95rem',
		minWidth: '95rem',
	},
	headerTableContentLast: {
		fontSize: '14rem',
		color: '#767F82',
		fontWeight: 'normal',
		marginTop: '16rem',
		paddingRight: '40rem',
	},
	content: {
		fontSize: '14rem',
		color: '#6C6464',
	},
	columnsView: {
		flexDirection: 'column',
		maxWidth: '140rem',
	},
	spacer: {
		margin: '16rem',
	},
	hs: {
		fontSize: '20rem',
		marginHorizontal: '16rem',
	},
});
