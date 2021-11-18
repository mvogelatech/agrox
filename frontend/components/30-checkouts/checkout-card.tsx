import React from 'react';
import { View } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { createTStyleSheet } from '../../src/utils/style';
import { Models } from '../../models';
import { formatDate } from '../../src/utils';
import { useMainSelector } from '../../redux-things';

dayjs.extend(isSameOrAfter);

type CheckoutCardProps = {
	quoation_checkout_group: Models.quotation_checkout_group;
	onPress: () => void;
};

export function CheckoutCard(props: CheckoutCardProps) {
	const quotationPackages = useMainSelector((state) => state.backendData.quotationPackages)!;
	function findQuotationPackageById(id: number) {
		for (const pkg of quotationPackages) if (pkg.id === id) return pkg;
		throw new Error('No quotation found by this ID');
	}

	const currentQuotationPackage = findQuotationPackageById(props.quoation_checkout_group[0].quotation?.quotation_modal_package.quotation_package.id!);

	return (
		<Card style={styles.card} onPress={props.onPress}>
			<View style={styles.contentView}>
				<View style={styles.titleView}>
					<Text style={styles.titleText}>Pulverização {props.quoation_checkout_group[0].quotation!.quotation_modal_package.quotation_package.code}</Text>
					<MaterialIcons name="navigate-next" color="#6C6464" style={styles.icon} />
				</View>
				<View style={styles.dataView}>
					<Text numberOfLines={1} style={styles.contentText}>
						Áreas:{' '}
						{[
							...new Set(
								currentQuotationPackage.quotation_modal_package.flatMap((modal) => modal.field.flatMap((field) => field.area.name.split(' ')[1])),
							),
						]
							.slice()
							.sort(undefined)
							.join(', ')}
					</Text>

					<View>
						<Text numberOfLines={1} style={styles.contentText}>
							Talhões:{' '}
							{[...new Set(currentQuotationPackage.quotation_modal_package.flatMap((modal) => modal.field.map((field) => field.name.split(' ')[1])))]
								.slice()
								.sort(undefined)
								.join(', ')}
						</Text>
						<Text style={styles.contentText}>Data de Contratação: {formatDate(props.quoation_checkout_group[0].checkout_date)}</Text>
					</View>
				</View>
				<Divider style={styles.divider} />
				<View style={styles.statusView}>
					<MaterialCommunityIcons name="check-circle-outline" style={styles.statusIcon} />
					<Text style={styles.statusText}>Pulverização Contratada</Text>
				</View>
			</View>
		</Card>
	);
}

const styles = createTStyleSheet({
	card: {
		borderRadius: '8rem',
		elevation: '4rem',
		marginVertical: '8rem',
		marginHorizontal: '16rem',
		paddingVertical: '16rem',
		paddingHorizontal: '24rem',
	},
	contentView: {
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	titleView: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dataView: {
		marginVertical: '16rem',
	},

	titleText: {
		fontSize: '16rem',
	},
	contentText: {
		fontSize: '14rem',
		color: '#78849E',
	},
	divider: {
		width: '100%',
		height: '1rem',
	},
	statusText: {
		fontSize: '14rem',
		fontWeight: 'bold',
		marginLeft: '8rem',
		color: '#469BA2',
	},
	icon: {
		fontSize: '22rem',
	},
	statusView: {
		flexDirection: 'row',
		paddingTop: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	statusIcon: {
		fontSize: '22rem',
		color: '#469BA2',
	},
});
