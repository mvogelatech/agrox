import { showSnackbar } from '../snackbars';
import { debug as debug__, getDebugValue, clearDebugValue } from './debug';

export { getDebugValue } from './debug';

let debugEnabled = false;

function debug_(...args: unknown[]) {
	const text = debug__(...args);
	if (debugEnabled) console.log(text);
}

export function enableDebugMode(): void {
	debugEnabled = true;
	debug_('Debug mode enabled!!');
}

function showDebugSnackbar(): void {
	try {
		showSnackbar({ text: getDebugValue(), actionText: 'OK' });
	} catch {
		setTimeout(showDebugSnackbar, 200);
	}
}

export function debug(...args: unknown[]): void {
	if (args.length !== 0) debug_(...args);
	if (debugEnabled) showDebugSnackbar();
}

export function isDebugModeEnabled(): boolean {
	return debugEnabled;
}

export function clearDebug(): void {
	clearDebugValue();
}
