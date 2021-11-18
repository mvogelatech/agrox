import isPlainObject from 'is-plain-object';

type Obj = { [key: string]: any };

export function recurseDeep(root: Obj, callback: (value: Obj, key: string) => void) {
	for (const [key, value] of Object.entries(root)) {
		const values = Array.isArray(value) ? value : [value];
		for (const value of values) {
			if (isPlainObject(value)) {
				callback(value, key);
				recurseDeep(value, callback);
			}
		}
	}
}
