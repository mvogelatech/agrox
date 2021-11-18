import { recurseDeep } from './recurse-deep';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enableShorterLogsForModel(value: any, modelName: string): void {
	value.$$models = modelName;
	recurseDeep(value, (obj, key) => {
		obj.$$models = key;
	});
}
