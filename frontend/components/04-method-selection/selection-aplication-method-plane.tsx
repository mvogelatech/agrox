import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';

import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';

import { ChoosableFieldCard } from './choosable-field-card-method';

import { ScrollView } from 'react-native-gesture-handler';
import { ClosableHeader } from '../00-common';

import { AgroXScreenProps } from '../navigation-types';
import { confirmQuotationLeave } from '../../src/utils/alert-messages';

type ScreenProps = AgroXScreenProps<'MethodSelection'>;

export const MethodSelectionPlane = asAliveOnlyScreenComponent(({ navigation }: ScreenProps) => {
	return (
		<View style={{ flex: 1 }}>
			<ClosableHeader
				onClose={() => {
					void confirmQuotationLeave(navigation);
				}}
			/>

			<View style={styles.mainView}>
				<Text style={styles.titleText}>{`Selecione o(s) tipo(s)  de \naplicação que você deseja fazer`}</Text>
				<ScrollView>
					<View style={styles.listView}>
						<ChoosableFieldCard />
					</View>
				</ScrollView>
				<Button
					uppercase={false}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={async () => {
						navigation.navigate('DateSelectionPlane');
					}}
				>
					Continuar
				</Button>
			</View>
		</View>
	);
});

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		paddingHorizontal: '16rem',
		backgroundColor: 'white',
	},
	titleText: {
		paddingLeft: '8rem',
		paddingVertical: '8rem',
		fontSize: '23rem',
	},

	listView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginHorizontal: '2rem',
	},
	button: {
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		width: '100%',
	},
	subtitle: {
		fontSize: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selected: {
		fontSize: '12rem',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#78849E',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
