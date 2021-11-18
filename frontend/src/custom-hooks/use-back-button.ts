import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, DependencyList } from 'react';

export type BackButtonBehavior = 'PROCEED' | 'CANCEL';

export type BackButtonHandler = () => BackButtonBehavior;

/**
 * Hook to enable behavior when the Android back button is pressed.
 *
 * The handler should be an arrow function passed directly, instead of a reference to some funcion.
 *
 * @example
 *
 * ```
 * // DO:
 * useBackButton(() => {
 *   console.log('This is good');
 * });
 *
 * // DON'T
 * function handler() {
 *   console.log('This is bad');
 * }
 * useBackButton(handler);
 * ```
 */
export function useBackButton(handler: BackButtonHandler, deps: DependencyList): void {
	function convertedHandler(): boolean {
		// Returning true from handler prevents the default behavior (which is to `goBack` in the navigation)
		// Returning false lets it proceed with the usual handling (which is to `goBack` in the navigation)
		return handler() === 'CANCEL';
	}

	useFocusEffect(
		useCallback(() => {
			BackHandler.addEventListener('hardwareBackPress', convertedHandler);

			return () => {
				BackHandler.removeEventListener('hardwareBackPress', convertedHandler);
			};
		}, deps), // eslint-disable-line react-hooks/exhaustive-deps
	);
}
