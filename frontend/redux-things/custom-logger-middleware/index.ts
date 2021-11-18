/* eslint-disable @typescript-eslint/no-explicit-any */

import throttle from 'lodash.throttle';
import { Log, logToString } from './log';
import { deduplicateLogs } from './deduplicate-logs';
import chalk from './chalk';

export type createLoggerOptions = {
	detailed: boolean;
};

export function createLogger(options: createLoggerOptions) {
	if (!__DEV__) return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

	let pendingLogs: Log[] = [];

	const flushLogs = throttle(() => {
		const temp = pendingLogs;
		pendingLogs = [];

		console.log(
			`\n${deduplicateLogs(temp)
				.map(({ log, count }) => logToString(log, count, options.detailed))
				.join('\n\n')}\n`,
		);
	}, 2000);

	console.log(chalk.magenta(`\n=== Setting up redux logger middleware (${new Date().toISOString()}) ===\n`));

	let id = 1;

	const logger = ({ getState }: any) => (next: any) => (action: any) => {
		const date = new Date();
		const prevState = getState();
		const result = next(action);
		const nextState = getState();
		pendingLogs.push({ id: id++, prevState, action, nextState, date });
		setImmediate(flushLogs);
		return result;
	};

	return logger;
}
