import React from 'react';
import { useMainSelector } from '../../redux-things';
import { DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { View, FlatList, Text } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';

import { AgroXScreenProps } from '../navigation-types';
import { DefaultHeader } from '../00-common';
import { displayAlert, quotationNotAvailable } from '../../src/utils/alert-messages';
import { QuotationCard } from './quotation-card';
import { Tabs } from './tabs';
import { Models } from '../../models';
import { getQuotationsFromPackage } from '../../src/utils';

export function Quotations({ navigation }: AgroXScreenProps<'Quotations'>) {
	const tab = useMainSelector((state) => state.interactionData.quotation.currentTab);
	const quotationPackages = useMainSelector((state) => state.backendData.quotationPackages)!;
	// const quotationCheckouts = useMainSelector((state) => state.backendData.quotationCheckoutGroups)!.flat();

	const available: Models.quotation_package[] = [];
	const preparing: Models.quotation_package[] = [];

	for (const pkg of quotationPackages) {
		const quotations = getQuotationsFromPackage(pkg);
		if (quotations.every((quotation) => quotation.response_date !== null)) {
			available.push(pkg);
		} else if (quotations.some((quotation) => quotation.response_date === null)) preparing.push(pkg);
	}

	function compare(a: Models.quotation_package, b: Models.quotation_package) {
		if (a.code > b.code) return -1;
		if (b.code > a.code) return 1;
		return 0;
	}

	function getBottomComponent() {
		if ((tab === 'Preparing' ? preparing : available).length > 0)
			return (
				<View style={styles.listView}>
					<FlatList
						persistentScrollbar
						data={tab === 'Preparing' ? preparing.slice().sort(compare) : available.slice().sort(compare)}
						renderItem={({ item: pkg }) => (
							<QuotationCard
								quotation_package={pkg}
								onPress={() => {
									if (tab === 'Preparing') displayAlert(quotationNotAvailable);
									else navigation.navigate('PriceSelection', { quotationPackage: pkg });
								}}
							/>
						)}
						keyExtractor={(item) => item.id.toString()}
					/>
				</View>
			);

		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<MaterialCommunityIcons name="file-document-outline" style={styles.icon} />
				<Text style={styles.noQuotationText}>
					{' '}
					{tab === 'Preparing' ? 'Você ainda não realizou nenhum orçamento' : 'Nenhum orçamento está disponível ainda'}
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.mainView}>
			<DefaultHeader
				title="Meus Orçamentos"
				onDrawerPress={() => navigation.dispatch(DrawerActions.openDrawer())}
				onNotificationPress={() => navigation.navigate('Notifications')}
			/>
			<Tabs />
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
