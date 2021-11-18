import * as SplashScreen from 'expo-splash-screen';
import { debug } from '../debug';

async function preventSplashScreenAutoHide_(): Promise<void> {
	try {
		await SplashScreen.preventAutoHideAsync();
	} catch (error) {
		debug(`[${new Date().toISOString()}] Could not prevent splash screen from auto hiding! Error:`, error);
	}
}

async function hideSplashScreen_(): Promise<void> {
	try {
		await SplashScreen.hideAsync();
	} catch (error) {
		debug(`[${new Date().toISOString()}] Could not hide splash screen! Error:`, error);
	}
}

export function preventSplashScreenAutoHide(): void {
	void preventSplashScreenAutoHide_();
}

export function hideSplashScreen(): void {
	void hideSplashScreen_();
}
