import React from 'react';
import { View, Text } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { Divider } from 'react-native-paper';
import { ClosableHeader } from '../00-common';
import { useMainSelector } from '../../redux-things';
import { formatDate } from '../../src/utils';
import { PulverizationMethod, PaymentMethod, Models, PulverizationMethods } from '../../models';
import NumberFormat from 'react-number-format';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { AgroXScreenProps } from '../navigation-types';

type QuotationDetailsProps = {
	method: PulverizationMethod;
	company: number;
	paymentMethod: PaymentMethod;
	quotation: Models.quotation_package;
	onSeeMorePress: () => void;
};

type ScreenProps = AgroXScreenProps<'QuotationDetails'>;

export const QuotationDetails = asAliveOnlyScreenComponent(({ navigation, route }: ScreenProps) => {
	function getPaymentMethodText() {
		if (route.params.paymentMethod === 'antecipated_price') return 'Antecipado';
		if (route.params.paymentMethod === 'cash_price') return 'No Ato';
		return 'Em 30 Dias';
	}

	function getQuotationFromCompanyIdByModal() {
		for (const modal of route.params.quotation.quotation_modal_package) {
			if (modal.pulverization_method === route.params.method) {
				for (const quotation of modal.quotation) {
					if (quotation.company_id === route.params.company) {
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
			if (company.id === route.params.company) return company;
		}

		throw new Error('A company should have been found!');
	}

	const currentCompany = getCompanyById();
	const currentQuotation = getQuotationFromCompanyIdByModal();

	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<ClosableHeader
				title="Detalhes da Pulverização"
				customStyle={{ paddingLeft: '16rem', marginTop: '9rem', fontWeight: 'bold', color: '#6F6F6F' }}
				onClose={() => {
					navigation.goBack();
				}}
			/>
			<View style={styles.mainView}>
				<Text style={styles.titleText}>EMPRESA A SER CONTRATADA</Text>
				<Text style={styles.companyText}>{currentCompany.name}</Text>
				<Text style={styles.address}>{`${currentCompany.address.street}, ${currentCompany.address.number ?? ''} - ${currentCompany.address.city}/${
					currentCompany.address.state.initials
				}`}</Text>

				<Divider style={styles.divider} />

				<Text style={styles.titleText}>MÉTODO</Text>
				<Text>Pulverização por {route.params.method === PulverizationMethods.DRONE ? 'Drone' : 'Avião'}</Text>
				<Divider style={styles.divider} />

				<Text style={styles.titleText}>PERÍODO</Text>
				<Text>
					{formatDate(route.params.quotation.pulverization_start_date)} até {formatDate(route.params.quotation.pulverization_end_date)}
				</Text>
				<Divider style={styles.divider} />

				<Text style={styles.titleText}>PROPRIEDADE</Text>
				<Text>
					{[
						...new Set(
							route.params.quotation.quotation_modal_package.flatMap((modal) =>
								modal.pulverization_method === route.params.method ? modal.field.flatMap((field) => field.area.name.split(' ')[1]) : undefined,
							),
						),
					]
						.filter(Boolean)
						.sort(undefined)
						.join(', ')}
				</Text>
				<Divider style={styles.divider} />

				<Text style={styles.titleText}>TALHÕES</Text>
				<Text>
					{[
						...new Set(
							route.params.quotation.quotation_modal_package.flatMap((modal) =>
								modal.pulverization_method === route.params.method ? modal.field.map((field) => field.name.split(' ')[1]) : undefined,
							),
						),
					]
						.filter(Boolean)
						.sort(undefined)
						.join(', ')}
				</Text>
				<Divider style={styles.divider} />

				<Text style={styles.titleText}>VALOR</Text>
				<Text>
					<NumberFormat
						fixedDecimalScale
						decimalScale={2}
						value={currentQuotation[route.params.paymentMethod!] ?? 0}
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
	);
});

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		// flexWrap: 'wrap',
		// flexBasis: '33.333%',
		padding: '24rem',
		backgroundColor: 'white',
		justifyContent: 'space-evenly',
	},
	titleText: {
		color: '#78849E',
		lineHeight: '25rem',
	},
	address: {
		color: '#78849E',
	},
	companyText: {
		fontSize: '18rem',
	},
	valueText: {
		fontSize: '18rem',
	},
	divider: {
		height: '1rem',
		marginVertical: '20rem',
	},
});
