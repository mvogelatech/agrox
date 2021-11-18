import { createReducer } from '../../tree-building-helpers';
import { State, Actions } from './state-and-actions';
export { State, Actions } from './state-and-actions';

const reducer = createReducer<State, Actions>(
	{ userId: null, userToken: null },
	{
		SET_AUTH_DATA_USER_ID(prevState, action) {
			return {
				userId: action.userId,
				userToken: prevState.userToken,
			};
		},
		SET_AUTH_DATA_USER_TOKEN(prevState, action) {
			return {
				userId: prevState.userId,
				userToken: action.userToken,
			};
		},
	},
);

export default reducer;
