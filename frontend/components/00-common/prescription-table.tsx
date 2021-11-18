import React, { useRef } from 'react';
import { Text, Button, Divider } from 'react-native-paper';
import { ScrollView, View } from 'react-native';

import { EmptyPrescription, Models } from '../../models';

import { createTStyleSheet, overrideTStyleSheet } from '../../src/utils/style';
import { WhatsappButton } from './whatsapp-button';
import { displayAlert } from '../../src/utils/alert-messages';
import { scrollToEndAndBack } from '../../src/utils';

type PrescriptionTableProps = {
	prescription: Models.prescription;
	mode: 'card' | 'details';
	onWhatsAppButtonPress: () => void;
};

export function PrescriptionTable(props: PrescriptionTableProps) {
	const scrollViewRef = useRef<ScrollView>(null);

	let currentMethod: Models.GeneralPrescription;
	let currentMethod2: Models.GeneralPrescription;
	let currentMethod3: Models.GeneralPrescription;
	// if (props.prescription?.content?.recommended_method === PulverizationMethods.DRONE) currentMethodDrone = props.prescription.content.drone;
	// else if (props.prescription?.content?.recommended_method === PulverizationMethods.PLANE) currentMethodPlane = props.prescription.content.plane;
	// else {
	if (props.prescription.content.drone.products.length > 0) {
		currentMethod = props.prescription.content.drone;
	} else {
		currentMethod = EmptyPrescription;
	}

	if (props.prescription.content.plane.products.length > 0) {
		currentMethod2 = props.prescription.content.plane;
	} else {
		currentMethod2 = EmptyPrescription;
	}

	if (props.prescription.content.terrestrial.products.length > 0) {
		currentMethod3 = props.prescription.content.terrestrial;
	} else {
		currentMethod3 = EmptyPrescription;
	}

	// console.log('drone', currentMethod);
	// console.log('terrestrial', currentMethod2);
	// console.log('plane', currentMethod3);
	// }

	const helper1 = new Map<string, [number, string, string]>();
	const helper2 = new Map<string, [number, string, string]>();
	const helper3 = new Map<string, [number, string, string]>();
	for (const obj of currentMethod.products) {
		const key = obj.product + '###' + String(obj.dosage);
		if (helper1.has(key)) helper1.set(key, [helper1.get(key)![0] + obj.total, obj.unity, obj.plague]);
		else helper1.set(key, [obj.total, obj.unity, obj.plague]);
	}

	for (const obj of currentMethod2.products) {
		const key = obj.product + '###' + String(obj.dosage);
		if (helper2.has(key)) helper2.set(key, [helper2.get(key)![0] + obj.total, obj.unity, obj.plague]);
		else helper2.set(key, [obj.total, obj.unity, obj.plague]);
	}

	for (const obj of currentMethod3.products) {
		const key = obj.product + '###' + String(obj.dosage);
		if (helper3.has(key)) helper3.set(key, [helper3.get(key)![0] + obj.total, obj.unity, obj.plague]);
		else helper3.set(key, [obj.total, obj.unity, obj.plague]);
	}

	// const helper2 = new Map<string, [number, string]>();
	// for (const obj of currentMethodPlane.products) {
	// 	const key = obj.product + '###' + String(obj.dosage);
	// 	if (helper2.has(key)) helper2.set(key, [helper2.get(key)![0] + obj.total, obj.unity]);
	// 	else helper2.set(key, [obj.total, obj.unity]);
	// }

	const styles = overrideTStyleSheet(defaultStyleSheet, {
		scrollBar: {
			maxHeight: props.mode === 'card' ? '200rem' : '140rem',
		},
	});
	console.log('teste2', currentMethod3);

	return (
		<View style={{ flexDirection: 'column' }}>
			<View>
				<ScrollView ref={scrollViewRef} style={styles.scrollBar} onLayout={() => scrollToEndAndBack(scrollViewRef, 'scrollview')}>
					<View style={styles.syrupTable}>
						<Text style={styles.tablesTitles}>Tratamento primário: Drone</Text>
					</View>
					<View style={styles.contentView}>
						<Text style={styles.header}>Ervas Daninhas</Text>
						<Text style={styles.header}>Produto</Text>
						<Text style={styles.header}>Dosagem</Text>
						<Text style={styles.lastHeader}>Total</Text>
					</View>
					<Divider style={styles.divider} />
					{[...helper1].map((product) => (
						<View key={product[0]}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={styles.content}>{`${product[1][2]}`}</Text>
								<Text style={styles.content}>{`${product[0].split('###')[0]}`}</Text>
								<Text style={styles.content}>{`${Number.parseFloat(product[0].split('###')[1]).toFixed(2)}\t\t${product[1][1]}/HA`}</Text>
								<Text style={styles.lastContent}>{`${product[1][0].toFixed(2)}\t\t${product[1][1]}`}</Text>
							</View>
							<Divider style={styles.divider} />
						</View>
					))}
					<View style={styles.syrup}>
						<Text style={styles.boxTitles}>{`Volume de Calda: ${currentMethod.products.length > 0 ? currentMethod.products[0].syrup : 'N/A'} L/HA `}</Text>
					</View>
					<View style={styles.syrupComments}>
						<Text style={styles.boxTitles}>{`Comentários: ${currentMethod.comments.map((txt) => ` ${txt}`).join('\n')}`}</Text>
					</View>
					<View style={styles.syrupTable}>
						<Text style={styles.tablesTitles}>Tratamento secundário: Terrestre Manual</Text>
					</View>
					<View style={styles.contentView}>
						<Text style={styles.header}>Ervas Daninhas</Text>
						<Text style={styles.header}>Produto</Text>
						<Text style={styles.header}>Dosagem</Text>
						<Text style={styles.lastHeader}>Total</Text>
					</View>
					<Divider style={styles.divider} />
					{[...helper3].map((product) => (
						<View key={product[0]}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={styles.content}>{`${product[1][2]}`}</Text>
								<Text style={styles.content}>{`${product[0].split('###')[0]}`}</Text>
								<Text style={styles.content}>{`${Number.parseFloat(product[0].split('###')[1]).toFixed(2)}\t\t${product[1][1]}/HA`}</Text>
								<Text style={styles.lastContent}>{`${product[1][0].toFixed(2)}\t\t${product[1][1]}`}</Text>
							</View>
							<Divider style={styles.divider} />
						</View>
					))}
					<View style={styles.syrup}>
						<Text style={styles.boxTitles}>{`Volume de Calda: ${
							currentMethod3.products.length > 0 ? currentMethod3.products[0].syrup : 'N/A'
						} L/HA `}</Text>
					</View>
					<View style={styles.syrupComments}>
						<Text style={styles.boxTitles}>{`Comentários: ${currentMethod3.comments.map((txt) => ` ${txt}`).join('\n')}`}</Text>
					</View>
					{/* <View style={styles.syrupTable}>
						<Text style={styles.tablesTitles}>Tratamento terciário: Terrestre</Text>
					</View>
					<View style={styles.contentView}>
						<Text style={styles.header}>Ervas Daninhas</Text>
						<Text style={styles.header}>Produto</Text>
						<Text style={styles.header}>Dosagem</Text>
						<Text style={styles.lastHeader}>Total</Text>
					</View>
					<Divider style={styles.divider} />
					{[...helper3].map((product) => (
						<View key={product[0]}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={styles.content}>{`${product[1][2]}`}</Text>
								<Text style={styles.content}>{`${product[0].split('###')[0]}`}</Text>
								<Text style={styles.content}>{`${Number.parseFloat(product[0].split('###')[1]).toFixed(2)}\t\t${product[1][1]}/HA`}</Text>
								<Text style={styles.lastContent}>{`${product[1][0].toFixed(2)}\t\t${product[1][1]}`}</Text>
							</View>
							<Divider style={styles.divider} />
						</View>
					))}
					<View style={styles.syrup}>
						<Text style={styles.boxTitles}>{`Volume de Calda: ${
							currentMethod3.products.length > 0 ? currentMethod3.products[0].syrup : 'N/A'
						} L/HA `}</Text>
					</View>
					<View style={styles.syrupComments}>
						<Text style={styles.boxTitles}>{`Comentários: ${currentMethod3.comments.map((txt) => ` ${txt}`).join('\n')}`}</Text>
					</View> */}
				</ScrollView>
				{/*
				<Button
					icon="information"
					uppercase={false}
					disabled={false}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={() => {
						displayAlert({ title: 'Comentários do Agrônomo', body: currentMethod.comments.map((txt) => `* ${txt}`).join('\n'), buttonText: 'OK' });
					}}
				>
					Comentários
				</Button> */}
			</View>
			<View style={styles.buttonView}>
				<WhatsappButton text="Dúvidas? Fale com um agrônomo" onPress={props.onWhatsAppButtonPress} />
			</View>
		</View>
	);
}

const defaultStyleSheet = createTStyleSheet({
	scrollBar: {
		flexGrow: 0,
		paddingRight: '10rem',
	},
	contentView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	buttonView: {
		bottom: 0,
		width: '100%',
	},
	button: {
		height: '30rem',
		justifyContent: 'center',
		backgroundColor: 'white',
		marginVertical: '12rem',
	},
	buttonText: {
		color: '#6C6464',
		fontSize: '14rem',
	},
	syrup: {
		marginTop: '12rem - $marginVertical',
		backgroundColor: '#F9F9F9',
		borderWidth: '1rem',
		borderColor: '#EFEFEF',
		paddingVertical: '5rem',
		justifyContent: 'center',
	},
	syrupComments: {
		marginTop: '12rem - $marginVertical',
		// backgroundColor: '#F9F9F9',
		borderWidth: '1rem',
		borderColor: '#EFEFEF',
		paddingVertical: '5rem',
		justifyContent: 'center',
	},
	syrupTable: {
		marginTop: '12rem - $marginVertical',
		backgroundColor: '#C9E9CD',
		borderWidth: '1rem',
		borderColor: '#EFEFEF',
		paddingVertical: '5rem',
		justifyContent: 'center',
	},
	header: {
		fontSize: '13rem',
		color: '#78849E',
		fontWeight: '500',
		maxWidth: '95rem',
		minWidth: '95rem',
	},
	lastHeader: {
		fontSize: '13rem',
		color: '#78849E',
		fontWeight: '500',
		paddingRight: '10rem',
	},
	boxTitles: {
		fontSize: '13rem',
		color: '#78849E',
		fontWeight: '500',
		alignSelf: 'center',
	},
	boxTitlesComments: {
		fontSize: '13rem',
		color: '#78849E',
		fontWeight: '500',
		alignSelf: 'center',
	},
	tablesTitles: {
		fontSize: '14rem',
		color: '#454F63',
		fontWeight: '700',
		alignSelf: 'center',
	},
	$marginVertical: '4rem',
	divider: {
		height: '1rem',
		marginVertical: '$marginVertical',
	},

	content: {
		maxWidth: '95rem',
		minWidth: '95rem',
		fontSize: '12rem',
	},
	lastContent: {
		fontSize: '12rem',
	},
});
