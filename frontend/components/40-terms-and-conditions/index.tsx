import React from 'react';
import { View } from 'react-native';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { AgroXScreenProps } from '../navigation-types';
import { BackHeader } from '../00-common/back-header';
import { Terms } from './terms';
import { useMainSelector } from '../../redux-things';

export const TermsAndConditions = asAliveOnlyScreenComponent(({ navigation }: AgroXScreenProps<'TermsAndConditions'>) => {
	const allTerms = useMainSelector((state) => state.backendData.terms)!;
	const term = allTerms[0];
	return (
		<View style={{ flex: 1 }}>
			<BackHeader
				title="Termos e Condições"
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<Terms term={term} />
		</View>
	);
});
