/* eslint-disable unicorn/no-process-exit */

import ensureError = require('ensure-error');
import chalk = require('chalk');

function die(message: string): never {
	console.error(chalk.red(message) + '\n');
	process.exit(1);
}

export function runCLI(runner: () => void | Promise<void>): void {
	(async () => {
		try {
			await runner();
			process.exit(0);
		} catch (error) {
			die(ensureError(error).message);
		}
	})();
}
