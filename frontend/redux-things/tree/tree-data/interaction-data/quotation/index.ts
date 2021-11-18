import { createReducer } from '../../../tree-building-helpers';
import { State, Actions } from './state-and-actions';
export { State, Actions } from './state-and-actions';

const reducer = createReducer<State, Actions>(
	{
		currentTab: 'Preparing',
	},
	{
		CHANGE_QUOTATION_TAB(prevState, action) {
			return {
				...prevState,
				currentTab: action.tab,
			};
		},
	},
);

export default reducer;
