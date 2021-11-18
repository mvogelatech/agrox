import { stringify } from './stringify';

let debugTexts: string[] = [];
let nextDebugId = 1;

export function debug(...args: unknown[]): string {
	const text = `[#${nextDebugId++}] ${args
		.map((x) => {
			const str = stringify(x);
			if (str.length <= 800) return str;
			return `${str.slice(0, 750)}⋯${str.slice(-50)}`;
		})
		.join(' ')}`;

	debugTexts.push(text);

	return text;
}

export function getDebugValue(): string {
	return debugTexts.join(' §§ ');
}

export function clearDebugValue(): void {
	debugTexts = [];
}
