import { combineReducers } from 'redux';
import { MergeActionSpecs } from '../../tree-building-helpers';

import generalReducer, { State as GeneralState, Actions as GeneralActions } from './general';
import infestationReducer, { State as InfestationState, Actions as InfestationActions } from './infestation';
import newQuotationReducer, { State as NewQuotationState, Actions as NewQuotationActions } from './new-quotation';
import quotationReducer, { State as QuotationState, Actions as QuotationActions } from './quotation';
import quotationCheckoutReducer, { State as QuotationCheckoutState, Actions as QuotationCheckoutActions } from './quotation-checkout';

export type State = {
	general: GeneralState;
	infestation: InfestationState;
	newQuotation: NewQuotationState;
	quotation: QuotationState;
	quotationCheckout: QuotationCheckoutState;
};

export type Actions = MergeActionSpecs<[GeneralActions, InfestationActions, NewQuotationActions, QuotationActions, QuotationCheckoutActions]>;

const reducer = combineReducers({
	general: generalReducer,
	infestation: infestationReducer,
	newQuotation: newQuotationReducer,
	quotation: quotationReducer,
	quotationCheckout: quotationCheckoutReducer,
});

export default reducer;
