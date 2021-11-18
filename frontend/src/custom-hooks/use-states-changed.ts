import { useMemo } from 'react';

/**
 * Check whether or not one of the given states has changed.
 *
 * @returns boolean
 */
export function useStatesChanged(states: unknown[]): boolean {
	let changed = false;

	useMemo(() => {
		changed = true; // eslint-disable-line react-hooks/exhaustive-deps
	}, states);

	return changed;
}
