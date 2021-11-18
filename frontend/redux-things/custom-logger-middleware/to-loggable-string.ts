/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import replaceString from 'replace-string';
import isPlainObject from 'is-plain-object';

const placeholder = '§£';
const setPlaceholder = '¢§';

function manyStringReplacements(string: string, replacements: { [source: string]: string }): string {
	let result = string;

	for (const [source, replacement] of Object.entries(replacements)) {
		result = replaceString(result, source, replacement);
	}

	return result;
}

function replacer(key: string, value: any) {
	if (value?.$$models) {
		return `${placeholder}{{${value.$$models} ID ${value.id ?? 'unknown'}}}${placeholder}`;
	}

	if (value instanceof Set) {
		return [setPlaceholder, [...value], setPlaceholder];
	}

	if (value instanceof Map) {
		return '<<<Map>>>';
	}

	return value;
}

function prettierJson(input: any): string {
	const prettier = require('prettier/standalone');
	const prettierOptions = { parser: 'babel', plugins: [require('prettier/parser-babel')], printWidth: 80, semi: false, trailingComma: 'none' };
	return prettier.format(`const ___14 = ${JSON.stringify(input, replacer)}`, prettierOptions).slice(14);
}

export function toLoggableString(arg: any): string {
	if (isPlainObject(arg)) {
		return manyStringReplacements(prettierJson(arg), {
			[`"${placeholder}`]: '',
			[`${placeholder}"`]: '',
			[`["${setPlaceholder}", [`]: 'Set {',
			[`], "${setPlaceholder}"]`]: '}',
		}).trim();
	}

	return `${arg}`;
}
