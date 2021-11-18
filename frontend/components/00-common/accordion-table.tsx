import React from 'react';
import { Text, Card } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';
import { MaterialIcons } from '@expo/vector-icons';

type AccordionTableProps = {
	isExpanded: boolean;
	date: string;
	operation: string;
	// titleRight?: React.ReactNode;
	// divider?: React.ReactNode;
	children: React.ReactNode;
	onPress: () => void;
};

export function AccordionTable(props: AccordionTableProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		card: {
			paddingBottom: props.isExpanded ? '10rem' : 0,
		},
	});

	return (
		<Card style={styles.card}>
			<TouchableOpacity activeOpacity={0.5} style={styles.touchable} onPress={props.onPress}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
					<View>
						<Text style={styles.date}>{props.date}</Text>
					</View>
					<View>
						<Text style={styles.operation}>{props.operation}</Text>
					</View>
					<MaterialIcons name={props.isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color="#6C6464" style={styles.icon} />
				</View>
				{/* {props.titleRight} */}
			</TouchableOpacity>

			{props.isExpanded ? (
				<View style={styles.childrenView}>
					{/* {props.divider} */}
					{props.children}
				</View>
			) : undefined}
		</Card>
	);
}

const defaultStyleSheet = createTStyleSheet({
	childrenView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		// paddingBottom: '16rem',
		// marginLeft: '10rem',
		backgroundColor: '#F8F8F8',
		// paddingHorizontal: '10rem',
	},
	card: {
		// color: '#EFF0F0',
		// elevation: '4rem',
		// marginHorizontal: '2rem',
		// marginTop: '2rem',
		// marginBottom: '16rem',
		// borderRadius: '10rem',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: '10rem',
		backgroundColor: '#EFF0F0',
		marginBottom: '-10rem'
	},
	touchable: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: '10rem',
		paddingVertical: '8rem',
	},
	icon: {
		paddingTop: '2rem',
		fontSize: '25rem',
		fontWeight: 'bold',
		marginLeft: '20rem',
		// paddingRight: '10rem',
	},
	date: {
		fontSize: '14rem',
		maxWidth: '140rem',
		minWidth: '140rem',
		color: '#767F82',
	},
	operation: {
		marginLeft: '5rem',
		fontSize: '14rem',
		maxWidth: '140rem',
		minWidth: '140rem',
		color: '#767F82',
	},
});
