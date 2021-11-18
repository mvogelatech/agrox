import { NavigationContainerRef } from '@react-navigation/native';
import { NavigationFunction } from '../../components/navigation-types';

let navigationRef: NavigationContainerRef | undefined;
let pendingNavigationCallArgs: Parameters<NavigationFunction> | undefined;

export function registerNavigationRef(ref: NavigationContainerRef): void {
	navigationRef = ref;
	if (pendingNavigationCallArgs) {
		navigationRef.navigate(...pendingNavigationCallArgs);
	}
}

export const navigate: NavigationFunction = (...args: Parameters<NavigationFunction>) => {
	if (navigationRef) {
		navigationRef.navigate(...args);
	} else {
		pendingNavigationCallArgs = args;
	}
};
