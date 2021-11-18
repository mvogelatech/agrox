export function extractExtname(path: string): string {
	const execResult = /(\.\w+)$/.exec(path);
	if (execResult?.[0]) {
		return execResult[0];
	}

	return '';
}
