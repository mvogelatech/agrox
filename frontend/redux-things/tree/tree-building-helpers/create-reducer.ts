/* eslint-disable @typescript-eslint/no-explicit-any */
import { BuildActionSpec } from './build-action-type-spec';

const GLOBAL_RESET_ACTION_NAME = 'GLOBAL_RESET';

export type GlobalResetActionSpec = BuildActionSpec<
	[
		{
			type: typeof GLOBAL_RESET_ACTION_NAME;
		},
	]
>;

type Handlers<State, ActionDictionary> = {
	[ActionTypeName in keyof ActionDictionary]: (prevState: State, action: ActionDictionary[ActionTypeName]) => State;
};

type Values<T> = T[keyof T];

type LooseActionSpec = BuildActionSpec<Array<{ type: string }>>;

export function createReducer<State, Spec extends LooseActionSpec>(initialState: State, handlers: Handlers<State, Spec['DICTIONARY']>) {
	return (state: State | undefined, action: Values<Spec['DICTIONARY']> | Values<GlobalResetActionSpec['DICTIONARY']>): State => {
		if (state === undefined || action.type === GLOBAL_RESET_ACTION_NAME) return initialState;
		const handler = handlers[action.type];
		if (!handler) return state;
		if (typeof handler !== 'function') throw new TypeError(`Expected reducer handler '${action.type}' to be a function, got ${typeof handler}`);
		return handler(state, action as any);
	};
}
