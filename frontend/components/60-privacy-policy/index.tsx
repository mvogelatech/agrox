import React from 'react';
import { View } from 'react-native';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { AgroXScreenProps } from '../navigation-types';
import { BackHeader } from '../00-common/back-header';
import { Terms } from './terms';
import { useMainSelector } from '../../redux-things';

export const PrivacyPolicy = asAliveOnlyScreenComponent(({ navigation }: AgroXScreenProps<'PrivacyPolicy'>) => {
	const allTerms = useMainSelector((state) => state.backendData.privacyPolicy)!;
	const term = allTerms[0];
	return (
		<View style={{ flex: 1 }}>
			<BackHeader
				title="Política e Privacidade"
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<Terms terms={term} />
		</View>
	);
});
