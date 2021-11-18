import { NDVI } from '../../../../../models';
import { createReducer } from '../../../tree-building-helpers';
import { State, Actions } from './state-and-actions';
export { State, Actions } from './state-and-actions';

const reducer = createReducer<State, Actions>(
	{
		currentTab: 'Overview',
		currentCard: 'Fields',
		currentArea: undefined,
		currentField: undefined,
		selectedFields: new Set(),
		servicesPulverization: false,
		indicesCurrentTab: NDVI,
		indicesCurrentDate: undefined,
	},
	{
		CHANGE_AREA(prevState, action) {
			return {
				...prevState,
				currentArea: action.area,
			};
		},
		CHANGE_FIELD(prevState, action) {
			return {
				...prevState,
				currentField: action.field,
			};
		},
		CHANGE_GENERAL_CARD(prevState, action) {
			return {
				...prevState,
				currentCard: action.card,
			};
		},
		CHANGE_GENERAL_TAB(prevState, action) {
			return {
				...prevState,
				currentTab: action.tab,
			};
		},
		CHANGE_SELECTED_FIELDS(prevState, action) {
			return {
				...prevState,
				selectedFields: action.selectedFields,
			};
		},
		SET_SERVICES_PULVERIZATION(prevState, action) {
			return {
				...prevState,
				servicesPulverization: action.state,
			};
		},
		CHANGE_INDICES_TAB(prevState, action) {
			return {
				...prevState,
				indicesCurrentTab: action.tab,
			};
		},
		CHANGE_INDICES_DATE(prevState, action) {
			return {
				...prevState,
				indicesCurrentDate: action.indexDate,
			};
		},
	},
);

export default reducer;
