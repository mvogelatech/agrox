import { DrawerScreenProps } from '@react-navigation/drawer';
import { Models, PulverizationMethod, PaymentMethod } from '../models';

export type RootDrawerParamList = {
	Areas: undefined;
	Services: undefined;
	Quotations: undefined;
	Checkouts: undefined;
	PriceSelection: {
		quotationPackage: Models.quotation_package;
	};
	AreaStackContainer: undefined;
	General: undefined;
	FieldSelectionFromGeneral: undefined;
	FieldSelectionFromServices: undefined;
	FieldSelectionFromServicesDrone: undefined;
	MethodSelectionPlane: undefined;
	MethodSelectionDrone: undefined;
	FieldSelectionFromServicesReport: undefined;
	MethodSelection: {
		selectedFields: Models.field[];
	};
	MethodSelectionReport: {
		selectedFields: Models.field[];
	};
	QuotationSummary: undefined;
	QuotationSummaryDrone: undefined;
	QuotationSummaryPlane: undefined;
	Details: {
		fields: Models.field[];
		method: PulverizationMethod;
	};
	DateSelection: undefined;
	IncludeRecord: undefined;
	MenuService: undefined;
	DateSelectionDrone: undefined;
	DateSelectionPlane: undefined;
	PragueSelection: undefined;
	FeedbackQuotation: undefined;
	CompaniesList: undefined;
	CheckoutConfirmation: {
		quotationPackage: Models.quotation_package;
	};
	FeedbackCheckout: undefined;
	FeedbackQuotationReport: undefined;
	TermsAndConditions: undefined;
	PrivacyPolicy: undefined;
	QuotationDetails: {
		method: PulverizationMethod;
		company: number;
		paymentMethod: PaymentMethod;
		quotation: Models.quotation_package;
	};
	CheckoutDetails: {
		checkoutGroup: Models.quotation_checkout_group;
	};
	Notifications?: {
		fromPushNotification: Models.notification;
	};
	HireDiagnostic: undefined;
	HiringReview: {
		selectedFields: Models.field[];
	};
	FeedbackDiagnostic: undefined;
};

type RootDrawerScreens = keyof RootDrawerParamList;

export type AgroXScreenProps<T extends RootDrawerScreens = RootDrawerScreens> = DrawerScreenProps<RootDrawerParamList, T>;

export type NavigationFunction<T extends RootDrawerScreens = RootDrawerScreens> = AgroXScreenProps<T>['navigation']['navigate'];
