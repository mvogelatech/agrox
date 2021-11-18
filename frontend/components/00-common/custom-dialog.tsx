import React from 'react';
import { Text, Button, Portal, Dialog } from 'react-native-paper';
import { View } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { DialogType } from '../../src/utils/alert-messages';

type CustomDialogProps = {
	isVisible: boolean;
	content: DialogType;
	onClose: () => void;
};

export function CustomDialog(props: CustomDialogProps) {
	return (
		<View>
			<Portal>
				<Dialog dismissable={false} visible={props.isVisible} style={styles.dialog}>
					<Dialog.Title style={styles.title}>{props.content.title}</Dialog.Title>
					<Dialog.Content>
						<Text style={styles.content}>{props.content.body}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button labelStyle={styles.buttonLabel} uppercase={false} style={styles.button} mode="contained" onPress={props.onClose}>
							{props.content.buttonText}
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
}

const styles = createTStyleSheet({
	dialog: {
		paddingRight: '8rem',
		paddingBottom: '8rem',
		borderRadius: '10rem',
	},
	title: {
		fontSize: '20rem',
		fontWeight: '500',
		color: '#327387',
	},
	content: {
		fontSize: '14rem',
		color: '#6C6464',
		letterSpacing: '0.5rem',
	},
	buttonLabel: {
		fontWeight: 'normal',
		fontStyle: 'normal',
		fontSize: '12rem',
		fontFamily: 'Roboto',
	},
	button: {
		height: '35rem',
		width: '100rem',
	},
});
