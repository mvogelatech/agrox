import React, { useRef } from 'react';
import { View, FlatList } from 'react-native';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useMainSelector } from '../../redux-things';
import { BackHeader } from '../00-common/back-header';
import { InformationTable } from './information-table';
import { AgroXScreenProps } from '../navigation-types';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { Models } from '../../models';
import { scrollToEndAndBack } from '../../src/utils';

dayjs.extend(isSameOrAfter);

export const CheckoutDetails = asAliveOnlyScreenComponent(({ navigation, route }: AgroXScreenProps<'CheckoutDetails'>) => {
	const quotationPackages = useMainSelector((state) => state.backendData.quotationPackages)!;
	function findQuotationPackageById(id: number) {
		for (const pkg of quotationPackages) if (pkg.id === id) return pkg;
	}

	function getFieldsByCheckout(checkout: Models.quotation_checkout) {
		const quotationPackage = findQuotationPackageById(checkout.quotation!.quotation_modal_package.quotation_package.id);
		for (const modal of quotationPackage!.quotation_modal_package)
			if (modal.pulverization_method === checkout.quotation!.quotation_modal_package.pulverization_method) return modal.field;
		throw new Error('No field was found with using this checkout on the desired quotation package');
	}

	const flatListRef = useRef<FlatList>(null);
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<BackHeader
				title={`Pulverização ${route.params.checkoutGroup[0].quotation!.quotation_modal_package.quotation_package.code}`}
				onBackPress={() => navigation.goBack()}
				onNotificationPress={() => navigation.navigate('Notifications')}
			/>

			<FlatList
				ref={flatListRef}
				persistentScrollbar
				data={route.params.checkoutGroup}
				renderItem={({ item: checkout }) => (
					<InformationTable
						key={checkout.id.toString()}
						method={checkout.quotation!.quotation_modal_package.pulverization_method}
						company={checkout.quotation!.company_id}
						paymentMethod={checkout.selected_price === 0 ? 'antecipated_price' : checkout.selected_price === 1 ? 'cash_price' : 'delayed_price'}
						quotation={findQuotationPackageById(checkout.quotation!.quotation_modal_package.quotation_package.id)!}
						onDetailsPress={() => {
							navigation.navigate('Details', {
								method: checkout.quotation!.quotation_modal_package.pulverization_method,
								fields: getFieldsByCheckout(checkout),
							});
						}}
					/>
				)}
				keyExtractor={(item) => item.id.toString()}
				onLayout={() => scrollToEndAndBack(flatListRef, 'flatlist')}
			/>
		</View>
	);
});
