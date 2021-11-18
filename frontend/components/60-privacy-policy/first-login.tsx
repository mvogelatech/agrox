import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';

import { Button } from 'react-native-paper';
import { CustomCheckbox, ClosableHeader } from '../00-common';
import { dispatch, useIsOffline, useMainSelector } from '../../redux-things';
import { Terms } from './terms';
import { userSignOut } from '../../src/network/auth';
import { ky } from '../../src/network/ky';
import { WaitOverlay } from '../00-common/wait-overlay';
import { displayAlert, displayTimeoutErrorSnackbar, needsToBeOnline, privacyPolicy } from '../../src/utils/alert-messages';
import { Models } from '../../models';

async function postPrivacyPolicyRead(privacyPolicyId: number) {
	const acceptedPrivacyPolicy = await ky
		.post('privacy-policy/set-read', {
			json: {
				privacyPolicyId,
			},
		})
		.json<Models.user_accepted_privacy_policy>();
	dispatch({ type: 'BACKEND_DATA__POSTED_NEW_USER_ACCEPTED_PRIVACY_POLICY', acceptedPrivacyPolicy });
}

export function PrivacyPolicyFirstLogin() {
	const allTerms = useMainSelector((state) => state.backendData.privacyPolicy)!;
	const term = allTerms[0];

	const isOnline = !useIsOffline();
	const [haveRead, setHaveRead] = useState(false);
	const [showIndicator, setShowIndicator] = useState(false);

	const styles = overrideTStyleSheet(defaultStyleSheet, {
		refuseButton: {
			borderColor: haveRead ? '#327387' : '#e0e0e0',
		},
	});

	return (
		<View style={{ flex: 1 }}>
			{showIndicator ? <WaitOverlay text="Aguarde" /> : undefined}
			<ClosableHeader onBackPress={userSignOut} />
			<Terms terms={term} />

			<View style={styles.bottomView}>
				<CustomCheckbox
					title={
						<View style={{ alignItems: 'flex-start' }}>
							<Text style={styles.checkboxText}>Declaro que li e aceito os termos de política e privacidade aqui dispostos.</Text>
						</View>
					}
					status={haveRead ? 'checked' : 'unchecked'}
					onPress={() => setHaveRead((haveRead) => !haveRead)}
				/>
				<View style={{ flexDirection: 'row', width: '100%' }}>
					<Button
						uppercase
						mode="outlined"
						disabled={!haveRead}
						style={styles.refuseButton}
						labelStyle={styles.buttonText}
						onPress={() => {
							displayAlert(privacyPolicy);
							void userSignOut();
						}}
					>
						Recusar
					</Button>
					<Button
						uppercase
						disabled={!haveRead}
						mode="contained"
						style={styles.button}
						labelStyle={styles.buttonText}
						onPress={async () => {
							if (isOnline) {
								setShowIndicator(true);
								try {
									await postPrivacyPolicyRead(term.id);
								} catch (error) {
									setShowIndicator(false);
									displayTimeoutErrorSnackbar(error, 'Post PrivacyPolicyRead');
								}
							} else {
								displayAlert(needsToBeOnline);
							}
						}}
					>
						Aceitar
					</Button>
				</View>
			</View>
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
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
		paddingVertical: '24rem',
		fontWeight: 'bold',
		color: '#6C6464',
	},
	termsText: {
		textAlign: 'justify',
	},
	shareButton: {
		marginTop: '20rem',
		height: '37rem',
		width: '175rem',
	},
	refuseButton: {
		flex: 1,
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		borderWidth: '2rem',
		borderRadius: '8rem',
	},
	button: {
		flex: 1,
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		marginHorizontal: '8rem',
	},
	bottomView: {
		alignItems: 'center',
		paddingHorizontal: '16rem',
		paddingTop: 'rem',
		backgroundColor: 'white',
	},
	checkboxText: {
		paddingLeft: '8rem',
		textAlign: 'justify',
		maxWidth: '95%',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
