import React, { useState, useMemo } from 'react';
import { Snackbar, useTheme } from 'react-native-paper';
import type { RequireAtLeastOne } from 'type-fest';
import { createTStyleSheet, overrideTStyleSheet, ExtendedStyle } from '../utils/style';

type SnackbarSpec_ = {
	text: string;
	textColor?: string;
	duration?: number;
	actionText?: string;
	actionTextColor?: string;
	style?: ExtendedStyle;
	onActionClick?: () => void | Promise<void>;
	onExpire?: () => void | Promise<void>;
};

type SnackbarSpec = SnackbarSpec_ & RequireAtLeastOne<SnackbarSpec_, 'duration' | 'actionText'>;

type ShowSnackbar = (snackbar: SnackbarSpec) => void;

type SnackbarProviderProps = {
	children: React.ReactNode;
};

let _showSnackbar: ShowSnackbar | undefined;

let _isSnackbarShowing = false;

export function showSnackbar(snackbar: SnackbarSpec) {
	if (!_showSnackbar) {
		throw new Error('Cannot use `showSnackbar` now since SnackbarProvider has not initialized yet.');
	}

	_showSnackbar(snackbar);
}

export function isSnackbarShowing(): boolean {
	return _isSnackbarShowing;
}

export function SnackbarProvider(props: SnackbarProviderProps) {
	const [currentSnackbar, setCurrentSnackbar] = useState<SnackbarSpec | undefined>(undefined);

	_isSnackbarShowing = currentSnackbar !== undefined;

	const styles = currentSnackbar?.style ? overrideTStyleSheet(defaultStyleSheet, { snackbar: currentSnackbar.style }) : defaultStyleSheet;

	const theme = useTheme({
		colors: {
			accent: currentSnackbar?.actionTextColor ?? 'white',
			surface: currentSnackbar?.textColor ?? 'white',
		},
	});

	useMemo(() => {
		_showSnackbar = (snackbar: SnackbarSpec) => {
			if (snackbar.duration !== undefined && snackbar.duration <= 0) {
				throw new Error(`Snackbar duration must be positive (or undefined, if it should not expire)`);
			}

			if ((snackbar.duration === undefined || snackbar.duration === Infinity) && snackbar.actionText === undefined) {
				throw new Error(`Snackbar must have a way to disappear. Either give a duration or an action text.`);
			}

			function trySet() {
				setCurrentSnackbar((prevState) => {
					if (prevState !== undefined) {
						// There is already an active snackbar. Let's remove it first.
						// If 10ms are not enough, this will recurse automatically until it is enough.
						setTimeout(trySet, 10);
						return undefined;
					}

					return snackbar;
				});
			}

			trySet();
		};
	}, []);

	return (
		<>
			{props.children}
			{currentSnackbar !== undefined && (
				<Snackbar
					visible
					duration={currentSnackbar.duration ?? Infinity}
					style={styles.snackbar}
					theme={theme}
					action={
						currentSnackbar.actionText
							? {
									label: currentSnackbar.actionText,
									onPress: async () => {
										if (currentSnackbar.onActionClick) await currentSnackbar.onActionClick();
										setCurrentSnackbar(undefined);
									},
							  }
							: undefined
					}
					onDismiss={() => {
						setCurrentSnackbar(undefined);
						void currentSnackbar.onExpire?.();
					}}
				>
					{currentSnackbar.text}
				</Snackbar>
			)}
		</>
	);
}

const defaultStyleSheet = createTStyleSheet({
	snackbar: {
		backgroundColor: 'blue',
	},
});
