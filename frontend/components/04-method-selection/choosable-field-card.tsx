// import * as React from 'react';
import React, { useEffect } from 'react';

// import { Card, Divider, RadioButton, Checkbox } from 'react-native-paper';
import { Card, Divider, Checkbox } from 'react-native-paper';
import { View, Text, AsyncStorage } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
// import { Models, PulverizationMethod, PulverizationMethods } from '../../models';
import { Models } from '../../models';
// import { FieldCard } from '../00-common/field-card';
import { getLatestCrop } from '../../src/utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';

type ChoosableFieldCardProps = {
	fields: Models.field[];
	// isDiagnosisMode: boolean;
	// chosenMethod: PulverizationMethod;
	onRadioButtonPress: (method: PulverizationMethod) => void;
};

export function ChoosableFieldCard(props: ChoosableFieldCardProps) {
	// console.log(props.fields[0].crop[0].diagnosis[0].prescription[0]);
	// export function ChoosableFieldCard() {
	// const latestCrop = getLatestCrop(props.field);
	// console.log('+++++++pa', latestCrop.diagnosis[0].prescription[0]);
	// const recommendedMethodNumber = getLatestPrescriptionPulverizationMethod(props.field);
	// const recommendedMethod = recommendedMethodNumber === 1 ? 'Drone' : recommendedMethodNumber === 2 ? 'Plane' : undefined;

	const [checked, setChecked] = React.useState(false);
	const [checked2, setChecked2] = React.useState(false);
	const [checked3, setChecked3] = React.useState(false);
	const [checked4, setChecked4] = React.useState(false);
	const [checked5, setChecked5] = React.useState(false);
	const [checked6, setChecked6] = React.useState(false);

	useEffect(() => {}, []);

	useEffect(() => {
		props.fields.forEach((field) => {
			if (field.crop[0].diagnosis.length > 0) {
				if (field.crop[0].diagnosis[0].prescription.length > 0) {
					if (field.crop[0].diagnosis[0].prescription[0].content.drone.products) {
						field.crop[0].diagnosis[0].prescription[0].content.drone.products.forEach((element) => {
							switch (element.plague) {
								case 'Outras folhas largas': {
									(async () => {
										setChecked5(true);
										await AsyncStorage.setItem('OFL', 'Outras Folhas Largas');
									})();

									break;
								}

								case 'Daninhas indefinidas': {
									(async () => {
										setChecked(true);
										await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');
									})();

									break;
								}

								case 'Gramíneas porte baixo': {
									(async () => {
										setChecked3(true);
										await AsyncStorage.setItem('GB', 'Gramíneas Porte Baixo');
									})();

									break;
								}

								case 'Gramíneas porte alto': {
									(async () => {
										setChecked2(true);
										await AsyncStorage.setItem('GA', 'Gramíneas Porte Alto');
									})();

									break;
								}

								case 'Mamona': {
									(async () => {
										setChecked4(true);
										await AsyncStorage.setItem('M', 'Mamona');
									})();

									break;
								}

								default: {
									(async () => {
										setChecked6(true);
										await AsyncStorage.setItem('T', 'Trepadeiras');
									})();

									break;
								}
							}
						});
					}
					if (field.crop[0].diagnosis[0].prescription[0].content.plane.products) {
						field.crop[0].diagnosis[0].prescription[0].content.plane.products.forEach((element) => {
							switch (element.plague) {
								case 'Outras folhas largas': {
									(async () => {
										setChecked5(true);
										await AsyncStorage.setItem('OFL', 'Outras Folhas Largas');
									})();

									break;
								}

								case 'Daninhas indefinidas': {
									(async () => {
										setChecked(true);
										await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');
									})();

									break;
								}

								case 'Mamona': {
									(async () => {
										setChecked4(true);
										await AsyncStorage.setItem('M', 'Mamona');
									})();

									break;
								}

								case 'Gramíneas porte baixo': {
									(async () => {
										setChecked3(true);
										await AsyncStorage.setItem('GB', 'Gramíneas Porte Baixo');
									})();

									break;
								}

								case 'Gramíneas porte alto': {
									(async () => {
										setChecked2(true);
										await AsyncStorage.setItem('GA', 'Gramíneas Porte Alto');
									})();

									break;
								}

								default: {
									(async () => {
										setChecked6(true);
										await AsyncStorage.setItem('T', 'Trepadeiras');
									})();

									break;
								}
							}
						});
					}
					if (field.crop[0].diagnosis[0].prescription[0].content.terrestrial.products) {
						field.crop[0].diagnosis[0].prescription[0].content.terrestrial.products.forEach((element) => {
							switch (element.plague) {
								case 'Outras folhas largas': {
									(async () => {
										setChecked5(true);
										await AsyncStorage.setItem('OFL', 'Outras Folhas Largas');
									})();

									break;
								}

								case 'Daninhas indefinidas': {
									(async () => {
										setChecked(true);
										await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');
									})();

									break;
								}

								case 'Mamona': {
									(async () => {
										setChecked4(true);
										await AsyncStorage.setItem('M', 'Mamona');
									})();

									break;
								}

								case 'Gramíneas porte baixo': {
									(async () => {
										setChecked3(true);
										await AsyncStorage.setItem('GB', 'Gramíneas Porte Baixo');
									})();

									break;
								}

								case 'Gramíneas porte alto': {
									(async () => {
										setChecked2(true);
										await AsyncStorage.setItem('GA', 'Gramíneas Porte Alto');
									})();

									break;
								}

								default: {
									(async () => {
										setChecked6(true);
										await AsyncStorage.setItem('T', 'Trepadeiras');
									})();

									break;
								}
							}
						});
					}
				}
			}
		});
	}, []);

	return (
		<View style={styles.mainView}>
			<Card style={styles.card}>
				<CheckBox
					title="Daninhas Indefinidas"
					checked={checked}
					checkedColor="#469BA2"
					containerStyle={styles.checkbox}
					onPress={() => {
						if (checked) {
							// try {
							(async () => {
								await AsyncStorage.setItem('DI', '');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						} else {
							// try {
							(async () => {
								await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						}
						// await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');

						// checked ? 'checked' : 'unchecked';
						// Array.prototype.push.apply(teste, ['oi']);
						// // var total = teste.push('teste');
						// console.log('teste', teste);

						setChecked(!checked);
					}}
				/>
				<CheckBox
					title="Gramíneas Porte Alto"
					checked={checked2}
					checkedColor="#469BA2"
					containerStyle={styles.checkbox}
					onPress={() => {
						if (checked2) {
							// try {
							(async () => {
								await AsyncStorage.setItem('GA', '');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						} else {
							// try {
							(async () => {
								await AsyncStorage.setItem('GA', 'Gramíneas Porte Alto');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						}
						// await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');

						// checked ? 'checked' : 'unchecked';
						// Array.prototype.push.apply(teste, ['oi']);
						// // var total = teste.push('teste');
						// console.log('teste', teste);

						setChecked2(!checked2);
					}}
				/>
				<CheckBox
					title="Gramíneas Porte Baixo"
					checked={checked3}
					checkedColor="#469BA2"
					containerStyle={styles.checkbox}
					onPress={() => {
						if (checked3) {
							// try {
							(async () => {
								await AsyncStorage.setItem('GB', '');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						} else {
							// try {
							(async () => {
								await AsyncStorage.setItem('GB', 'Gramíneas Porte Baixo');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						}
						// await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');

						// checked ? 'checked' : 'unchecked';
						// Array.prototype.push.apply(teste, ['oi']);
						// // var total = teste.push('teste');
						// console.log('teste', teste);

						setChecked3(!checked3);
					}}
				/>
				<CheckBox
					title="Mamona"
					checked={checked4}
					checkedColor="#469BA2"
					containerStyle={styles.checkbox}
					onPress={() => {
						if (checked4) {
							// try {
							(async () => {
								await AsyncStorage.setItem('M', '');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						} else {
							// try {
							(async () => {
								await AsyncStorage.setItem('M', 'Mamona');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						}
						// await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');

						// checked ? 'checked' : 'unchecked';
						// Array.prototype.push.apply(teste, ['oi']);
						// // var total = teste.push('teste');
						// console.log('teste', teste);

						setChecked4(!checked4);
					}}
				/>
				<CheckBox
					title="Outras Folhas Largas"
					checked={checked5}
					checkedColor="#469BA2"
					containerStyle={styles.checkbox}
					onPress={() => {
						if (checked5) {
							// try {
							(async () => {
								await AsyncStorage.setItem('OFL', '');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						} else {
							// try {
							(async () => {
								await AsyncStorage.setItem('OFL', 'Outras Folhas Largas');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						}
						// await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');

						// checked ? 'checked' : 'unchecked';
						// Array.prototype.push.apply(teste, ['oi']);
						// // var total = teste.push('teste');
						// console.log('teste', teste);

						setChecked5(!checked5);
					}}
				/>
				<CheckBox
					title="Trepadeiras"
					checked={checked6}
					checkedColor="#469BA2"
					containerStyle={styles.checkbox}
					onPress={() => {
						if (checked6) {
							// try {
							(async () => {
								await AsyncStorage.setItem('T', '');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						} else {
							// try {
							(async () => {
								await AsyncStorage.setItem('T', 'Trepadeiras');
							})();

							// } catch (error) {
							// 	console.log(error);
							// }
						}
						// await AsyncStorage.setItem('DI', 'Daninhas Indefinidas');

						// checked ? 'checked' : 'unchecked';
						// Array.prototype.push.apply(teste, ['oi']);
						// // var total = teste.push('teste');
						// console.log('teste', teste);

						setChecked6(!checked6);
					}}
				/>

				{/* <TouchableOpacity style={styles.radioItemView} onPress={() => props.onRadioButtonPress(PulverizationMethods.PLANE)}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RadioButton color="#327387" value="Plane" />
								<Text style={styles.itemText}>Avião</Text>
								{recommendedMethod === 'Plane' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined}
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={styles.radioItemView} onPress={() => props.onRadioButtonPress(PulverizationMethods.PLANE)}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RadioButton color="#327387" value="Plane" />
								<Text style={styles.itemText}>Avião</Text>
								{recommendedMethod === 'Plane' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined}
							</View>
						</TouchableOpacity> */}
				{/* </RadioButton.Group> */}
				{/* ) : undefined} */}
			</Card>
			{/* <Card style={styles.card}>
				<Divider />
				<View style={styles.fieldView}>
					<FieldCard isHideCircle isIndexNotAvailable={false} isDiagnosisMode={props.isDiagnosisMode} isElevated={false} field={props.field} />
				</View>
				<Divider style={styles.divider} /> */}
			{/* <View style={styles.choosableView}>
					<RadioButton.Group
						value={props.chosenMethod === PulverizationMethods.DRONE ? 'Drone' : props.chosenMethod === PulverizationMethods.PLANE ? 'Plane' : ''}
						onValueChange={() => console.log('')}
					>
						<TouchableOpacity style={styles.radioItemView} onPress={() => props.onRadioButtonPress(PulverizationMethods.DRONE)}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RadioButton color="#327387" value="Drone" />
								<Text style={styles.itemText}>Drone</Text>
								{recommendedMethod === 'Drone' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined}
							</View>
						</TouchableOpacity>
						<Divider style={styles.divider} />
						<TouchableOpacity style={styles.radioItemView} onPress={() => props.onRadioButtonPress(PulverizationMethods.PLANE)}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RadioButton color="#327387" value="Plane" />
								<Text style={styles.itemText}>Avião</Text>
								{recommendedMethod === 'Plane' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined}
							</View>
						</TouchableOpacity>
					</RadioButton.Group>
				</View> */}
			{/* </Card> */}
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flexBasis: '100%',
	},
	choosableView: {
		marginVertical: '8rem',
		paddingRight: '6rem',
		alignItems: 'flex-start',
		justifyContent: 'space-around',
	},
	methodText: {
		textAlign: 'center',
		fontSize: '12rem',
		color: '#78849E',
		paddingVertical: '8rem',
	},
	card: {
		elevation: '4rem',
		margin: '8rem',
		borderRadius: '10rem',
	},
	fieldView: {
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	divider: {
		width: '100%',
		height: '1rem',
		marginVertical: '4rem',
	},
	itemText: {
		paddingLeft: '1rem',
	},
	recommendedText: {
		paddingVertical: '1rem',
		paddingHorizontal: '5rem',
		fontSize: '9.5rem',
		backgroundColor: '#469BA2',
		fontWeight: 'bold',
		borderRadius: '6rem',
		color: 'white',
		marginHorizontal: '8rem',
	},
	radioItemView: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		width: '100%',
	},
});

// import React from 'react';
// import { Card, Divider, RadioButton } from 'react-native-paper';
// import { View, Text } from 'react-native';
// import { createTStyleSheet } from '../../src/utils/style';
// import { Models, PulverizationMethod, PulverizationMethods } from '../../models';
// import { FieldCard } from '../00-common/field-card';
// import { getLatestPrescriptionPulverizationMethod } from '../../src/utils';
// import { TouchableOpacity } from 'react-native-gesture-handler';

// type ChoosableFieldCardProps = {
// 	field: Models.field;
// 	isDiagnosisMode: boolean;
// 	chosenMethod: PulverizationMethod;
// 	onRadioButtonPress: (method: PulverizationMethod) => void;
// };

// export function ChoosableFieldCard(props: ChoosableFieldCardProps) {
// 	const recommendedMethodNumber = getLatestPrescriptionPulverizationMethod(props.field);
// 	const recommendedMethod = recommendedMethodNumber === 1 ? 'Drone' : recommendedMethodNumber === 2 ? 'Plane' : undefined;
// 	return (
// 		<View style={styles.mainView}>
// 			<Card style={styles.card}>
// 				<Divider />
// 				<View style={styles.fieldView}>
// 					<FieldCard isHideCircle isIndexNotAvailable={false} isDiagnosisMode={props.isDiagnosisMode} isElevated={false} field={props.field} />
// 				</View>
// 				<Divider style={styles.divider} />
// 				<View style={styles.choosableView}>
// 					<RadioButton.Group
// 						value={props.chosenMethod === PulverizationMethods.DRONE ? 'Drone' : props.chosenMethod === PulverizationMethods.PLANE ? 'Plane' : ''}
// 						onValueChange={() => console.log('')}
// 					>
// 						<TouchableOpacity style={styles.radioItemView} onPress={() => props.onRadioButtonPress(PulverizationMethods.DRONE)}>
// 							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
// 								<RadioButton color="#327387" value="Drone" />
// 								<Text style={styles.itemText}>Drone</Text>
// 								{recommendedMethod === 'Drone' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined}
// 							</View>
// 						</TouchableOpacity>
// 						<Divider style={styles.divider} />
// 						<TouchableOpacity style={styles.radioItemView} onPress={() => props.onRadioButtonPress(PulverizationMethods.PLANE)}>
// 							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
// 								<RadioButton color="#327387" value="Plane" />
// 								<Text style={styles.itemText}>Avião</Text>
// 								{recommendedMethod === 'Plane' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined}
// 							</View>
// 						</TouchableOpacity>
// 					</RadioButton.Group>
// 				</View>
// 			</Card>
// 		</View>
// 	);
// }

// const styles = createTStyleSheet({
// 	mainView: {
// 		flexBasis: '50%',
// 	},
// 	choosableView: {
// 		marginVertical: '8rem',
// 		paddingRight: '6rem',
// 		alignItems: 'flex-start',
// 		justifyContent: 'space-around',
// 	},
// 	methodText: {
// 		textAlign: 'center',
// 		fontSize: '12rem',
// 		color: '#78849E',
// 		paddingVertical: '8rem',
// 	},
// 	card: {
// 		elevation: '4rem',
// 		margin: '8rem',
// 		borderRadius: '10rem',
// 	},
// 	fieldView: {
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 	},
// 	divider: {
// 		width: '100%',
// 		height: '1rem',
// 		marginVertical: '4rem',
// 	},
// 	itemText: {
// 		paddingLeft: '2rem',
// 	},
// 	recommendedText: {
// 		paddingVertical: '1rem',
// 		paddingHorizontal: '5rem',
// 		fontSize: '9.5rem',
// 		backgroundColor: '#469BA2',
// 		fontWeight: 'bold',
// 		borderRadius: '6rem',
// 		color: 'white',
// 		marginHorizontal: '8rem',
// 	},
// 	radioItemView: {
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		justifyContent: 'space-between',
// 		width: '100%',
// 	},
// });
