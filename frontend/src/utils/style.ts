import EStyleSheet from 'react-native-extended-stylesheet';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { REM_SCALE } from '.';
import { LiteralUnion } from 'type-fest';
import lodashMerge from 'lodash.merge';

type Style = ViewStyle & TextStyle & ImageStyle;

export type ExtendedStyle = {
	[K in keyof Style]?: number extends Style[K] ? (Style[K] extends string ? LiteralUnion<Style[K], string> : Style[K] | string) : Style[K];
} & { flex?: number; zIndex?: number };

type TStyleSheetSource = {
	[Z: string]: number | string | ExtendedStyle | undefined;
	$scale?: number | undefined;
	$outline?: number | undefined;
};

type CompiledTStyleSheet = {
	[Z: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	$$$$tSource: TStyleSheetSource;
};

EStyleSheet.build({ $rem: REM_SCALE });

export function createTStyleSheet(source: TStyleSheetSource): CompiledTStyleSheet {
	const result = EStyleSheet.create(source);
	Object.defineProperty(result, '$$$$tSource', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: source,
	});
	return result as CompiledTStyleSheet;
}

export function overrideTStyleSheet(
	original: CompiledTStyleSheet,
	overrides: TStyleSheetSource,
	...moreOverrides: TStyleSheetSource[]
): CompiledTStyleSheet {
	return createTStyleSheet(lodashMerge({}, original.$$$$tSource, overrides, ...moreOverrides));
}
