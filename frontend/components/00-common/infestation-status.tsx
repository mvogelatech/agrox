import React from 'react';
import { View } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { createTStyleSheet } from '../../src/utils/style';
import { getSemaphoreColor, useThresholds } from '../../src/utils/semaphore';
import { RoundIcon } from './round-icon';

type InfestationStatusProps = {
	totalArea: number;
	affectedArea: number;
};

export function InfestationStatus(props: InfestationStatusProps) {
	const semaphoreThresholds = useThresholds();

	const infestationPercentage = props.totalArea === 0 ? 0 : (props.affectedArea / props.totalArea) * 100;
	return (
		<View style={styles.mainView}>
			<View style={styles.item}>
				<Text style={styles.header}>ÁREA{'\n'}TOTAL (HA)</Text>
				<Text numberOfLines={3} style={styles.contentBig}>
					{props.totalArea.toFixed(2)}
				</Text>
			</View>

			<View style={styles.item}>
				<Text style={styles.header}>ÁREA AFETADA{'\n'}TOTAL (HA)</Text>
				<Text numberOfLines={1} style={styles.contentBig}>
					{props.affectedArea.toFixed(2)}
				</Text>
			</View>

			<View style={styles.item}>
				<Text style={styles.header}>INFESTAÇÃO{'\n'}TOTAL</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<RoundIcon isEnabled icon="warning" color={getSemaphoreColor(infestationPercentage, semaphoreThresholds)} size="16rem" />
					<Divider style={styles.horizontalSpacer} />
					<Text numberOfLines={1} style={styles.contentBig}>
						{`${infestationPercentage.toFixed(2)}%`}
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	item: {
		alignItems: 'baseline',
	},
	header: {
		fontSize: '12rem',
		color: '#78849E',
		fontWeight: '900',
	},
	contentBig: {
		fontSize: '20rem',
	},
	horizontalSpacer: {
		width: 0,
		height: 0,
		margin: '1rem',
	},
});
