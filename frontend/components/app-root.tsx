import React, { useEffect } from 'react';
import { SignIn } from './sign-in';
import { useMainSelector } from '../redux-things';
import { Welcome } from './welcome';
import { RootDrawerContainer } from './main';

import { hideSplashScreen } from '../src/splash-screen';
import { preloadFonts } from '../src/preload/preload-fonts';
import { fetchBackendData, getBackendDataFetchStatus } from '../src/network';
import { loadFromAsyncStorageIfPresent as loadImageCacheFromAsyncStorageIfPresent } from '../src/network/helpers/cache-images';
import { TermsAndConditionsFirstLogin } from './40-terms-and-conditions/first-login';
import { PrivacyPolicyFirstLogin } from './60-privacy-policy/first-login';

function AppRootWhenSignedIn() {
	useEffect(() => {
		(async () => {
			await loadImageCacheFromAsyncStorageIfPresent();
			await fetchBackendData();
		})();
	}, []);

	const data = useMainSelector((state) => state.backendData);
	const termsAccepted = useMainSelector((state) => state.backendData.user?.user_accepted_terms);
	const privacyPolicyAccepted = useMainSelector((state) => state.backendData.user?.user_accepted_privacy_policy);
	const allTermsandConditions = useMainSelector((state) => state.backendData.terms);
	const allPrivacyPolicy = useMainSelector((state) => state.backendData.privacyPolicy);

	const someDataMissing = Object.entries(data).some((item) => item[1] === null);

	if (!getBackendDataFetchStatus() || someDataMissing) return <Welcome />;

	if (termsAccepted?.length === 0 || termsAccepted?.[0].id_terms_and_conditions !== allTermsandConditions?.[0].id) return <TermsAndConditionsFirstLogin />;

	if (privacyPolicyAccepted?.length === 0 || privacyPolicyAccepted?.[0].id_privacy_policy !== allPrivacyPolicy?.[0].id) return <PrivacyPolicyFirstLogin />;

	return <RootDrawerContainer />;
}

export function AppRoot() {
	const userId = useMainSelector((state) => state.authData.userId);
	const userToken = useMainSelector((state) => state.authData.userToken);

	useEffect(() => {
		(async () => {
			await preloadFonts();
			hideSplashScreen();
		})();
	}, []);

	useEffect(() => {
		if (__DEV__) {
			if (userId && userToken) {
				console.log(
					`${'-'.repeat(
						60,
					)}\n \nTo experiment with backend requests with this user (ID ${userId}), send HTTP requests with the 'Authorization' header with the following value:\n \nBearer ${userToken}\n \n${'-'.repeat(
						60,
					)}`,
				);
			}
		}
	}, [userId, userToken]);

	if (userId === null) {
		return <SignIn />;
	}

	return <AppRootWhenSignedIn />;
}
