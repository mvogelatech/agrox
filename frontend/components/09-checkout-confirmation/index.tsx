import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { createTStyleSheet } from '../../src/utils/style';

import { AgroXScreenProps } from '../navigation-types';
import { Button } from 'react-native-paper';
import { displayAlert, displayTimeoutErrorSnackbar, needsToBeOnline } from '../../src/utils/alert-messages';
import { BackHeader } from '../00-common/back-header';
import { PulverizationMethods, Models } from '../../models';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { MainState, dispatch, useMainSelector, useIsOffline } from '../../redux-things';
import { CustomCheckbox } from '../00-common';
import { ky } from '../../src/network/ky';
import { QuotationDetails } from './quotation-details';
import { WaitOverlay } from '../00-common/wait-overlay';

async function postCheckout(checkout: MainState['interactionData']['quotationCheckout']) {
	let droneCheckout;
	let planeCheckout;
	if (checkout.droneCheckout) {
		droneCheckout = await ky
			.post('checkout', {
				json: {
					selectedPrice: checkout.droneCheckout.paymentMethod,
					quotationID: checkout.droneCheckout.quotation.id,
				},
			})
			.json<Models.quotation_checkout>();
	}

	if (checkout.planeCheckout) {
		planeCheckout = await ky
			.post('checkout', {
				json: {
					selectedPrice: checkout.planeCheckout.paymentMethod,
					quotationID: checkout.planeCheckout.quotation.id,
				},
			})
			.json<Models.quotation_checkout>();
	}

	// if (planeCheckout && droneCheckout) dispatch({ type: 'BACKEND_DATA__POSTED_NEW_CHECKOUT_GROUP', group: [droneCheckout, planeCheckout] });
	// else if (droneCheckout) dispatch({ type: 'BACKEND_DATA__POSTED_NEW_CHECKOUT_GROUP', group: [droneCheckout] });
	// else if (planeCheckout) dispatch({ type: 'BACKEND_DATA__POSTED_NEW_CHECKOUT_GROUP', group: [planeCheckout] });
	// else throw new Error('No checkout was dispatched');
}

export const CheckoutConfirmation = asAliveOnlyScreenComponent(({ navigation, route }: AgroXScreenProps<'CheckoutConfirmation'>) => {
	const quotationCheckout = useMainSelector((state) => state.interactionData.quotationCheckout);
	const [haveRead, setHaveRead] = React.useState(false);
	const isOnline = !useIsOffline();
	const [showIndicator, setShowIndicator] = useState(false);

	const L = (props: any) => (
		<Text style={{ textDecorationLine: 'underline', color: '#316DE3' }} onPress={() => navigation.navigate('TermsAndConditions')}>
			{props.children}
		</Text>
	);

	return (
		<View style={{ flex: 1 }}>
			{showIndicator ? <WaitOverlay text="Aguarde" /> : undefined}
			<BackHeader title="Confirmação" onBackPress={() => navigation.goBack()} onNotificationPress={() => navigation.navigate('Notifications')} />
			<View style={styles.mainView}>
				<View style={styles.contentView}>
					{quotationCheckout.droneCheckout ? (
						<QuotationDetails
							method={PulverizationMethods.DRONE}
							company={quotationCheckout.droneCheckout.quotation.company.id}
							paymentMethod={quotationCheckout.droneCheckout.paymentMethod}
							quotation={route.params.quotationPackage}
							onSeeMorePress={() =>
								navigation.navigate('QuotationDetails', {
									method: PulverizationMethods.DRONE,
									company: quotationCheckout.droneCheckout!.quotation.company.id,
									paymentMethod: quotationCheckout.droneCheckout!.paymentMethod,
									quotation: route.params.quotationPackage,
								})
							}
						/>
					) : undefined}
					{quotationCheckout.planeCheckout ? (
						<QuotationDetails
							method={PulverizationMethods.PLANE}
							company={quotationCheckout.planeCheckout.quotation.company.id}
							paymentMethod={quotationCheckout.planeCheckout.paymentMethod}
							quotation={route.params.quotationPackage}
							onSeeMorePress={() =>
								navigation.navigate('QuotationDetails', {
									method: PulverizationMethods.PLANE,
									company: quotationCheckout.planeCheckout!.quotation.company.id,
									paymentMethod: quotationCheckout.planeCheckout!.paymentMethod,
									quotation: route.params.quotationPackage,
								})
							}
						/>
					) : undefined}
				</View>
			</View>
			<View style={styles.bottomView}>
				<CustomCheckbox
					title={
						<View style={{ alignItems: 'flex-start' }}>
							<Text style={styles.checkboxText}>
								Declaro que aceito os <L>TERMOS E CONDIÇÕES</L> de contratação de pulverização com empresas homologadas.
							</Text>
						</View>
					}
					status={haveRead ? 'checked' : 'unchecked'}
					onPress={() => setHaveRead((haveRead) => !haveRead)}
				/>
				<Button
					uppercase={false}
					disabled={!haveRead}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={async () => {
						if (isOnline) {
							setShowIndicator(true);
							try {
								navigation.navigate('FeedbackCheckout');
								await postCheckout(quotationCheckout);
							} catch (error) {
								setShowIndicator(false);
								displayTimeoutErrorSnackbar(error, 'Post Checkout');
							}
						} else {
							displayAlert(needsToBeOnline);
						}
					}}
				>
					Contratar Empresa de Pulverização
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
	contentView: {},
	button: {
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		width: '100%',
	},
	bottomView: {
		alignItems: 'center',
		paddingHorizontal: '16rem',
		paddingTop: '24rem',
		backgroundColor: 'white',
	},
	checkboxText: {
		paddingLeft: '8rem',
		textAlign: 'justify',
		maxWidth: '95%',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
