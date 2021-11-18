import React from 'react';
import { View, Text } from 'react-native';
import { createTStyleSheet } from '../../../../src/utils/style';

import { CardTitle } from '../../../00-common/card-title';
import { useMainSelector } from '../../../../redux-things';
import { CloseableBottomCardProps } from '../closeable-bottom-card-props';
import { getLatestCrop, getAllFieldsAreaHA } from '../../../../src/utils';
import { Models } from '../../../../models';

function getFieldTypes(fields: Models.field[]) {
	const types = [];
	for (const field of fields) {
		const latestCrop = getLatestCrop(field);
		if (latestCrop) types.push(latestCrop.crop_type);
	}

	return types;
}

export function OverviewDetails(props: CloseableBottomCardProps) {
	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const cropTypes = getFieldTypes(area.field);

	return (
		<View style={styles.mainView}>
			<CardTitle text="Detalhes" titleIcon="info" onClose={props.onClose} />

			<View style={styles.contentView}>
				<View style={styles.columnsView}>
					<Text style={styles.header}>TIPO(S) DE PLANTIO</Text>
					<Text numberOfLines={3} style={styles.content}>
						{cropTypes.length === 0 ? '-' : [...new Set(cropTypes)].join(', ')}
					</Text>
				</View>

				<View style={styles.columnsView}>
					<Text style={styles.header}>ÁREA (HA)</Text>
					<Text numberOfLines={1} style={styles.content2}>
						{getAllFieldsAreaHA(area).toFixed(2)}
					</Text>
				</View>

				<View style={styles.columnsView}>
					<Text style={styles.header}>TALHÕES</Text>
					<Text numberOfLines={1} style={styles.content2}>
						{area.field.length}
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexDirection: 'column',
		alignItems: 'stretch',
		justifyContent: 'flex-end',
		backgroundColor: 'white',
	},
	contentView: {
		height: '100rem',
		marginTop: '16rem',
		marginHorizontal: '16rem',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	header: {
		fontSize: '14rem',
		color: '#78849E',
	},
	content: {
		fontSize: '14rem',
		color: '#6C6464',
	},
	content2: {
		fontSize: '28rem',
	},
	columnsView: {
		flexDirection: 'column',
		maxWidth: '140rem',
	},
});
