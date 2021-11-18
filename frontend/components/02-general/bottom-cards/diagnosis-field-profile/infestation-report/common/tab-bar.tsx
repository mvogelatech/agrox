import React from 'react';
import { View } from 'react-native';

import { dispatch, useMainSelector } from '../../../../../../redux-things';
import { Tab } from './tab-button';

export function TabBar() {
	const card = useMainSelector((state) => state.interactionData.infestation.currentCard);

	return (
		<View style={{ flexDirection: 'row' }}>
			<Tab
				isSelected={card === 'General'}
				text="GERAL"
				onPress={() => {
					dispatch({ type: 'CHANGE_INFESTATION_CARD', card: 'General' });
				}}
			/>
			<Tab
				isSelected={card === 'Prescription'}
				text="RECEITUÁRIO"
				onPress={() => {
					dispatch({ type: 'CHANGE_INFESTATION_CARD', card: 'Prescription' });
				}}
			/>
			<Tab
				isSelected={card === 'Pulverization'}
				text="PULVERIZAÇÃO"
				onPress={() => {
					dispatch({ type: 'CHANGE_INFESTATION_CARD', card: 'Pulverization' });
				}}
			/>
		</View>
	);
}
