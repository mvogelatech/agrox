import indentString from 'indent-string';
import chalk from './chalk';

export function prependBluePipes(string: string): string {
	return indentString(indentString(string, 1), 1, { includeEmptyLines: true, indent: chalk.blue('|') });
}
