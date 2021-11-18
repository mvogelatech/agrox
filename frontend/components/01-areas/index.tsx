import React from 'react';
import { dispatch, useMainSelector } from '../../redux-things';
import { useFocusEffect, DrawerActions } from '@react-navigation/native';

import { AreaCard } from './area-card';
import { View, FlatList } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';

import { AgroXScreenProps } from '../navigation-types';
import { DefaultHeader } from '../00-common';

export function Areas({ navigation }: AgroXScreenProps<'Areas'>) {
	useFocusEffect(() => {
		dispatch({ type: 'CHANGE_AREA', area: undefined });
		dispatch({ type: 'CHANGE_GENERAL_TAB', tab: 'Overview' });
		dispatch({ type: 'CHANGE_GENERAL_CARD', card: 'Fields' });
		dispatch({ type: 'CHANGE_FIELD', field: undefined });
		dispatch({ type: 'SET_SERVICES_PULVERIZATION', state: false });
		dispatch({ type: 'CHANGE_QUOTATION_TAB', tab: 'Preparing' });
	});

	const areas = useMainSelector((state) => state.backendData.user?.many_user_has_many_farm[0].farm.area);

	return (
		<View style={styles.mainView}>
			<DefaultHeader
				title="Minhas Áreas"
				onDrawerPress={() => navigation.dispatch(DrawerActions.openDrawer())}
				onNotificationPress={() => navigation.navigate('Notifications')}
			/>
			<View style={styles.listView}>
				<FlatList
					data={areas}
					renderItem={({ item: area }) => (
						<AreaCard
							area={area}
							onPress={() => {
								dispatch({ type: 'CHANGE_AREA', area });
								navigation.navigate('General');
								// navigation.navigate('MenuService');
							}}
						/>
					)}
					keyExtractor={(item) => item.id.toString()}
				/>
			</View>
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
});
