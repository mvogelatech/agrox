import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';

// export type StackNavPropsFromParamList<ParamList extends Record<string, Record<string, unknown> | undefined>, ScreenName extends keyof ParamList> = {
// 	navigation: StackNavigationProp<ParamList, ScreenName>;
// 	route: RouteProp<ParamList, ScreenName>;
// };

type ParamlessParamList<ScreenNames extends string> = Record<ScreenNames, undefined>;

export type ParamlessStackNavigatorProps<ScreenNames extends string, ScreenName extends ScreenNames> = {
	navigation: StackNavigationProp<ParamlessParamList<ScreenNames>, ScreenName>;
	route: RouteProp<ParamlessParamList<ScreenNames>, ScreenName>;
};

export type ParamlessDrawerNavigatorProps<ScreenNames extends string, ScreenName extends ScreenNames> = {
	navigation: DrawerNavigationProp<ParamlessParamList<ScreenNames>, ScreenName>;
	route: RouteProp<ParamlessParamList<ScreenNames>, ScreenName>;
};

export function createParamlessStackNavigator<ScreenNames extends string>() {
	return createStackNavigator<ParamlessParamList<ScreenNames>>();
}

export function createParamlessDrawerNavigator<ScreenNames extends string>() {
	return createDrawerNavigator<ParamlessParamList<ScreenNames>>();
}
