import ensureError from 'ensure-error';
const jsonStringifySafe: (arg: unknown) => string = require('json-stringify-safe'); // eslint-disable-line @typescript-eslint/no-var-requires

export function stringify(arg: unknown): string {
	if (typeof arg === 'string') {
		return arg;
	}

	if (!arg || typeof arg !== 'object') {
		return String(arg);
	}

	if (Object.prototype.toString.call(arg) === '[object Error]') {
		const { message, stack } = ensureError(arg);
		const printableMessage = jsonStringifySafe(message);
		const printableStack = jsonStringifySafe(stack.slice(0, 150));
		return `[ERROR: ${printableMessage} [Beginning of stack: ${printableStack}]]`;
	}

	return jsonStringifySafe(arg);
}
