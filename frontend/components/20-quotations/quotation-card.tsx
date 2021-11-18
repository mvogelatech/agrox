import React from 'react';
import { View } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { createTStyleSheet } from '../../src/utils/style';

import { Models } from '../../models';
import { QuotationStatus } from './quotation-status';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { formatDate } from '../../src/utils';

dayjs.extend(isSameOrAfter);

type QuotationCardProps = {
	quotation_package: Models.quotation_package;
	onPress: () => void;
};

export function QuotationCard(props: QuotationCardProps) {
	function getResponseDate() {
		let date = dayjs('1990-01-01T03:00:00.000Z');
		for (const modal_pkg of props.quotation_package.quotation_modal_package) {
			for (const quotation of modal_pkg.quotation)
				if (quotation.response_date && dayjs(quotation.response_date).isSameOrAfter(date)) date = dayjs(quotation.response_date);
		}

		return formatDate(date.toISOString());
	}

	return (
		<Card style={styles.card} onPress={props.onPress}>
			<View style={styles.contentView}>
				<View style={styles.titleView}>
					<Text style={styles.titleText}>Pulverização {props.quotation_package.code}</Text>
					<MaterialIcons name="navigate-next" color="#6C6464" style={styles.icon} />
				</View>
				<View style={styles.dataView}>
					<Text numberOfLines={1} style={styles.contentText}>
						Áreas:{' '}
						{[
							...new Set(
								props.quotation_package.quotation_modal_package.flatMap((modal) => modal.field.flatMap((field) => field.area.name.split(' ')[1])),
							),
						]
							.slice()
							.sort(undefined)
							.join(', ')}
					</Text>

					<View>
						<Text numberOfLines={1} style={styles.contentText}>
							Talhões:{' '}
							{[...new Set(props.quotation_package.quotation_modal_package.flatMap((modal) => modal.field.map((field) => field.name.split(' ')[1])))]
								.slice()
								.sort(undefined)
								.join(', ')}
						</Text>
						<Text style={styles.contentText}>Data de Pedido: {formatDate(props.quotation_package.request_date)}</Text>
						{props.quotation_package.quotation_modal_package.some((modal) => modal.quotation.some((quotation) => quotation.response_date)) ? (
							<Text style={styles.contentText}>Data de Resposta: {getResponseDate()}</Text>
						) : undefined}
					</View>
				</View>
				<Divider style={styles.divider} />
				<View style={styles.statusView}>
					<QuotationStatus
						status={
							props.quotation_package.quotation_modal_package.some((modal) => modal.quotation.some((quotation) => quotation.response_date))
								? 'available'
								: 'preparing'
						}
					/>
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
	statusView: {
		flexDirection: 'row',
		paddingTop: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
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
		marginLeft: '16rem',
		color: '#469BA2',
	},
	icon: {
		fontSize: '22rem',
	},
});
