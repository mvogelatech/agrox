import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './drawer-content';

import { useMainSelector } from '../redux-things';

import { Areas } from './01-areas';
import { General } from './02-general';
import { FieldSelectionFromServices } from './03-field-selection/from-services';
import { FieldSelectionFromServicesDrone } from './03-field-selection/from-services-drone';
import { FieldSelectionFromServicesReport } from './03-field-selection/from-services-report';
import { FieldSelectionFromGeneral } from './03-field-selection/from-general';
import { MethodSelection } from './04-method-selection';
import { MethodSelectionPlane } from './04-method-selection/selection-aplication-method-plane';
import { MethodSelectionDrone } from './04-method-selection/selection-aplication-method-drone';
import { MethodSelectionReport } from './04-method-selection/index-report';
import { DateSelection } from './05-date-selection';
import { DateSelectionDrone } from './05-date-selection/index-drone';
import { DateSelectionPlane } from './05-date-selection/index-plane';
import { PragueSelection } from './12-prague-selection';
import { QuotationSummary } from './06-quotation-summary';
import { QuotationSummaryDrone } from './06-quotation-summary/index-drone';
import { QuotationSummaryPlane } from './06-quotation-summary/index-plane';
import { FeedbackQuotation } from './07-feedback-quotation';
import { FeedbackQuotationReport } from './07-feedback-quotation/index-report';
import { Details } from './08-details';
import { CheckoutConfirmation } from './09-checkout-confirmation';
import { FeedbackCheckout } from './11-feedback-checkout';
import { Quotations } from './20-quotations';
import { PriceSelection } from './20-quotations/price-selection';
import { Checkouts } from './30-checkouts';
import { TermsAndConditions } from './40-terms-and-conditions';
import { Notifications } from './50-notifications';
import { PrivacyPolicy } from './60-privacy-policy';
import { Services } from './99-services';

import { HireDiagnostic } from './hire-diagnostic';
import { HiringReview } from './hiring-review';
import { FeedbackDiagnostic } from './feedback-diagnostic';

import { RootDrawerParamList } from './navigation-types';
import { QuotationDetails } from './09-checkout-confirmation/details';
import { CheckoutDetails } from './30-checkouts/checkout-details';
import { IncludeRecord } from './70-include-record';
import { MenuService } from './80-menu-service';

const RootDrawer = createDrawerNavigator<RootDrawerParamList>();

export function RootDrawerContainer() {
	const user = useMainSelector((state) => state.backendData.user)!;

	return (
		// See https://stackoverflow.com/q/60915266/4135063
		<RootDrawer.Navigator initialRouteName="Areas" drawerContent={(props) => <DrawerContent user={user} {...props} />} drawerStyle={{ width: '75%' }}>
			{/* <RootDrawer.Navigator initialRouteName="MenuService"> */}
			<RootDrawer.Screen name="Areas" component={Areas} />
			<RootDrawer.Screen name="Quotations" component={Quotations} />
			<RootDrawer.Screen name="Checkouts" component={Checkouts} />
			<RootDrawer.Screen name="Services" component={Services} />
			<RootDrawer.Screen name="TermsAndConditions" component={TermsAndConditions} />
			<RootDrawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
			<RootDrawer.Screen name="Notifications" component={Notifications} />

			<RootDrawer.Screen name="PriceSelection" component={PriceSelection} />
			<RootDrawer.Screen name="CheckoutDetails" component={CheckoutDetails} />

			<RootDrawer.Screen name="General" component={General} />
			<RootDrawer.Screen name="FieldSelectionFromGeneral" component={FieldSelectionFromGeneral} />
			<RootDrawer.Screen name="FieldSelectionFromServicesDrone" component={FieldSelectionFromServicesDrone} />
			<RootDrawer.Screen name="FieldSelectionFromServicesReport" component={FieldSelectionFromServicesReport} />
			<RootDrawer.Screen name="FieldSelectionFromServices" component={FieldSelectionFromServices} />
			<RootDrawer.Screen name="MethodSelectionPlane" component={MethodSelectionPlane} />
			<RootDrawer.Screen name="MethodSelectionDrone" component={MethodSelectionDrone} />
			<RootDrawer.Screen name="MethodSelection" component={MethodSelection} />
			<RootDrawer.Screen name="MethodSelectionReport" component={MethodSelectionReport} />
			<RootDrawer.Screen name="DateSelection" component={DateSelection} />
			<RootDrawer.Screen name="DateSelectionDrone" component={DateSelectionDrone} />
			<RootDrawer.Screen name="DateSelectionPlane" component={DateSelectionPlane} />
			<RootDrawer.Screen name="PragueSelection" component={PragueSelection} />
			<RootDrawer.Screen name="QuotationSummary" component={QuotationSummary} />
			<RootDrawer.Screen name="QuotationSummaryDrone" component={QuotationSummaryDrone} />
			<RootDrawer.Screen name="QuotationSummaryPlane" component={QuotationSummaryPlane} />
			<RootDrawer.Screen name="Details" component={Details} />
			<RootDrawer.Screen name="FeedbackQuotation" component={FeedbackQuotation} />
			<RootDrawer.Screen name="FeedbackQuotationReport" component={FeedbackQuotationReport} />

			<RootDrawer.Screen name="CheckoutConfirmation" component={CheckoutConfirmation} />
			<RootDrawer.Screen name="QuotationDetails" component={QuotationDetails} />
			<RootDrawer.Screen name="FeedbackCheckout" component={FeedbackCheckout} />

			<RootDrawer.Screen name="HireDiagnostic" component={HireDiagnostic} />
			<RootDrawer.Screen name="HiringReview" component={HiringReview} />
			<RootDrawer.Screen name="FeedbackDiagnostic" component={FeedbackDiagnostic} />
			<RootDrawer.Screen name="IncludeRecord" component={IncludeRecord} />
			<RootDrawer.Screen name="MenuService" component={MenuService} />
		</RootDrawer.Navigator>
	);
}
