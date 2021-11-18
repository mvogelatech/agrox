import React, { useRef } from 'react';
import { View, Text, Share } from 'react-native';

import { createTStyleSheet } from '../../src/utils/style';

import { Button } from 'react-native-paper';
import { displayAlert } from '../../src/utils/alert-messages';
import { ScrollView } from 'react-native-gesture-handler';
import { Models } from '../../models';
import { scrollToEndAndBack } from '../../src/utils';

type PrivacyPolicyProps = {
	terms: Models.privacy_policy;
};
export function Terms(props: PrivacyPolicyProps) {
	const onShare = async () => {
		try {
			const result = await Share.share({
				message: props.terms.content,
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
			<Text style={styles.titleText}> TERMOS DE POLÍTICA E PRIVACIDADE:</Text>
			<ScrollView ref={scrollViewRef} style={styles.contentView} onLayout={() => scrollToEndAndBack(scrollViewRef, 'scrollview')}>
				<Text style={styles.termsText}>{props.terms.content}</Text>
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
