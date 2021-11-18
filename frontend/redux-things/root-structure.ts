import { combineReducers } from 'redux';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { persistReducer } from 'redux-persist';
import createReduxPersistCompressTransform from 'redux-persist-transform-compress';

import { reducer as networkReducer } from 'react-native-offline';
import type { NetworkState } from 'react-native-offline/dist/src/types';

import mainTreeReducer, { persistList as mainTreeStatesToPersist, State as MainState } from './tree';

export type RootReduxState = {
	// TODO: Improve this TypeScript definition to enforce this object has the same structure as `rootReducerWithPersist`.
	mainTree: MainState;
	network: NetworkState;
};

// TODO: Check when and how data should be persisted (ex. updating the app)
export const rootReducerWithPersist = combineReducers({
	mainTree: persistReducer(
		{
			key: 'mainTree',
			keyPrefix: 'agroexplore', // The key prefix can be anything matching \w+, it's here to override the default which has a colon
			storage: ExpoFileSystemStorage,
			whitelist: mainTreeStatesToPersist,
			timeout: 0,
			transforms: [createReduxPersistCompressTransform()],
		},
		mainTreeReducer,
	),
	network: networkReducer,
});
