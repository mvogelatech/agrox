import React from 'react';
import { View, Clipboard, Linking } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { FontAwesome } from '@expo/vector-icons';
import NumberFormat from 'react-number-format';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PulverizationMethod, PulverizationMethods } from '../../models';
import { colors } from '../../src/assets';
import { RoundIcon } from '../00-common';

type CompanyCardProps = {
	method: PulverizationMethod;
	companyName: string;
	companyPhone: string;
};

export function CompanyCard(props: CompanyCardProps) {
	return (
		<Card style={styles.card}>
			<TouchableOpacity
				style={styles.mainView}
				onPress={() => {
					Clipboard.setString(props.companyPhone);
					void Linking.openURL(`tel:${props.companyPhone}`);
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<RoundIcon isEnabled icon={props.method === PulverizationMethods.DRONE ? 'drone' : 'plane'} color={colors.lightBlue} size="32rem" />
					<Text style={styles.companyText}>{props.companyName}</Text>
				</View>

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<FontAwesome name="whatsapp" style={styles.icon} />

					<NumberFormat
						value={props.companyPhone}
						displayType="text"
						format="(##) #### ####"
						renderText={(value) => <Text style={styles.phoneText}>{value}</Text>}
					/>
				</View>
			</TouchableOpacity>
		</Card>
	);
}

const styles = createTStyleSheet({
	card: {
		padding: '16rem',
		elevation: 4,
		borderRadius: '8rem',
		width: '100%',
		marginTop: '16rem',
	},
	mainView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: 'white',
		alignItems: 'center',
	},
	icon: {
		marginHorizontal: '7rem',
		fontSize: '24rem',
		color: '#469BA2',
	},
	companyText: {
		fontSize: '16rem',
		paddingLeft: '16rem',
	},
	phoneText: {
		color: '#78849E',
	},
	$size: '20rem',
	metohdIcon: {
		width: '$size',
		height: '$size',
		tintColor: colors.lightBlue,
		marginRight: '16rem',
	},
});
