/* eslint-disable @typescript-eslint/no-explicit-any */

import chalk from './chalk';
import { prependBluePipes } from './prepend-blue-pipes';
import { toLoggableString } from './to-loggable-string';

export type Log = {
	id: number;
	prevState: any;
	action: any;
	nextState: any;
	date: Date;
};

export function logToString(log: Log, count: number, detailed: boolean): string {
	let title = chalk`{blue #} {cyan [${log.id.toString().padStart(3, '0')}] Action: ${log.action.type}}`;

	if (!detailed) {
		return title;
	}

	const prevStateString = toLoggableString(log.prevState);
	const nextStateString = toLoggableString(log.nextState);

	if (count > 1) {
		title += chalk.magenta(` (${count}x)`);
	}

	const at = prependBluePipes(chalk`{cyan At:} {grey ${log.date.toString()}}`);
	const action = prependBluePipes(chalk`{cyan Action:} {grey ${toLoggableString(log.action)}}`);

	if (prevStateString === nextStateString) {
		return [title, at, action, prependBluePipes(chalk`{cyan State (unchanged):} {grey ${prevStateString}}`)].join('\n');
	}

	return [
		title,
		at,
		prependBluePipes(chalk`{cyan Prev state:} {grey ${prevStateString}}`),
		action,
		prependBluePipes(chalk`{cyan Next state:} {grey ${nextStateString}}`),
	].join('\n');
}
