import React from 'react';
import { View } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import NumberFormat from 'react-number-format';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Models, PaymentMethod } from '../../models';

type PriceSelectorProps = {
	method: PaymentMethod;
	quotation: Models.quotation;
	onPress: (method: PaymentMethod) => void;
};

export function PriceSelector(props: PriceSelectorProps) {
	function getPaymentMethodText() {
		if (props.method === 'antecipated_price') return 'PGTO ANTECIPADO';
		if (props.method === 'cash_price') return 'PGTO NO ATO';
		return 'PGTO PARA 30 DIAS';
	}

	return (
		<TouchableOpacity style={styles.mainView} onPress={() => props.onPress(props.method)}>
			<RadioButton color="#327387" value={`${props.quotation.company.id}_${props.method!.toString()}`} />
			<View>
				<Text style={styles.payText}>{getPaymentMethodText()}</Text>
				<NumberFormat
					fixedDecimalScale
					decimalScale={2}
					value={props.quotation[props.method!] ?? 0}
					displayType="text"
					thousandSeparator="."
					decimalSeparator=","
					prefix="R$ "
					renderText={(value) => <Text style={styles.priceText}>{value}</Text>}
				/>
			</View>
		</TouchableOpacity>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingVertical: '16rem',
	},
	payText: {
		fontSize: '12rem',
		color: '#78849E',
	},
	priceText: {
		fontSize: '16rem',
	},
});
