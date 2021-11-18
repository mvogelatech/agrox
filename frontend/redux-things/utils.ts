import { useSelector } from 'react-redux';
import { State as MainState, Actions as MainTreeActions } from './tree';
import { store } from './store';
import { RootReduxState } from './root-structure';

export type MainDispatch = (action: MainTreeActions['UNION']) => void;

export const dispatch = store.dispatch.bind(store) as MainDispatch;

export const dispatchAny = store.dispatch.bind(store);

export function useMainSelector<T>(selector: (state: MainState) => T): T {
	return useSelector((rootState: RootReduxState) => selector(rootState.mainTree));
}

export function useIsOffline(): boolean {
	return useSelector((rootState: RootReduxState) => !rootState.network.isConnected);
}

export function useIsLoggedIn(): boolean {
	return useMainSelector((state) => state.authData.userId) !== null;
}

export function getAuthDataWithoutStateUpdate(): MainState['authData'] {
	return store.getState().mainTree.authData;
}
