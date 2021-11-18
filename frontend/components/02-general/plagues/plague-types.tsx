import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { createTStyleSheet } from '../../../src/utils/style';
import { PlagueItem } from './plague-item';
import { Models } from '../../../models';
import { getAreaAffectedAreaHA, getLatestDiagnosis, StrictUnion } from '../../../src/utils';
import { useMainSelector } from '../../../redux-things';
import { ShareButton, PlagueData } from '../../00-common/share-button';
import { WaitOverlay } from '../../00-common/wait-overlay';

type PlagueTypesProps = StrictUnion<{ area: Models.area }, { field: Models.field }>;

export function PlagueTypes(props: PlagueTypesProps) {
	const infestationPercentagesMap = new Map<string, { plague: Models.plague; percentage: number }>();
	const plaguesDefinition = useMainSelector((state) => state.backendData.plagues)!;
	const [plagueDataList] = useState(new Array<PlagueData>());
	const [showIndicator, setShowIndicator] = useState(false);

	if (props.area) {
		const affectedArea = getAreaAffectedAreaHA(props.area)!;

		const infestationAreasMap = new Map<string, { plague: Models.plague; area_ha: number }>();
		for (const field of props.area.field) {
			for (const infestation of getLatestDiagnosis(field)!.infestation) {
				const { plague, area_ha } = infestation;
				const areaSoFar = infestationAreasMap.get(plague.name)?.area_ha ?? 0;
				infestationAreasMap.set(plague.name, { plague, area_ha: areaSoFar + area_ha });
			}
		}

		for (const [plagueName, { plague, area_ha }] of infestationAreasMap.entries()) {
			infestationPercentagesMap.set(plagueName, {
				plague,
				percentage: (area_ha / affectedArea) * 100,
			});
		}
	} else {
		const latestDiagnosis = getLatestDiagnosis(props.field)!;
		for (const infestation of latestDiagnosis.infestation) {
			infestationPercentagesMap.set(infestation.plague.name, {
				plague: infestation.plague,
				percentage: (infestation.area_ha / props.field.area_ha) * 100,
			});
		}
	}

	function buildPlagueViews() {
		const plagueViews = [];
		let viewKey = 1;
		for (const pDef of plaguesDefinition) {
			const plagueValue = infestationPercentagesMap.get(pDef.name);
			if (pDef.in_use) {
				const pd: PlagueData = { plague: pDef, percentage: plagueValue?.percentage ?? 0 };
				plagueViews.push(
					<View key={viewKey++} style={styles.spacer}>
						<PlagueItem plague={pd.plague} percentage={pd.percentage} />
					</View>,
				);

				plagueDataList.push(pd);
			}
		}

		return plagueViews;
	}

	function showIndicatorHandler(toggle: boolean) {
		setShowIndicator(toggle);
	}

	return (
		<View>
			{showIndicator ? <WaitOverlay text="Carregando relatório..." /> : undefined}
			<Text style={styles.plagueTypeText}>TIPOS DE PRAGAS</Text>
			<View style={styles.viewStyle}>{buildPlagueViews()}</View>
			{props.field && (
				<View style={styles.buttonView}>
					<ShareButton text="COMPARTILHAR DIAGNÓSTICO" field={props.field} plagues={plagueDataList} onBusy={showIndicatorHandler} />
				</View>
			)}
		</View>
	);
}

const REM_SCALE = Dimensions.get('window').width / 3.3;

const styles = createTStyleSheet({
	viewStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
	},
	plagueTypeText: {
		color: '#78849E',
		fontSize: '14rem',
	},
	spacer: {
		width: REM_SCALE,
		maxHeight: 70,
	},
});
