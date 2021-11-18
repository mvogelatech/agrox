import React, { useMemo, useRef, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { createTStyleSheet } from '../../../../src/utils/style';
import Slider, { SliderRef } from '@react-native-community/slider';
import { CardTitle } from '../../../00-common/card-title';
import { dispatch, useMainSelector } from '../../../../redux-things';
import { CloseableBottomCardProps } from '../closeable-bottom-card-props';
import { TabButtonTextHighLight } from '../../../00-common/tab-button-text-highlight';
import { formatDate, scrollToEndAndBack } from '../../../../src/utils';
import dayjs from 'dayjs';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { Button, Divider } from 'react-native-paper';
import { NDVI, NDWI, NDRE, Greenness } from '../../../../models';
import { WaitOverlay } from '../../../00-common/wait-overlay';
import { cacheFieldIndexImages, getDatesForIndexDataFromField } from '../../../../src/utils/visiona-indices';

type MySliderRef = (React.LegacyRef<Slider> & React.MutableRefObject<SliderRef>) | undefined;

export function IndicesSelection(props: CloseableBottomCardProps) {
	const field = useMainSelector((state) => state.interactionData.general.currentField)!;

	const today = dayjs().startOf('day');
	const previousYear = dayjs().startOf('day').subtract(1, 'year');

	const indicesTab = useMainSelector((state) => state.interactionData.general.indicesCurrentTab);

	const scrollViewRef = useRef<ScrollView>(null);
	const scrollViewTextRef = useRef<ScrollView>(null);

	const [indexDates, setIndexDates] = useState(getDatesForIndexDataFromField(field));

	const [startDate, setStartDate] = useState(previousYear);
	const [endDate, setEndDate] = useState(today);

	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showIndicator, setShowIndicator] = useState(false);

	const sliderRef = useRef() as MySliderRef;

	const onChange = (event: Event, selectedDate: Date | undefined) => {
		setShowDatePicker(false);

		if (selectedDate) {
			setShowIndicator(true);
			setStartDate(dayjs(selectedDate));
			const newDates = getDatesForIndexDataFromField(field, selectedDate.toISOString());
			setIndexDates(newDates);
			setShowIndicator(false);
		}
	};

	const showDatepicker = () => {
		setShowDatePicker(true);
	};

	const onDateSliderChange = (value: number) => {
		dispatch({ type: 'CHANGE_INDICES_DATE', indexDate: indexDates[value] });
	};

	useMemo(() => {
		(async () => {
			if (field) {
				setShowIndicator(true);
				await cacheFieldIndexImages(field, indicesTab);
				if (indexDates.length > 0) {
					setStartDate(dayjs(indexDates[0]));
					setEndDate(dayjs(indexDates[indexDates.length - 1]));
					dispatch({ type: 'CHANGE_INDICES_DATE', indexDate: indexDates[0] });
				}

				setShowIndicator(false);
			}
		})();
	}, [field, indicesTab, indexDates]);

	return (
		<View style={styles.mainView}>
			{showIndicator ? <WaitOverlay text="Aguarde" /> : undefined}
			<View style={styles.tabMenuView}>
				<ScrollView
					ref={scrollViewRef}
					horizontal
					contentContainerStyle={styles.tabMenuView}
					showsHorizontalScrollIndicator={false}
					onLayout={() => scrollToEndAndBack(scrollViewRef, 'scrollview')}
				>
					<TabButtonTextHighLight
						isSelected={indicesTab === NDVI}
						text={NDVI.text}
						onPress={() => {
							(sliderRef?.current as Slider).setNativeProps({ value: 0 });
							dispatch({ type: 'CHANGE_INDICES_TAB', tab: NDVI });
							dispatch({ type: 'CHANGE_INDICES_DATE', indexDate: undefined });
						}}
					/>
					<TabButtonTextHighLight
						isSelected={indicesTab === NDWI}
						text={NDWI.text}
						onPress={() => {
							(sliderRef?.current as Slider).setNativeProps({ value: 0 });
							dispatch({ type: 'CHANGE_INDICES_TAB', tab: NDWI });
							dispatch({ type: 'CHANGE_INDICES_DATE', indexDate: undefined });
						}}
					/>
					<TabButtonTextHighLight
						isSelected={indicesTab === NDRE}
						text={NDRE.text}
						onPress={() => {
							(sliderRef?.current as Slider).setNativeProps({ value: 0 });
							dispatch({ type: 'CHANGE_INDICES_TAB', tab: NDRE });
							dispatch({ type: 'CHANGE_INDICES_DATE', indexDate: undefined });
						}}
					/>
					<TabButtonTextHighLight
						isSelected={indicesTab === Greenness}
						text={Greenness.text}
						onPress={() => {
							(sliderRef?.current as Slider).setNativeProps({ value: 0 });
							dispatch({ type: 'CHANGE_INDICES_TAB', tab: Greenness });
							dispatch({ type: 'CHANGE_INDICES_DATE', indexDate: undefined });
						}}
					/>
				</ScrollView>
			</View>
			<View style={styles.cardView}>
				<CardTitle text="Informações" titleIcon="location" onClose={props.onClose} />
				<ScrollView ref={scrollViewTextRef} style={styles.textScroll} onLayout={() => scrollToEndAndBack(scrollViewTextRef, 'scrollview')}>
					<Text style={styles.indexText}>{indicesTab.description}</Text>
				</ScrollView>
				<Slider
					ref={sliderRef}
					style={styles.slider}
					minimumValue={0}
					maximumValue={indexDates.length - 1}
					step={1}
					minimumTrackTintColor="#0D3845"
					maximumTrackTintColor="#469BA2"
					onValueChange={onDateSliderChange}
				/>
				<View style={styles.dateView}>
					<Button icon="calendar" style={styles.dateBox} onPress={() => showDatepicker()}>
						{formatDate(startDate.toISOString())}
					</Button>
					<Divider style={styles.divider} />
					<Text style={styles.endDateBox}>{formatDate(endDate.toISOString())}</Text>
				</View>
			</View>
			{showDatePicker && (
				<DateTimePicker
					display="spinner"
					minimumDate={dayjs(endDate).subtract(1, 'year').toDate()}
					value={startDate.toDate()}
					mode="date"
					onChange={onChange}
				/>
			)}
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		backgroundColor: '#fff',
		height: '35%',
	},
	tabMenuView: {
		backgroundColor: '#0D3845',
	},
	cardView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'stretch',
	},
	indexText: {
		paddingLeft: '20rem',
	},
	textScroll: {
		textAlign: 'justify',
	},
	slider: {
		alignSelf: 'stretch',
		paddingBottom: '20rem',
		marginHorizontal: '30rem',
	},
	dateView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: '20rem',
		paddingBottom: '10rem',
	},
	divider: {
		height: '0rem',
		flex: 1,
	},
	dateBox: {
		flex: 1,
		backgroundColor: '#f7f7fa',
		borderWidth: '1rem',
		borderColor: '#d1d4d5',
		borderStyle: 'solid',
		height: '40rem',
		alignSelf: 'center',
	},
	endDateBox: { flex: 1 },
});
