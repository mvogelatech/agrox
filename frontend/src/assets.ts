/* eslint-disable @typescript-eslint/no-var-requires */

import type { Opaque } from 'type-fest';

export type ImageType = Opaque<number, 'ImageType'>;
type IconImageType = Opaque<number, 'IconImageType'>;

export const images = {
	app: require('../assets/icon.png') as ImageType,
	logo: require('../assets/logo.png') as ImageType,
	croppedLogo: require('../assets/cropped-logo.png') as ImageType,
	mapPin: require('../assets/icons/mapPin.png') as ImageType,

	crop: {
		soy: require('../assets/cropIcons/soy.png') as ImageType,
		corn: require('../assets/cropIcons/corn.png') as ImageType,
		sugarCane: require('../assets/cropIcons/sugar-cane.png') as ImageType,
	},
	screens: {
		splash: require('../assets/splash.png') as ImageType,
		welcome: require('../assets/welcomeScreen.png') as ImageType,
	},
};

export const colors = {
	neutral: {
		white: '#FFFFFF',
		default: '#F2F2F2',
		lighter_30: '#E8E8E8',
		lighter_60: '#E3E3E3',
		darker_30: '#6C6464',
		darker_60: '#666666',
		gray_20: '#D1D4D5',
	},
	primary: {
		dark_blue: '#454F63',
		dark_green: '#327387',
		dark_green_30: '#0D3845',
	},
	secondary: {
		lighter_blue: '#78849E',
		lighter_30: '#98B9C3',
		green_30: '#469BA2',
	},
	supportError: {
		neon: '#FF5946',
		lighter: '#F6C0C5',
		darker: '#70171F',
	},
	supportSuccess: {
		lighter: '#99D19D',
		lighter_30: '#C9E9CD',
		darker: '#3C6B41',
	},
	flags: {
		blue: '#46F2FF',
		red: '#FF5946',
		green: '#46FFB2',
		yellow: '#FFC700',
	},
	orange: '#ff7a00ff',
	blue: '#4873e2ff',
	gray: '#c4c4c4ff',
	lightGreen: '#99d19dff',
	lightBlue: '#469ba2ff',
} as const;

type GetValuesDeep<T> = T extends Record<string, unknown> ? { [K in keyof T]: GetValuesDeep<T[K]> }[keyof T] : T;

export type Color = GetValuesDeep<typeof colors>;

export const icons = {
	area: require('../assets/icons/area.png') as IconImageType,
	avatar: require('../assets/icons/avatar.png') as IconImageType,
	brokenWeed: require('../assets/icons/brokenWeed.png') as IconImageType,
	bug: require('../assets/icons/bug.png') as IconImageType,
	check: require('../assets/icons/check.png') as IconImageType,
	drone: require('../assets/icons/drone.png') as IconImageType,
	graphBar: require('../assets/icons/graphBar.png') as IconImageType,
	plane: require('../assets/icons/plane.png') as IconImageType,
	pulverization: require('../assets/icons/pulverization.png') as IconImageType,
	pulverizationBetter: require('../assets/icons/pulverization-better.png') as IconImageType,
	tractor: require('../assets/icons/tractor.png') as IconImageType,
	manual: require('../assets/icons/manual.png') as IconImageType,
	warning: require('../assets/icons/warning.png') as IconImageType,
	weed: require('../assets/icons/weed.png') as IconImageType,
};

export type Icon = keyof typeof icons;
