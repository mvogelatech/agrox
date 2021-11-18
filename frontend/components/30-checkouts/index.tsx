import React from 'react';
import { useMainSelector } from '../../redux-things';
import { DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { View, FlatList, Text } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';

import { AgroXScreenProps } from '../navigation-types';
import { DefaultHeader } from '../00-common';
import { CheckoutCard } from './checkout-card';

export function Checkouts({ navigation }: AgroXScreenProps<'Checkouts'>) {
	const quotationCheckoutsGroups = useMainSelector((state) => state.backendData.quotationCheckoutGroups)!;
	function getBottomComponent() {
		if (quotationCheckoutsGroups.length > 0)
			return (
				<View style={styles.mainView}>
					<View style={styles.listView}>
						<FlatList
							persistentScrollbar
							data={quotationCheckoutsGroups}
							renderItem={({ item: group }) => (
								<CheckoutCard quoation_checkout_group={group} onPress={() => navigation.navigate('CheckoutDetails', { checkoutGroup: group })} />
							)}
							keyExtractor={(item) => item[0].id.toString()}
						/>
					</View>
				</View>
			);

		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<MaterialCommunityIcons name="file-document-outline" style={styles.icon} />
				<Text style={styles.noQuotationText}>Você ainda não realizou nenhuma contratação</Text>
			</View>
		);
	}

	return (
		<View style={styles.mainView}>
			<DefaultHeader
				title="Histórico de Contratações"
				onDrawerPress={() => navigation.dispatch(DrawerActions.openDrawer())}
				onNotificationPress={() => navigation.navigate('Notifications')}
			/>

			{getBottomComponent()}
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
	},
	listView: {
		flex: 1,
		marginVertical: '8rem',
	},
	icon: {
		fontSize: '80rem',
		color: '#D5D5DA',
	},
	noQuotationText: {
		marginTop: '16rem',
		color: '#78849E',
		fontWeight: 'bold',
	},
});
