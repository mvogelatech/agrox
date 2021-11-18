import React from 'react';
import { View } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { DrawerActions } from '@react-navigation/native';

import { ServiceCard } from './service-card';
import { DefaultHeader } from '../00-common';

import { AgroXScreenProps } from '../navigation-types';
import { useMainSelector } from '../../redux-things';

export function Services({ navigation }: AgroXScreenProps<'Services'>) {
	const companies = useMainSelector((state) => state.backendData.companies)!;
	return (
		<View style={{ flex: 1 }}>
			<DefaultHeader
				title="Serviços"
				onDrawerPress={() => navigation.dispatch(DrawerActions.openDrawer())}
				onNotificationPress={() => navigation.navigate('Notifications')}
			/>
			<View style={styles.mainView}>
				<ServiceCard
					isEnabled={companies.length > 0}
					text="Pulverização Aérea Geral"
					icon="plane"
					onPress={() => navigation.navigate('FieldSelectionFromServices')}
				/>
				<ServiceCard
					isEnabled={companies.length > 0}
					text="Pulverização por Drone"
					icon="drone"
					onPress={() => navigation.navigate('FieldSelectionFromServicesDrone')}
				/>
				<ServiceCard isEnabled={false} text="Pulverização Terrestre" icon="tractor" onPress={() => console.log('')} />
				<ServiceCard isEnabled={false} text="Falhas de Plantio" icon="brokenWeed" onPress={() => console.log('')} />
				<ServiceCard isEnabled={false} text="Contagem de Indivíduos" icon="weed" onPress={() => console.log('')} />
			</View>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		margin: '25rem',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-evenly',
	},
	appbar: {
		alignItems: 'center',
		fontWeight: 'bold',
	},
});
