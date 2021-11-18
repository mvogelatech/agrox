import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { AgroXScreenProps } from '../navigation-types';
import { RoundIcon } from '../00-common';
import { useBackButton } from '../../src/custom-hooks/use-back-button';
import { CompanyCard } from './company-card';
import { useMainSelector } from '../../redux-things';
import { PulverizationMethods } from '../../models';
import { colors } from '../../src/assets';

export function FeedbackCheckout({ navigation }: AgroXScreenProps<'FeedbackCheckout'>) {
	// Stop the user from going back
	useBackButton(() => {
		return 'CANCEL';
	}, []);
	const quotationCheckout = useMainSelector((state) => state.interactionData.quotationCheckout);

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
			<Text style={styles.mainText}>{`Contratação\nde Empresas de Pulverização\nRealizada com Sucesso!`}</Text>
			<Text style={styles.subText}>{`Em breve as empresas de pulverização\nentrarão em contato com você.\nAguarde!`}</Text>
			<Text style={styles.phones}>Telefones de contato das empresas :</Text>
			<View style={{ width: '100%' }}>
				{quotationCheckout.droneCheckout ? (
					<CompanyCard
						method={PulverizationMethods.DRONE}
						companyName={quotationCheckout.droneCheckout.quotation.company.name}
						companyPhone={quotationCheckout.droneCheckout.quotation.company.address.phone_number!}
					/>
				) : undefined}
				{quotationCheckout.planeCheckout ? (
					<CompanyCard
						method={PulverizationMethods.PLANE}
						companyName={quotationCheckout.planeCheckout.quotation.company.name}
						companyPhone={quotationCheckout.planeCheckout.quotation.company.address.phone_number!}
					/>
				) : undefined}
			</View>
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
	phones: {
		fontSize: '14rem',
		alignSelf: 'flex-start',
		textAlign: 'left',
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
