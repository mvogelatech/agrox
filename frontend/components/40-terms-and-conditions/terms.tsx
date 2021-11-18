import React, { useRef } from 'react';
import { View, Text, Share } from 'react-native';

import { createTStyleSheet } from '../../src/utils/style';

import { Button } from 'react-native-paper';
import { displayAlert } from '../../src/utils/alert-messages';
import { ScrollView } from 'react-native-gesture-handler';
import { Models } from '../../models';
import { scrollToEndAndBack } from '../../src/utils';

type TermsProps = {
	term: Models.terms_and_conditions;
};
export function Terms(props: TermsProps) {
	const onShare = async () => {
		try {
			const result = await Share.share({
				message: props.term.content,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			displayAlert(error.message);
		}
	};

	const scrollViewRef = useRef<ScrollView>(null);
	return (
		<View style={styles.mainView}>
			<Button uppercase icon="share-variant" mode="text" style={styles.shareButton} labelStyle={styles.buttonText} onPress={onShare}>
				compartilhar
			</Button>
			<Text style={styles.titleText}> TERMOS E CONDIÇÕES DE USO DO APLICATIVO:</Text>
			<ScrollView ref={scrollViewRef} style={styles.contentView} onLayout={() => scrollToEndAndBack(scrollViewRef, 'scrollview')}>
				<Text style={styles.termsText}>{props.term.content}</Text>
			</ScrollView>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		paddingHorizontal: '16rem',
		backgroundColor: 'white',
		alignItems: 'flex-start',
	},
	contentView: {
		flex: 1,
		paddingRight: '16rem',
		marginBottom: '16rem',
	},
	titleText: {
		paddingVertical: '16rem',
		fontWeight: 'bold',
	},
	termsText: {
		textAlign: 'justify',
	},
	shareButton: {
		marginTop: '16rem',
		height: '30rem',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: '12rem',
		fontWeight: 'normal',
	},
});
