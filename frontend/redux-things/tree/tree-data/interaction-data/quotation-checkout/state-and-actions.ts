import { Models, PaymentMethod } from '../../../../../models';
import { BuildActionSpec } from '../../../tree-building-helpers';

export type State = {
	droneCheckout?: {
		quotation: Models.quotation;
		paymentMethod: PaymentMethod;
	};
	planeCheckout?: {
		quotation: Models.quotation;
		paymentMethod: PaymentMethod;
	};
	quotationPackage?: Models.quotation_package;
};

export type Actions = BuildActionSpec<
	[
		{
			type: 'SET_QUOTATION_CHECKOUT';
			checkout: State;
		},
	]
>;
