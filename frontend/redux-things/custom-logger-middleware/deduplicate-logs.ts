import { toLoggableString } from './to-loggable-string';
import type { Log } from './log';

export type LogWithCount = {
	log: Log;
	count: number;
};

function logsAreEqual(log1: Log, log2: Log): boolean {
	return (
		log1.date === log2.date &&
		toLoggableString(log1.action) === toLoggableString(log2.action) &&
		toLoggableString(log1.prevState) === toLoggableString(log2.prevState) &&
		toLoggableString(log1.nextState) === toLoggableString(log2.nextState)
	);
}

function insertLog(log: Log, set: LogWithCount[]): void {
	for (const x of set) {
		if (logsAreEqual(x.log, log)) {
			x.count++;
			return;
		}
	}

	set.push({ log, count: 1 });
}

export function deduplicateLogs(logs: Log[]): LogWithCount[] {
	const result: LogWithCount[] = [];
	logs.forEach((log) => insertLog(log, result));
	return result;
}
