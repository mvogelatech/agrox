import { combineReducers } from 'redux';
import { MergeActionSpecs, GlobalResetActionSpec } from './tree-building-helpers';

import authDataReducer, { State as AuthDataState, Actions as AuthDataActions } from './tree-data/auth-data';
import backendDataReducer, { State as BackendDataState, Actions as BackendDataActions } from './tree-data/backend-data';
import interactionDataReducer, { State as InteractionDataState, Actions as InteractionDataActions } from './tree-data/interaction-data';

export type State = {
	authData: AuthDataState;
	backendData: BackendDataState;
	interactionData: InteractionDataState;
};

export const persistList: Array<keyof State> = ['authData', 'backendData'];

export type Actions = MergeActionSpecs<[GlobalResetActionSpec, AuthDataActions, BackendDataActions, InteractionDataActions]>;

const reducer = combineReducers({
	authData: authDataReducer,
	backendData: backendDataReducer,
	interactionData: interactionDataReducer,
});

export default reducer;
