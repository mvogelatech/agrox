import { createReducer } from '../../../tree-building-helpers';
import { State, Actions } from './state-and-actions';
export { State, Actions } from './state-and-actions';

const reducer = createReducer<State, Actions>(
	{
		droneCheckout: undefined,
		planeCheckout: undefined,
		quotationPackage: undefined,
	},
	{
		SET_QUOTATION_CHECKOUT(prevState, action) {
			return action.checkout;
		},
	},
);

export default reducer;
