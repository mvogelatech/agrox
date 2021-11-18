import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { AgroXScreenProps } from '../navigation-types';
import { RoundIcon } from '../00-common';
import { useBackButton } from '../../src/custom-hooks/use-back-button';
import { colors } from '../../src/assets';

export function FeedbackQuotationReport({ navigation }: AgroXScreenProps<'FeedbackQuotation'>) {
	// Stop the user from going back
	useBackButton(() => {
		return 'CANCEL';
	}, []);

	return (
		<View style={styles.mainView}>
			<RoundIcon
				isEnabled
				icon="check"
				color={colors.lightBlue}
				size="60rem"
				iconSize="40rem"
				customIconStyle={{ marginLeft: '1rem', marginTop: '2rem' }}
			/>
			<Text style={styles.mainText}>Pedido de Contratação{'\n'} Enviado com Sucesso!</Text>
			<Text style={styles.subText}>{`Em breve você receberá o contato\nda equipe explore para detalhar\neste seviço.\nAguarde!`}</Text>
			<Button
				uppercase={false}
				disabled={false}
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonText}
				onPress={() => {
					navigation.reset({
						index: 0,
						routes: [{ name: 'Areas' }],
					});
				}}
			>
				Ok, entendi!
			</Button>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		paddingHorizontal: '24rem',
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	mainText: {
		marginTop: '24rem',
		fontSize: '18rem',
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: '25rem',
	},
	subText: {
		marginVertical: '32rem',
		fontSize: '16rem',
		textAlign: 'center',
		color: '#666666',
	},
	button: {
		height: '45rem',
		justifyContent: 'center',
		width: '100%',
		position: 'absolute',
		margin: '24rem',
		right: 0,
		bottom: 0,
	},
	buttonText: {
		fontSize: '14rem',
	},
});
