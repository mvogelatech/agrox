/* eslint-disable unicorn/filename-case */

import React, { useEffect } from 'react';
import { preventSplashScreenAutoHide } from './src/splash-screen';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ReduxNetworkProvider as ReactNativeOfflineProvider } from 'react-native-offline';
import { store, persistor } from './redux-things';
import { SnackbarProvider } from './src/snackbars';
import { registerNavigationRef } from './src/navigate-from-anywhere';
import { setupAgroXNotificationListeners } from './src/notifications';
import { AppRoot } from './components/app-root';

preventSplashScreenAutoHide();

export default function App() {
	useEffect(setupAgroXNotificationListeners, []);

	return (
		<ReduxProvider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ReactNativeOfflineProvider>
					<PaperProvider theme={theme}>
						<NavigationContainer ref={registerNavigationRef}>
							<SnackbarProvider>
								<AppRoot />
							</SnackbarProvider>
						</NavigationContainer>
					</PaperProvider>
				</ReactNativeOfflineProvider>
			</PersistGate>
		</ReduxProvider>
	);
}

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#327387',
		accent: '#327387',
	},
};
