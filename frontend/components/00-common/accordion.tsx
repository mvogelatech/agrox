import React from 'react';
import { Text, Card } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';
import { MaterialIcons } from '@expo/vector-icons';

type AccordionProps = {
	isExpanded: boolean;
	title: string;
	subtitle?: string;
	titleRight?: React.ReactNode;
	divider?: React.ReactNode;
	children: React.ReactNode;
	onPress: () => void;
};

export function Accordion(props: AccordionProps) {
	const styles = overrideTStyleSheet(defaultStyleSheet, {
		card: {
			paddingBottom: props.isExpanded ? '10rem' : 0,
		},
	});

	return (
		<Card style={styles.card}>
			<TouchableOpacity activeOpacity={0.5} style={styles.touchable} onPress={props.onPress}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
					<MaterialIcons name={props.isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color="#6C6464" style={styles.icon} />
					<View>
						<Text numberOfLines={1} style={styles.title}>
							{props.title}
						</Text>
						{props.subtitle ? (
							<Text numberOfLines={1} style={styles.subtitle}>
								{props.subtitle}
							</Text>
						) : undefined}
					</View>
				</View>
				{props.titleRight}
			</TouchableOpacity>
			{props.isExpanded ? (
				<View style={styles.childrenView}>
					{props.divider}
					{props.children}
				</View>
			) : undefined}
		</Card>
	);
}

const defaultStyleSheet = createTStyleSheet({
	childrenView: {
		paddingHorizontal: '8rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		elevation: '4rem',
		marginHorizontal: '2rem',
		marginTop: '2rem',
		marginBottom: '16rem',
		borderRadius: '10rem',
	},
	touchable: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: '16rem',
		paddingVertical: '16rem',
	},
	icon: {
		paddingTop: '2rem',
		fontSize: '25rem',
	},
	title: {
		marginLeft: '8rem',
		fontSize: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
		maxWidth: '200rem',
	},
	subtitle: {
		marginLeft: '8rem',
		fontSize: '14rem',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#78849E',
	},
});
