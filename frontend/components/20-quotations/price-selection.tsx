import React, { useRef } from 'react';
import { dispatch, useMainSelector } from '../../redux-things';

import { View, Image, Text, ScrollView } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';

import { AgroXScreenProps } from '../navigation-types';
import { userDidNotSelectPaymentMethod, asyncCancelableAlert } from '../../src/utils/alert-messages';
import { BackHeader } from '../00-common/back-header';
import { Models, PulverizationMethods, PulverizationMethod, PaymentMethod } from '../../models';
import { formatDate, getLatestDiagnosis, scrollToEndAndBack } from '../../src/utils';
import { QuotationMethod } from './quotation-method';
import { images } from '../../src/assets';
import { Divider, RadioButton, FAB } from 'react-native-paper';
import { Accordion } from '../00-common';
import { PriceSelector } from './price-selector';
import dayjs from 'dayjs';

function haversineDistance(lat1: number, long1: number, lat2: number, long2: number) {
	const R = 6371e3; // meters
	const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((long2 - long1) * Math.PI) / 180;

	const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c; // in meters
	return (d / 1000).toFixed(0);
}

export const PriceSelection = asAliveOnlyScreenComponent(({ navigation, route }: AgroXScreenProps<'PriceSelection'>) => {
	const farm = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm)!;

	const planeFields: Models.field[] = [];
	const droneFields: Models.field[] = [];

	route.params.quotationPackage.quotation_modal_package.map((modal) =>
		modal.field.forEach((field) => (modal.pulverization_method === PulverizationMethods.DRONE ? droneFields.push(field) : planeFields.push(field))),
	);

	const [expandedAccordions, setExpandedAccordions] = React.useState(new Set());

	const [dronePaymentMethod, setDronePaymentMethod] = React.useState<PaymentMethod>(undefined);
	const [droneQuotation, setDroneQuotation] = React.useState<Models.quotation | undefined>(undefined);

	const [planePaymentMethod, setPlanePaymentMethod] = React.useState<PaymentMethod>(undefined);
	const [planeQuotation, setPlaneQuotation] = React.useState<Models.quotation | undefined>(undefined);

	function CompaniesAccordion(props: { quotation: Models.quotation; modal: PulverizationMethod }) {
		function setSelection(method: PaymentMethod) {
			if (props.modal === PulverizationMethods.DRONE) {
				if (method === dronePaymentMethod) {
					setDroneQuotation(undefined);
					setDronePaymentMethod(undefined);
				} else {
					setDroneQuotation(props.quotation);
					setDronePaymentMethod(method);
				}
			} else if (method === planePaymentMethod) {
				setPlaneQuotation(undefined);
				setPlanePaymentMethod(undefined);
			} else {
				setPlaneQuotation(props.quotation);
				setPlanePaymentMethod(method);
			}
		}

		let isChosen = false;
		if (props.modal === PulverizationMethods.DRONE) {
			if (props.quotation === droneQuotation) isChosen = true;
		} else if (props.quotation === planeQuotation) isChosen = true;

		return (
			<Accordion
				key={props.quotation.company.name.toString()}
				isExpanded={expandedAccordions.has(`${props.modal}_${props.quotation.company.name}`)}
				title={props.quotation.company.name}
				// TODO: Change here to be the smallest distance
				subtitle={`${haversineDistance(farm.lat, farm.long, props.quotation.company.lat, props.quotation.company.long)} km de distância`}
				divider={<Divider style={styles.mainDivider} />}
				titleRight={isChosen ? <Text style={styles.recommendedText}>ESCOLHIDO</Text> : undefined}
				onPress={() => {
					setExpandedAccordions((expandedAccordions) => {
						if (expandedAccordions.has(`${props.modal}_${props.quotation.company.name}`))
							expandedAccordions.delete(`${props.modal}_${props.quotation.company.name}`);
						else expandedAccordions.add(`${props.modal}_${props.quotation.company.name}`);
						return new Set(expandedAccordions);
					});
				}}
			>
				<View style={styles.accordionContentView}>
					<PriceSelector method="antecipated_price" quotation={props.quotation} onPress={setSelection} />
					<Divider style={styles.mainDivider} />
					<PriceSelector method="cash_price" quotation={props.quotation} onPress={setSelection} />
					<Divider style={styles.mainDivider} />
					<PriceSelector method="delayed_price" quotation={props.quotation} onPress={setSelection} />
					<Divider style={styles.mainDivider} />
					<Text style={styles.expiration}>Orçamento válido até: {formatDate(props.quotation.expiration_date ?? dayjs().toISOString())}</Text>
				</View>
			</Accordion>
		);
	}

	const scrollViewRef = useRef<ScrollView>(null);
	return (
		<View style={styles.mainView}>
			<BackHeader
				title={`Orçamento ${route.params.quotationPackage.code.toString()}`}
				onBackPress={() => navigation.goBack()}
				onNotificationPress={() => navigation.navigate('Notifications')}
			/>
			<ScrollView ref={scrollViewRef} style={styles.contentView} onLayout={() => scrollToEndAndBack(scrollViewRef, 'scrollview')}>
				{route.params.quotationPackage.quotation_modal_package.some((modal) => modal.pulverization_method === PulverizationMethods.DRONE) ? (
					<View style={styles.methodView}>
						<QuotationMethod
							method="drone"
							isHideDetailsButton={!getLatestDiagnosis(droneFields[0])}
							onDetailsPress={() => {
								navigation.navigate('Details', {
									fields: droneFields,
									method: PulverizationMethods.DRONE,
								});
							}}
						/>

						<View style={styles.logoView}>
							<Text style={styles.homologated}>EMPRESAS HOMOLOGADAS</Text>
							<Image source={images.croppedLogo} resizeMode="contain" style={styles.logo} />
						</View>
						<View style={styles.accordionsView}>
							<RadioButton.Group
								value={droneQuotation && dronePaymentMethod ? `${droneQuotation.company_id}_${dronePaymentMethod}` : ''}
								onValueChange={() => console.log('')}
							>
								{route.params.quotationPackage.quotation_modal_package.map((modal) =>
									modal.pulverization_method === PulverizationMethods.DRONE
										? modal.quotation.map((quotation) => {
												return <CompaniesAccordion key={quotation.id.toString()} quotation={quotation} modal={PulverizationMethods.DRONE} />;
										  })
										: undefined,
								)}
							</RadioButton.Group>
						</View>
					</View>
				) : undefined}

				{route.params.quotationPackage.quotation_modal_package.some((modal) => modal.pulverization_method === PulverizationMethods.PLANE) ? (
					<View style={styles.methodView}>
						<QuotationMethod
							method="plane"
							isHideDetailsButton={!getLatestDiagnosis(planeFields[0])}
							onDetailsPress={() => {
								navigation.navigate('Details', {
									fields: planeFields,
									method: PulverizationMethods.PLANE,
								});
							}}
						/>

						<View style={styles.logoView}>
							<Text style={styles.homologated}>EMPRESAS HOMOLOGADAS</Text>
							<Image source={images.croppedLogo} resizeMode="contain" style={styles.logo} />
						</View>
						<View style={styles.accordionsView}>
							<RadioButton.Group
								value={planeQuotation && planePaymentMethod ? `${planeQuotation.company_id}_${planePaymentMethod}` : ''}
								onValueChange={() => console.log('')}
							>
								{route.params.quotationPackage.quotation_modal_package.map((modal) =>
									modal.pulverization_method === PulverizationMethods.PLANE
										? modal.quotation.map((quotation) => {
												return <CompaniesAccordion key={quotation.id.toString()} quotation={quotation} modal={PulverizationMethods.PLANE} />;
										  })
										: undefined,
								)}
							</RadioButton.Group>
						</View>
					</View>
				) : undefined}
			</ScrollView>
			{dronePaymentMethod || planePaymentMethod ? (
				// eslint-disable-next-line  react/jsx-pascal-case
				<FAB
					style={styles.fab}
					label="CONTINUAR"
					icon=""
					onPress={async () => {
						const droneSelected = droneQuotation && dronePaymentMethod;
						const planeSelected = planeQuotation && planePaymentMethod;

						if ((planeFields.length > 0 && !planeSelected) || (droneFields.length > 0 && !droneSelected)) {
							userDidNotSelectPaymentMethod.body = `Você não selecionou uma empresa para pulverização por ${
								planeSelected ? 'Drone' : 'Avião'
							}.\n\nTem certeza que deseja prosseguir?\n\nEssa ação não poderá ser desfeita.`;

							const response = await asyncCancelableAlert(userDidNotSelectPaymentMethod);
							if (response !== 'CONFIRM') {
								return;
							}
						}

						dispatch({
							type: 'SET_QUOTATION_CHECKOUT',
							checkout: {
								droneCheckout: droneSelected ? { quotation: droneQuotation!, paymentMethod: dronePaymentMethod! } : undefined,
								planeCheckout: planeSelected ? { quotation: planeQuotation!, paymentMethod: planePaymentMethod! } : undefined,
								quotationPackage: route.params.quotationPackage,
							},
						});

						navigation.navigate('CheckoutConfirmation', {
							quotationPackage: route.params.quotationPackage,
						});
					}}
				/>
			) : undefined}
		</View>
	);
});

const styles = createTStyleSheet({
	fab: {
		position: 'absolute',
		margin: '16rem',
		right: 0,
		bottom: 0,
	},
	mainView: {
		flex: 1,
		backgroundColor: 'white',
	},
	methodView: {
		paddingBottom: '64rem',
		backgroundColor: 'white',
	},
	contentView: {
		flex: 1,
	},
	accordionsView: {
		paddingHorizontal: '8rem',
	},
	accordionContentView: {
		justifyContent: 'flex-start',
		width: '100%',
		paddingHorizontal: '8rem',
	},
	mainDivider: {
		width: '100%',
		height: '1rem',
	},
	logoView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: '24rem',
	},
	$logoSize: '110rem',
	logo: {
		width: '$logoSize',
		height: '$logoSize/4',
		tintColor: '#327387',
	},
	homologated: {
		fontSize: '11rem',
		color: '#78849E',
		marginRight: '16rem',
	},
	subtitle: {
		fontSize: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	subSubtitle: {
		fontSize: '10rem',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#78849E',
	},
	expiration: {
		marginTop: '8rem',
		fontSize: '13rem',
		fontStyle: 'italic',
	},
	recommendedText: {
		paddingVertical: '2rem',
		paddingHorizontal: '6rem',
		fontSize: '9.5rem',
		backgroundColor: '#469BA2',
		fontWeight: 'bold',
		borderRadius: '6rem',
		color: 'white',
	},
});
