import React, { useState, useEffect } from 'react';
import { View, Text, ToastAndroid, Picker } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { CardTitle } from '../00-common/card-title';

import { ClosableHeader } from '../00-common';
import { AgroXScreenProps } from '../navigation-types';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { Button, RadioButton, TextInput } from 'react-native-paper';
import { confirmQuotationLeave } from '../../src/utils/alert-messages';

import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { dispatch, MainState, useMainSelector } from '../../redux-things';
import { formatDate } from '../../src/utils';
import { ky } from '../../src/network/ky';

import * as Location from 'expo-location';
// import ModalDropdown from 'react-native-modal-dropdown';
// import Icon from '@mdi/react';
// import { mdiAccount } from '@mdi/js';

dayjs.extend(isSameOrAfter);

type ScreenProps = AgroXScreenProps<'IncludeRecord'>;

export const IncludeRecord = asAliveOnlyScreenComponent(({ navigation }: ScreenProps) => {
	const dateInterval = 1;
	const today = dayjs().startOf('day');
	const nextDay = today.add(dateInterval, 'day');
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;

	const [startDate, setStartDate] = useState(today);
	const [endDate, setEndDate] = useState(nextDay);
	const [selector, setSelector] = useState('start');

	const [selectedValue, setSelectedValue] = React.useState('first');

	const [show, setShow] = useState(false);
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);

	const onChange = (event: Event, selectedDate: Date | undefined) => {
		setShow(false);
		const currentDate = dayjs(selectedDate);
		// If OK is pressed on the DatePicker
		if (currentDate) {
			// And the desired start date is today or later
			const dateTime = new Date();
			setStartDate(dayjs(dateTime));
			if (selector === 'start') {
				const dateTime = new Date();
				setStartDate(dayjs(dateTime));
				console.log('auqi kjnlkjnjkbnre', currentDate);
				if (currentDate.isSameOrAfter(endDate)) {
					setEndDate(currentDate.add(dateInterval, 'day'));
				}
			} else if (selector === 'end' && currentDate.isSameOrAfter(startDate.add(dateInterval, 'day'))) setEndDate(currentDate);
			else ToastAndroid.showWithGravity('Data Inválida! Por favor, selecione novamente.', ToastAndroid.LONG, ToastAndroid.CENTER);
		}
	};

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestPermissionsAsync();
			console.log('status', status);
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			await Location.watchPositionAsync({ distanceInterval: 1, accuracy: Location.Accuracy.High }, (loc) => {
				setLocation(loc);
			});
		})();
	}, []);

	let text = 'Waiting..';
	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = JSON.stringify(location);
	}

	const showDatepicker = (select: string) => {
		setSelector(select);
		setShow(true);
	};

	// const [selectedValue, setSelectedValue] = useState('Plantio');
	const [errorMessage, setErrorMessage] = useState('');
	const [description, setDescription] = useState('');

	function textChange(value: string) {
		setDescription(value);
		setErrorMessage('');
	}

	async function postRecord() {
		console.log('sucess');

		const createdRecord = await ky
			.post('record', {
				json: {
					id: field.id,
					record: {
						date: endDate,
						operation: selectedValue,
						description: description,
					},
				},
			})
			.json<String>();
		// dispatch({ type: 'BACKEND_DATA__POSTED_NEW_QUOTATION_PACKAGE', package: createdQuotation });
	}

	return (
		<View style={{ flex: 1 }}>
			<ClosableHeader
				onBackPress={() => {
					navigation.goBack();
				}}
				onClose={() => {
					void confirmQuotationLeave(navigation);
				}}
			/>

			<View style={styles.mainView}>
				<View>
					<CardTitle text={field.name} titleIcon="location" />
					<Text style={styles.titleText}>{`Selecione o tipo de operação\n que você deseja realizar`}</Text>

					<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
						{/* <Text>{text}</Text> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Plantio"
								status={selectedValue === 'Plantio' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Plantio')}
							/>
							<Text>Plantio</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Herbicida"
								status={selectedValue === 'Herbicida' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Herbicida')}
							/>
							<Text>Herbicida</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Fungicida"
								status={selectedValue === 'Fungicida' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Fungicida')}
							/>
							<Text>Fungicida</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Maturador"
								status={selectedValue === 'Maturador' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Maturador')}
							/>
							<Text>Maturador</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Inseticida"
								status={selectedValue === 'Inseticida' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Inseticida')}
							/>
							<Text>Inseticida</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Gradagem"
								status={selectedValue === 'Gradagem' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Gradagem')}
							/>
							<Text>Gradagem</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Subsolagem"
								status={selectedValue === 'Subsolagem' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Subsolagem')}
							/>
							<Text>Subsolagem</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Adubação"
								status={selectedValue === 'Adubação' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Adubação')}
							/>
							<Text>Adubação</Text>
						</View>

						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Aração"
								status={selectedValue === 'Aração' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Aração')}
							/>
							<Text>Aração</Text>
						</View>

						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Calcário"
								status={selectedValue === 'Calcário' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Calcário')}
							/>
							<Text>Calcário</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Gesso"
								status={selectedValue === 'Gesso' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Gesso')}
							/>
							<Text>Gesso</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Colheita"
								status={selectedValue === 'Colheita' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Colheita')}
							/>
							<Text>Colheita</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Quebra-lombo"
								status={selectedValue === 'Quebra-lombo' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Quebra-lombo')}
							/>
							<Text>Quebra-lombo</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<RadioButton
								color="#327387"
								value="Outros"
								status={selectedValue === 'Outros' ? 'checked' : 'unchecked'}
								onPress={() => setSelectedValue('Outros')}
							/>
							<Text>Outros</Text>
						</View>
					</View>
					{/* <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} /> */}
					{/* <Text>primeiro</Text> */}

					{/* <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} /> */}
					<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
						<View style={{ width: '100%' }}>
							<Text style={styles.textIn}>Data</Text>
							<View style={styles.dateBox}>
								<View style={{ width: '70%' }}>
									<Text onPress={() => showDatepicker('end')}>{formatDate(endDate.toISOString())}</Text>
								</View>
								<View style={{ width: '30%' }}>{/* <Icon path={mdiAccount} size={1} horizontal vertical rotate={90} color="red" /> */}</View>
							</View>
						</View>
						{/* <View style={{ width: '50%' }}>
							<Text style={styles.textInOp}>Operação</Text>
							<View style={styles.dateBoxOp}>
								<Picker
									selectedValue={selectedValue}
									style={{ height: 50, width: 175 }}
									onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
								>
									<Picker.Item label="Plantio" value="Plantio" />
									<Picker.Item label="Herbicida" value="Herbicida" />
									<Picker.Item label="Fungicida" value="Fungicida" />
									<Picker.Item label="Maturador" value="Maturador" />
									<Picker.Item label="Inseticida" value="Inseticida" />
									<Picker.Item label="Gradagem" value="Gradagem" />
									<Picker.Item label="Subsolagem" value="Subsolagem" />
									<Picker.Item label="Quebra-lombo" value="Quebra-lombo" />
									<Picker.Item label="Aração" value="Aração" />
									<Picker.Item label="Adubação" value="Adubação" />
									<Picker.Item label="Calcário" value="Calcário" />
									<Picker.Item label="Gesso" value="Gesso" />
									<Picker.Item label="Colheita" value="Colheita" />
									<Picker.Item label="Outros" value="Outros" />
								</Picker>
							</View>
						</View> */}
						<View style={styles.headerInput}>
							<Text style={styles.textInOp}>Descrição</Text>
							<TextInput
								contextMenuHidden
								multiline
								mode="outlined"
								style={styles.inputDesc}
								onChangeText={(description) => textChange(description)}
								value={description}
							/>
						</View>
					</View>
					<View>
						{show && (
							<DateTimePicker
								display="spinner"
								minimumDate={today.toDate()}
								value={selector === 'start' ? startDate.toDate() : endDate.toDate()}
								mode="date"
								onChange={onChange}
							/>
						)}
					</View>

					<View style={styles.dateView}>
						{/* <View>
							<Text>Começar em</Text>
							<Text style={styles.dateBox} onPress={() => showDatepicker('start')}>
								{formatDate(startDate.toISOString())}
							</Text>
						</View>
						<Divider style={styles.divider} /> */}
					</View>
				</View>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					<View style={{ width: '50%' }}>
						<Button
							uppercase={true}
							disabled={false}
							mode="contained"
							style={styles.buttonCan}
							labelStyle={styles.buttonTextCan}
							onPress={() => {
								void confirmQuotationLeave(navigation);
							}}
						>
							cancelar
						</Button>
					</View>
					<View style={{ width: '50%' }}>
						<Button
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

								postRecord();
								navigation.goBack();
							}}
						>
							salvar
						</Button>
					</View>
				</View>
			</View>
		</View>
	);
});

const styles = createTStyleSheet({
	inputDesc: {
		width: '358rem',
		marginTop: '-12rem',
		backgroundColor: '#FFFFFF',
	},
	textIn: {
		marginLeft: '16rem',
		marginTop: '10rem',
		zIndex: 2,
		backgroundColor: '#FFFFFF',
		width: '50rem',
		paddingLeft: '8rem',
		color: '#999999',
	},
	textInOp: {
		marginLeft: '16rem',
		marginTop: '10rem',
		zIndex: 2,
		backgroundColor: '#FFFFFF',
		width: '80rem',
		paddingLeft: '8rem',
		color: '#999999',
	},
	header: {
		fontSize: '14rem',
		color: '#78849E',
	},
	spacer: {
		margin: '16rem',
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
	title: {
		fontSize: '24rem',
		paddingTop: '24rem',
	},
	dateView: {
		paddingTop: '56rem',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	divider: {
		flex: 1,
		height: '1rem',
		marginHorizontal: '16rem',
		marginTop: '30rem',
	},
	dateBox: {
		marginRight: '2rem',
		paddingLeft: '5rem',
		paddingVertical: '16rem',
		marginTop: '-8rem',
		borderColor: '#CCCCCC',
		borderRadius: '10rem',
		borderStyle: 'solid',
		borderWidth: '1rem',
	},
	dateBoxOp: {
		marginLeft: '2rem',
		paddingLeft: '5rem',
		paddingVertical: '2rem',
		marginTop: '-8rem',
		borderColor: '#CCCCCC',
		borderRadius: '10rem',
		borderStyle: 'solid',
		borderWidth: '1rem',
	},
	button: {
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		width: '100%',
		marginLeft: '8rem',
	},
	buttonText: {
		fontSize: '14rem',
	},
	buttonCan: {
		marginRight: '8rem',
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		width: '100%',
		backgroundColor: '#FFFFFF',
		borderColor: '#469BA2',
		// borderRadius: '10rem',
		borderStyle: 'solid',
		borderWidth: '3rem',
	},
	buttonTextCan: {
		fontSize: '14rem',
		color: '#469BA2',
		fontWeight: '600',
	},
});
