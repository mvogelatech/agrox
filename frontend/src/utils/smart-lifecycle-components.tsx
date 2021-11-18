import React from 'react';
import { AgroXScreenProps } from '../../components/navigation-types';
import { useIsAlive } from '../custom-hooks/use-is-alive';
import { useStatesChanged } from '../custom-hooks/use-states-changed';
import { useIsFocused } from '@react-navigation/native';

const chalk_ = __DEV__ && require('chalk');
const chalk = chalk_ && new chalk_.Instance({ level: 1 });

export type Node = JSX.Element | null;
export type ComponentFunctionType<Props> = (props: Props) => Node;
export type ScreenComponentFunctionType<ScreenProps extends AgroXScreenProps> = ComponentFunctionType<ScreenProps>;

export function asFocusedOnlyComponent<Props>(ComponentFunction: ComponentFunctionType<Props>): ComponentFunctionType<Props> {
	return (props: Props) => {
		return useIsFocused() ? <ComponentFunction {...props} /> : null;
	};
}

export function asAliveOnlyScreenComponent<ScreenProps extends AgroXScreenProps>(
	ScreenComponentFunction: ScreenComponentFunctionType<ScreenProps>,
): ScreenComponentFunctionType<ScreenProps> {
	return (props: ScreenProps) => {
		const alive = useIsAlive(props.route);
		const justDied = useStatesChanged([alive]) && !alive;

		if (__DEV__ && justDied) {
			console.log(chalk.gray(`Info: ${props.route.name} died`));
		}

		return alive ? <ScreenComponentFunction {...props} /> : null;
	};
}
