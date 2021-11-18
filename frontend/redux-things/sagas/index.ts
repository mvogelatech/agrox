import { all, call, takeEvery } from 'redux-saga/effects';
import { offlineActionTypes } from 'react-native-offline';
import { RootReduxState } from '../root-structure';
import { tryToUpdateFcmToken } from '../../src/network/update-fcm-token';
import { showSnackbar } from '../../src/snackbars';
import { fetchBackendData } from '../../src/network';

type NetworkConnectivityChangeAction = {
	type: '@@network-connectivity/CONNECTION_CHANGE';
	payload: boolean;
};

export function getRootSaga(getState: () => RootReduxState) {
	function updateFcmTokenIfApplicable() {
		const state = getState();
		if (state.mainTree.backendData.user && state.network.isConnected) {
			tryToUpdateFcmToken();
		}
	}

	function* networkSaga() {
		const offlineMessage = 'As informações podem estar desatualizadas pela falta de conexão com a internet.';
		const onlineMessage = 'Conexão com a internet reestabelecida e informações atualizadas!';

		yield takeEvery(offlineActionTypes.CONNECTION_CHANGE, (action: NetworkConnectivityChangeAction) => {
			const justGotOnline = action.payload;

			const snackbarStyle = {
				backgroundColor: 'rgb(50, 115, 135)',
			};

			if (justGotOnline) {
				updateFcmTokenIfApplicable();
				(async () => {
					await fetchBackendData();
					showSnackbar({ text: onlineMessage, duration: 8000, style: snackbarStyle });
				})();
			} else {
				showSnackbar({ text: offlineMessage, actionText: 'OK, ENTENDI', style: snackbarStyle });
			}
		});
	}

	function* fcmSaga() {
		yield takeEvery('BACKEND_DATA_RECEIVED__USER', () => {
			updateFcmTokenIfApplicable();
		});
	}

	return function* () {
		yield all([call(networkSaga), call(fcmSaga)]);
	};
}
