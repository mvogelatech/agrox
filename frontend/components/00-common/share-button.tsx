import React from 'react';
import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { createTStyleSheet, overrideTStyleSheet, ExtendedStyle } from '../../src/utils/style';
import { Entypo } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Models } from '../../models';
import { useMainSelector } from '../../redux-things';
import * as FileSystem from 'expo-file-system';
import { BACKEND_BASE_URL } from '../../src/network';
import { reportTemplate } from './report-template';
import { getLatestDiagnosis } from '../../src/utils';

const BASE_64_VALIDATION_TOKEN = 'WDl5NDhVV2ZlRTAsSlo3JWJYfUdJe3ZvLlsmayFILWs4XXVldDg7WA==';
const ZOOM_LEVEL = 17;

export type PlagueData = { plague: Models.plague; percentage: number };

type ShareButtonProps = {
	text: string;
	field: Models.field;
	plagues: PlagueData[];
	customStyle?: ExtendedStyle;
	onBusy: (toggle: boolean) => void;
};

export function ShareButton(props: ShareButtonProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		mainView: props.customStyle ?? {},
	});

	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const farm = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm)!;

	return (
		<TouchableOpacity
			activeOpacity={0.5}
			style={styles.mainView}
			onPress={async () => {
				props.onBusy(true);
				await generateReport(props.field, farm, area, props.plagues);
				props.onBusy(false);
			}}
		>
			<Entypo name="share" style={styles.icon} />
			<Text style={styles.text}>{props.text}</Text>
		</TouchableOpacity>
	);
}

async function generateReport(field: Models.field, farm: Models.farm, area: Models.area, plagueDataList: PlagueData[]) {
	const diagnosis = getLatestDiagnosis(field)!;
	const remoteUri = `${BACKEND_BASE_URL}/diagnosis/${diagnosis.id}/${farm.imaging[0].directory}/${ZOOM_LEVEL}/${BASE_64_VALIDATION_TOKEN}`;
	const localUri = `${FileSystem.documentDirectory!}${'temp'}.png`;
	const result = await FileSystem.downloadAsync(remoteUri, localUri);
	if (result.status === 200) {
		const imageBase64 = localUri;
		const farmName = farm.fantasy_name;
		const areaName = area.name;
		const fieldName = field.name;
		const cropType = field.crop[0].crop_type;
		const cropAreaHa = field.area_ha.toFixed(2);
		const cropTypeVariety = field.crop[0].variety;
		const sowingDate = field.crop[0].sowing_date.split('T')[0];
		const harvestDate = field.crop[0].expected_harvest_date.split('T')[0];
		const reportDate = diagnosis.report_date.split('T')[0];

		const mamona = plagueDataList.find((item) => item.plague.name === 'mamona');
		const gpa = plagueDataList.find((item) => item.plague.name === 'gpa');
		const gpb = plagueDataList.find((item) => item.plague.name === 'gpb');
		const ofl = plagueDataList.find((item) => item.plague.name === 'ofl');
		const undef = plagueDataList.find((item) => item.plague.name === 'indefinida');
		const trepadeiras = plagueDataList.find((item) => item.plague.name === 'trepadeira');

		const totalArea = field.area_ha ?? 0;
		const affectedArea = diagnosis.affected_area_ha ?? 0;
		const infestationPercentage = (totalArea === 0 ? 0 : (affectedArea / totalArea) * 100).toFixed(2);

		const trepadeirasPercentage = (trepadeiras?.percentage ?? 0).toFixed(2);
		const mamonaPercentage = (mamona?.percentage ?? 0).toFixed(2);
		const gpaPercentage = (gpa?.percentage ?? 0).toFixed(2);
		const gpbPercentage = (gpb?.percentage ?? 0).toFixed(2);
		const oflPercentage = (ofl?.percentage ?? 0).toFixed(2);
		const undefinedPercentage = (undef?.percentage ?? 0).toFixed(2);

		const html = reportTemplate(
			imageBase64,
			farmName,
			areaName,
			fieldName,
			cropType,
			cropAreaHa,
			cropTypeVariety,
			sowingDate,
			harvestDate,
			reportDate,
			totalArea.toFixed(2),
			affectedArea.toFixed(2),
			infestationPercentage,
			trepadeirasPercentage,
			mamonaPercentage,
			gpaPercentage,
			gpbPercentage,
			oflPercentage,
			undefinedPercentage,
		);

		const { uri } = await Print.printToFileAsync({ html });

		await Sharing.shareAsync(uri);

		await FileSystem.deleteAsync(localUri);
	}
}

const defaultStyleSheet = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
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
});
