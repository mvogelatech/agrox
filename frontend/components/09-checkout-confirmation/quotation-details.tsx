import React from 'react';
import { View, Text } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { Card, Button } from 'react-native-paper';
import { RoundIcon } from '../00-common';
import { useMainSelector } from '../../redux-things';
import { formatDate } from '../../src/utils';
import { PulverizationMethod, PaymentMethod, Models, PulverizationMethods } from '../../models';
import NumberFormat from 'react-number-format';
import { colors } from '../../src/assets';

type QuotationDetailsProps = {
	method: PulverizationMethod;
	company: number;
	paymentMethod: PaymentMethod;
	quotation: Models.quotation_package;
	onSeeMorePress: () => void;
};

export function QuotationDetails(props: QuotationDetailsProps) {
	function getPaymentMethodText() {
		if (props.paymentMethod === 'antecipated_price') return 'ANTECIPADO';
		if (props.paymentMethod === 'cash_price') return 'NO ATO';
		return 'EM 30 DIAS';
	}

	function getQuotationFromCompanyIdByModal() {
		for (const modal of props.quotation.quotation_modal_package) {
			if (modal.pulverization_method === props.method) {
				for (const quotation of modal.quotation) {
					if (quotation.company_id === props.company) {
						return quotation;
					}
				}
			}
		}

		throw new Error('A quotation should have been found!');
	}

	const companies = useMainSelector((state) => state.backendData.companies)!;
	function getCompanyById(): Models.company {
		for (const company of companies) {
			if (company.id === props.company) return company;
		}

		throw new Error('A company should have been found!');
	}

	const currentCompany = getCompanyById();
	const currentQuotation = getQuotationFromCompanyIdByModal();

	return (
		<Card style={styles.card}>
			<View>
				<View style={{ flexDirection: 'row' }}>
					<View>
						<RoundIcon isEnabled icon={props.method === PulverizationMethods.DRONE ? 'drone' : 'plane'} color={colors.lightBlue} size="44rem" />
					</View>
					<View style={styles.contentView}>
						<Text style={styles.titleText}>Pulverização por {props.method === PulverizationMethods.DRONE ? 'Drone' : 'Avião'}</Text>
						<View style={styles.subtitleView}>
							<Text style={styles.subtitleText}>Empresa: {currentCompany.name}</Text>
							<Text style={styles.subtitleText}>
								Data da Pulverização: {formatDate(props.quotation.pulverization_start_date)} até {formatDate(props.quotation.pulverization_end_date)}
							</Text>
							<Text style={styles.subtitleText}>
								Valor:{' '}
								<NumberFormat
									fixedDecimalScale
									decimalScale={2}
									value={currentQuotation[props.paymentMethod!] ?? 0}
									displayType="text"
									thousandSeparator="."
									decimalSeparator=","
									prefix="R$ "
									renderText={(value) => <Text style={styles.valueText}>{value}</Text>}
								/>{' '}
								/ {getPaymentMethodText()}
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.buttonsView}>
					<Button mode="text" style={styles.button} labelStyle={styles.buttonText} onPress={props.onSeeMorePress}>
						Detalhes
					</Button>
				</View>
			</View>
		</Card>
	);
}

const styles = createTStyleSheet({
	card: {
		marginTop: '20rem',
		paddingTop: '16rem',
		paddingBottom: '8rem',
		paddingHorizontal: '16rem',
		elevation: 4,
		borderRadius: '16rem',
	},
	contentView: {
		paddingLeft: '16rem',
		alignItems: 'flex-start',
		maxWidth: '90%',
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
