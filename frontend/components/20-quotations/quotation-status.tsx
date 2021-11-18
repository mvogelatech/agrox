import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type StatusType = 'preparing' | 'available';

type quotationStatusProps = {
	status: StatusType;
};
export function QuotationStatus(props: quotationStatusProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		statusText: {
			color: props.status === 'preparing' ? 'black' : '#469BA2',
		},
		icon: {
			color: props.status === 'preparing' ? 'black' : '#469BA2',
		},
	});
	return (
		<View style={styles.mainView}>
			<MaterialCommunityIcons name={props.status === 'preparing' ? 'file-document-edit-outline' : 'file-check-outline'} style={styles.icon} />
			<Text style={styles.statusText}>{props.status === 'available' ? 'Orçamento Disponível' : 'Preparando Orçamento'}</Text>
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statusText: {
		fontSize: '14rem',
		fontWeight: 'bold',
		marginLeft: '8rem',
		color: 'black',
	},
	icon: {
		fontSize: '22rem',
		color: 'black',
	},
});
