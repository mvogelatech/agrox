import { createReducer } from '../../../tree-building-helpers';
import { State, Actions } from './state-and-actions';
export { State, Actions } from './state-and-actions';

const reducer = createReducer<State, Actions>(
	{
		pulverizationStartDate: undefined,
		pulverizationEndDate: undefined,
		fieldsWithMethods: undefined,
	},
	{
		CHANGE_START_DATE(prevState, action) {
			return {
				...prevState,
				pulverizationStartDate: action.pulverizationStartDate,
			};
		},
		CHANGE_END_DATE(prevState, action) {
			return {
				...prevState,
				pulverizationEndDate: action.pulverizationEndDate,
			};
		},
		CHANGE_FIELD_WITH_METHODS(prevState, action) {
			return {
				...prevState,
				fieldsWithMethods: action.fieldsWithMethods,
			};
		},
	},
);

export default reducer;
