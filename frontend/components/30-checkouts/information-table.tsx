import React from 'react';
import { View, Image } from 'react-native';
import { Text, Card, Divider, Button } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import NumberFormat from 'react-number-format';
import { Models, PulverizationMethod, PulverizationMethods, PaymentMethod } from '../../models';
import { icons, colors } from '../../src/assets';
import { useMainSelector } from '../../redux-things';
import { formatDate } from '../../src/utils';
import { RoundIcon } from '../00-common';

type InformationTableProps = {
	method: PulverizationMethod;
	company: number;
	paymentMethod: PaymentMethod;
	quotation: Models.quotation_package;
	onDetailsPress: () => void;
};

export function InformationTable(props: InformationTableProps) {
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

	function getPaymentMethodText() {
		if (props.paymentMethod === 'antecipated_price') return 'Antecipado';
		if (props.paymentMethod === 'cash_price') return 'No Ato';
		return 'Em 30 Dias';
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
		<View style={styles.mainView}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<RoundIcon isEnabled icon={props.method === PulverizationMethods.DRONE ? 'drone' : 'plane'} color={colors.lightBlue} size="40rem" />
					<Text style={styles.titleText}>Pulverização por {props.method === PulverizationMethods.DRONE ? 'Drone' : 'Avião'}</Text>
				</View>
				<Button mode="text" labelStyle={styles.buttonText} onPress={props.onDetailsPress}>
					Detalhes
				</Button>
			</View>

			<Card style={styles.card}>
				<View style={styles.cardView}>
					<Text style={styles.textHeader}>EMPRESA A SER CONTRATADA</Text>
					<Text style={styles.companyName}>{currentCompany.name}</Text>
					<Text style={styles.address}>{`${currentCompany.address.street}, ${currentCompany.address.number ?? ''} - ${currentCompany.address.city}/${
						currentCompany.address.state.initials
					}`}</Text>

					<Divider style={styles.divider} />

					<View style={{ flexDirection: 'row', width: '100%' }}>
						<View style={{ flex: 1, alignItems: 'center' }}>
							<Text style={styles.textHeader}>MÉTODO</Text>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image source={props.method === PulverizationMethods.DRONE ? icons.drone : icons.plane} resizeMode="contain" style={styles.icon} />
								<Text>
									Pulverização{'\n'}com {props.method === PulverizationMethods.DRONE ? 'Drone' : 'Avião'}
								</Text>
							</View>
						</View>
						<View style={styles.tableView}>
							<Text style={styles.textHeader}>PERÍODO</Text>
							<Text style={styles.textContent}>{`${formatDate(props.quotation.pulverization_start_date)}\naté ${formatDate(
								props.quotation.pulverization_end_date,
							)}`}</Text>
						</View>
					</View>

					<Divider style={styles.divider} />

					<View style={{ flexDirection: 'row', width: '100%' }}>
						<View style={styles.tableView}>
							<Text style={styles.textHeader}>VALOR</Text>
							<NumberFormat
								fixedDecimalScale
								decimalScale={2}
								value={currentQuotation[props.paymentMethod!] ?? 0}
								displayType="text"
								thousandSeparator="."
								decimalSeparator=","
								prefix="R$ "
								renderText={(value) => <Text style={styles.valueText}>{value}</Text>}
							/>
						</View>
						<View style={styles.tableView}>
							<Text style={styles.textHeader}>PAGAMENTO</Text>
							<Text style={styles.textContent}>{getPaymentMethodText()}</Text>
						</View>
					</View>

					<Divider style={styles.divider} />

					<View style={{ flexDirection: 'row', width: '100%' }}>
						<View style={styles.tableView}>
							<Text style={styles.textHeader}>PROPRIEDADES</Text>
							<Text style={styles.textContent}>
								Área{' '}
								{[
									...new Set(
										props.quotation.quotation_modal_package.flatMap((modal) =>
											modal.pulverization_method === props.method ? modal.field.map((field) => field.area.name.split(' ')[1]) : undefined,
										),
									),
								]
									.filter(Boolean)
									.sort(undefined)
									.join(', ')}
							</Text>
						</View>
						<View style={styles.tableView}>
							<Text style={styles.textHeader}>TALHÕES</Text>
							<Text style={styles.textContent}>
								{[
									...new Set(
										props.quotation.quotation_modal_package.flatMap((modal) =>
											modal.pulverization_method === props.method ? modal.field.map((field) => field.name.split(' ')[1]) : undefined,
										),
									),
								]
									.filter(Boolean)
									.sort(undefined)
									.join(', ')}
							</Text>
						</View>
					</View>
				</View>
			</Card>
		</View>
	);
}

const styles = createTStyleSheet({
	divider: {
		width: '100%',
		marginVertical: '16rem',
		height: '1rem',
	},
	mainView: {
		paddingHorizontal: '16rem',
		paddingTop: '32rem',
		paddingBottom: '80rem',
		backgroundColor: 'white',
	},
	titleText: {
		paddingLeft: '16rem',
		fontSize: '16rem',
		fontWeight: 'bold',
	},
	card: {
		borderRadius: '13rem',
		elevation: 4,
		marginHorizontal: '2rem',
		marginTop: '24rem',
		marginBottom: '10rem',
	},
	cardView: {
		padding: '24rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	tableView: {
		flex: 1,
		alignItems: 'center',
	},
	companyName: {
		fontSize: '20rem',
	},
	address: {
		fontSize: '12rem',
		color: '#78849E',
	},
	textHeader: {
		color: '#78849E',
		textAlign: 'center',
	},
	textContent: {
		textAlign: 'center',
	},
	valueText: {
		fontSize: '16rem',
	},
	$size: '20rem',
	icon: {
		width: '$size',
		height: '$size',
		tintColor: colors.lightBlue,
		marginRight: '16rem',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
