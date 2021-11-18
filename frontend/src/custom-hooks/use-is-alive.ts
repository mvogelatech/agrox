import { useNavigationState } from '@react-navigation/native';

type RoutePropForIsAliveChecking = {
	key: string;
	name: string;
};

/**
 * Check whether or not the given route is alive in the navigation stack
 *
 * @returns boolean
 */
export function useIsAlive(route: RoutePropForIsAliveChecking): boolean {
	const history = useNavigationState((state) => state.history);
	if (!history) return false;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return history.some((history_item) => (history_item as any)?.key === route.key);
}
