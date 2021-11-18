import { createReducer } from '../../../tree-building-helpers';
import { State, Actions } from './state-and-actions';
export { State, Actions } from './state-and-actions';

const reducer = createReducer<State, Actions>(
	{
		currentCard: 'General',
	},
	{
		CHANGE_INFESTATION_CARD(prevState, action) {
			return {
				...prevState,
				currentCard: action.card,
			};
		},
	},
);

export default reducer;
