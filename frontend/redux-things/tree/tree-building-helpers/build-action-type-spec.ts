/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnionToIntersection } from 'type-fest';

declare function tsAssertIsSupertype<A, B extends A>(): void;

type ObjIndex = string | number; // TODO add `symbol` after https://github.com/microsoft/TypeScript/issues/1863 is fixed
type Obj = Record<ObjIndex, any>;

type PluckArray<T extends any[], P extends keyof T[number]> = { [K in keyof T]: T[K][P] };
type PluckObj<T extends Obj, P extends keyof T[ObjIndex]> = { [K in keyof T]: T[K][P] };

type ArrayToUnion<T extends any[]> = T[number];

type ObjArrayToObject<T extends Obj[], P extends ObjIndex & keyof ArrayToUnion<T>> = {
	[K in ArrayToUnion<PluckObj<T, P>>]: ArrayToUnion<T> & Record<P, K>;
};

type ArrayToIntersection<T extends any[]> = UnionToIntersection<ArrayToUnion<T>>;

// prettier-ignore
type FlattenHelper<T extends any[]> = T extends [infer U, ...infer R]
	? {
			1: U extends any[] ? [...U, ...FlattenHelper<R>] : [];
			2: [];
	  }[U extends any[] ? 1 : 2]
	: [];

type FlattenOnce<T extends any[][]> = FlattenHelper<T>;

// --------------------------------------------------------------------------------------------

type ActionListSupertype = Array<{ type: string }>;

export type BuildActionSpec<ActionList extends ActionListSupertype> = {
	DICTIONARY: ObjArrayToObject<ActionList, 'type'>;
	UNION: ArrayToUnion<ActionList>;
	TYPE_UNION: ArrayToUnion<PluckArray<ActionList, 'type'>>;
	TYPE_LIST: PluckArray<ActionList, 'type'>;
};

type ActionSpecSupertype = BuildActionSpec<ActionListSupertype>;

export type MergeActionSpecs<Specs extends ActionSpecSupertype[]> = {
	DICTIONARY: ArrayToIntersection<PluckArray<Specs, 'DICTIONARY'>>;
	UNION: ArrayToUnion<PluckArray<Specs, 'UNION'>>;
	TYPE_UNION: ArrayToUnion<PluckArray<Specs, 'TYPE_UNION'>>;
	TYPE_LIST: FlattenOnce<PluckArray<Specs, 'TYPE_LIST'>>;
};

// --------------------------------------------------------------------------------------------

tsAssertIsSupertype<ActionSpecSupertype, MergeActionSpecs<ActionSpecSupertype[]>>();
