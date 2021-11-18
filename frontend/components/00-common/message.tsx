import React from 'react';
import { View, Text } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';

type MessageProps = {
	title: string;
	firstLine: string;
	secondLine: string;
};

export function Message(props: MessageProps) {
	return (
		<View style={styles.messageView}>
			<Text style={styles.textBig}>{props.title}</Text>
			<Text>{props.firstLine}</Text>
			<Text>{props.secondLine}</Text>
		</View>
	);
}

const styles = createTStyleSheet({
	messageView: {
		flexDirection: 'column',
		alignItems: 'center',
		marginHorizontal: '30rem',
		marginVertical: '30rem',
	},
	textBig: {
		fontSize: '16rem',
		marginBottom: '20rem',
	},
});
