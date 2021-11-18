import React from 'react';
import { dispatch, useMainSelector } from '../../redux-things';
import { View } from 'react-native';
import { TabButton } from './tab-button';
import { Divider } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';

export function Tabs() {
	// const field = useMainSelector((state) => state.interactionData.general.currentField);
	const tab = useMainSelector((state) => state.interactionData.quotation.currentTab);

	return (
		<View style={styles.default}>
			<TabButton
				isSelected={tab === 'Preparing'}
				icon="file-document-edit-outline"
				text="EM PREPARAÇÃO"
				onPress={() => {
					dispatch({ type: 'CHANGE_QUOTATION_TAB', tab: 'Preparing' });
				}}
			/>
			<Divider style={styles.divider} />
			<TabButton
				isSelected={tab === 'Available'}
				icon="file-check-outline"
				text="DISPONÍVEIS"
				onPress={() => {
					dispatch({ type: 'CHANGE_QUOTATION_TAB', tab: 'Available' });
				}}
			/>
		</View>
	);
}

const styles = createTStyleSheet({
	default: {
		backgroundColor: '#fff',
		flexDirection: 'row',
	},
	divider: {
		width: '1rem',
		height: '50rem',
		backgroundColor: 'black',
	},
});
