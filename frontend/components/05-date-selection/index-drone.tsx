import React, { useState } from 'react';
import { View, Text, ToastAndroid } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { ClosableHeader } from '../00-common';
import { AgroXScreenProps } from '../navigation-types';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { Button, Divider } from 'react-native-paper';
import { confirmQuotationLeave } from '../../src/utils/alert-messages';

import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { dispatch } from '../../redux-things';
import { formatDate } from '../../src/utils';

dayjs.extend(isSameOrAfter);

type ScreenProps = AgroXScreenProps<'DateSelection'>;

export const DateSelectionDrone = asAliveOnlyScreenComponent(({ navigation }: ScreenProps) => {
	const dateInterval = 1;
	const today = dayjs().startOf('day');
	const nextDay = today.add(dateInterval, 'day');

	const [startDate, setStartDate] = useState(today);
	const [endDate, setEndDate] = useState(nextDay);
	const [selector, setSelector] = useState('start');

	const [show, setShow] = useState(false);

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

	const showDatepicker = (select: string) => {
		setSelector(select);
		setShow(true);
	};

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
					<Text style={styles.titleText}>{`Em qual período você deseja\nrealizar a pulverização?`}</Text>
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
						<View>
							<Text style={{ marginLeft: '55%' }}>Terminar em</Text>
							<Text style={styles.dateBox} onPress={() => showDatepicker('end')}>
								{formatDate(endDate.toISOString())}
							</Text>
						</View>
					</View>
				</View>
				<Button
					uppercase={false}
					disabled={false}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={() => {
						const pulverizationStartDate = startDate.toDate();
						const pulverizationEndDate = endDate.toDate();
						dispatch({ type: 'CHANGE_START_DATE', pulverizationStartDate });
						dispatch({ type: 'CHANGE_END_DATE', pulverizationEndDate });

						navigation.navigate('QuotationSummaryDrone');
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
		paddingHorizontal: '32rem',
		paddingVertical: '16rem',
		marginTop: '8rem',
		marginLeft: '40%',
		backgroundColor: '#E8E8E8',
	},
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
