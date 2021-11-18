import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';
import { Card, Button } from 'react-native-paper';
import { RoundIcon } from '../00-common';
import { useMainSelector } from '../../redux-things';
import { formatDate } from '../../src/utils';
import { colors } from '../../src/assets';

type PackageDetailsProps = {
	isShowDetailsButton?: boolean;
	method: 'plane' | 'drone' | 'tractor' | 'manual';
	fields: string[];
	onSeeMorePress: () => void;
};

function saveMethod(props: PackageDetailsProps) {
	console.log();
}

export function PackageDetails(props: PackageDetailsProps) {
	const pulverizationStartDate = useMainSelector((state) => state.interactionData.newQuotation.pulverizationStartDate);
	const pulverizationEndDate = useMainSelector((state) => state.interactionData.newQuotation.pulverizationEndDate);
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		card: {
			paddingBottom: props.isShowDetailsButton ? '8rem' : '16rem',
		},
	});

	console.log(props.fields);

	return (
		<Card style={styles.card}>
			<View>
				<View style={{ flexDirection: 'row' }}>
					<View>
						<RoundIcon isEnabled icon={props.method} color={colors.lightBlue} size="44rem" />
					</View>
					<View style={styles.contentView}>
						<Text style={styles.titleText}>Pulverização </Text>
						<View style={styles.subtitleView}>
							<Text style={styles.subtitleText}>Talhões: {props.fields.map((description) => description.split(' ')[1]).join(', ')}</Text>
							<Text style={styles.subtitleText}>
								Data da Pulverização: {formatDate(pulverizationStartDate!.toISOString())} até {formatDate(pulverizationEndDate!.toISOString())}
							</Text>
						</View>
					</View>
				</View>
				{props.isShowDetailsButton ? (
					<View style={styles.buttonsView}>
						<Button
							mode="text"
							style={styles.button}
							labelStyle={styles.buttonText}
							// onPress={() =>
							// 	props.onSeeMorePress;
							// 	saveMethod()
							// 	console.log(props.method);
							// 	// await AsyncStorage.setItem('method', props.method);
							// }
							// onPress={() => {
							// 	console.log(props.onSeeMorePress);
							// }}
							onPress={props.onSeeMorePress}
						>
							Detalhes
						</Button>
					</View>
				) : undefined}
			</View>
		</Card>
	);
}

const defaultStyleSheet = createTStyleSheet({
	card: {
		// marginTop: '10rem',
		// paddingTop: '16rem',
		paddingBottom: '8rem',
		paddingHorizontal: '16rem',
		elevation: 4,
		borderRadius: '16rem',
	},
	contentView: {
		paddingLeft: '16rem',
		alignItems: 'flex-start',
		maxWidth: '75%',
	},
	subtitleView: {
		marginTop: '5rem',
	},
	titleText: {
		fontSize: '16rem',
		fontWeight: 'bold',
	},
	subtitleText: {
		fontSize: '12rem',
		color: '#78849E',
	},
	buttonsView: {
		alignItems: 'flex-start',
		paddingLeft: '40rem',
	},
	button: {
		height: '37rem',
		width: '109rem',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
