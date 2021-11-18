import React from 'react';
import { View, Image, Text } from 'react-native';

import { Models } from '../../models';
import { icons, images, colors } from '../../src/assets';
import { createTStyleSheet, overrideTStyleSheet, ExtendedStyle } from '../../src/utils/style';
import { getLatestCrop, getFieldInfestationText, REM_SCALE } from '../../src/utils';
import { getMapPinColorDate } from '../../src/utils/semaphore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

type FieldCardProps = {
	isDiagnosisMode: boolean;
	isElevated: boolean;
	field: Models.field;
	customStyle?: ExtendedStyle;
	isHideCircle?: boolean;
	isIndexNotAvailable: boolean;
	onFieldPress?: () => void;
};

export function FieldCard(props: FieldCardProps) {
	const latestCrop = getLatestCrop(props.field);
	const text = getFieldInfestationText(props.field, true);

	// const semaphoreThresholds = useThresholds();

	const mapPinColor = getMapPinColorDate(props.field);

	const styles = overrideTStyleSheet(
		defaultStyleSheet,
		{
			$fieldImgSize: latestCrop ? '80%' : '72%',
			card: {
				elevation: props.isElevated ? '4rem' : 0,
			},

			warningBox: {
				backgroundColor: mapPinColor,
			},
			circle: {
				color: mapPinColor,
			},
			contentView: {
				justifyContent: props.isDiagnosisMode ? 'space-evenly' : 'center',
			},
		},
		{
			card: props.customStyle ?? {},
		},
	);

	return (
		<TouchableOpacity style={styles.card} onPress={props.onFieldPress}>
			{props.isHideCircle ? undefined : (
				<View style={styles.circleView}>
					<View style={{ alignItems: 'center', justifyContent: 'center' }}>
						<View style={{ zIndex: 1, position: 'absolute', alignSelf: 'center' }}>
							<Text style={styles.circleText}>{props.field.code}</Text>
						</View>
						<FontAwesome name="circle" style={styles.circle} />
					</View>
				</View>
			)}
			<View style={styles.imageView}>
				<Image
					source={
						latestCrop?.crop_type === 'Cana'
							? images.crop.sugarCane
							: latestCrop?.crop_type === 'Soja'
							? images.crop.soy
							: latestCrop?.crop_type === 'Milho'
							? images.crop.corn
							: icons.weed
					}
					style={styles.fieldImage}
					resizeMode="contain"
				/>
			</View>

			<View style={styles.contentView}>
				{props.isDiagnosisMode ? (
					text === 'AGUARDANDO\nDIAGNÓSTICO' || text === 'DIAGNÓSTICO\nNÃO CONTRATADO' ? (
						<View style={styles.warningBox}>
							<Text numberOfLines={2} style={{ fontSize: 8 * REM_SCALE, fontWeight: 'bold', textAlign: 'center' }}>
								{text}
							</Text>
						</View>
					) : (
						<Text numberOfLines={2} style={{ fontSize: 14 * REM_SCALE, fontWeight: 'bold', textAlign: 'center' }}>
							{text}
						</Text>
					)
				) : undefined}
				{!props.isDiagnosisMode && props.isIndexNotAvailable ? (
					<View style={styles.warningBox}>
						<Text numberOfLines={2} style={{ fontSize: 10 * REM_SCALE, fontWeight: 'bold', textAlign: 'center' }}>
							ÍNDICES NÃO DISPONÍVEIS
						</Text>
					</View>
				) : undefined}
				<View style={styles.textView}>
					<Text
						numberOfLines={props.isDiagnosisMode || props.isIndexNotAvailable ? 3 : 2}
						style={props.isDiagnosisMode || props.isIndexNotAvailable ? styles.textInfected : styles.textTitle}
					>
						{props.field.name}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const defaultStyleSheet = createTStyleSheet({
	card: {
		marginHorizontal: '8rem',
		height: '114rem',
		width: '90rem',
		borderRadius: '5rem',
		backgroundColor: 'white',
		alignItems: 'center',
	},
	imageView: {
		flex: 0.5,
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingTop: '12rem',
	},
	$fieldImgSize: '100%',
	fieldImage: {
		height: '$fieldImgSize',
		tintColor: 'black',
	},
	textView: {
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	textTitle: {
		fontSize: '14rem',
		color: colors.neutral.darker_60,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	textInfected: {
		fontSize: '10rem',
		color: colors.neutral.darker_60,
		textAlign: 'center',
	},
	warningBox: {
		width: '76rem',
		height: '28rem',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black',
		borderRadius: '3rem',
		margin: '3rem',
	},
	circleView: {
		zIndex: 1,
		position: 'absolute',
		left: '4rem',
		top: '4rem',
	},
	circleText: {
		fontSize: '14rem',
		fontWeight: 'bold',
	},
	circle: {
		fontSize: '28rem',
		color: '#D8F6C4',
	},
	contentView: {
		flex: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
});
