import * as React from 'react';
// import { Card, Divider, RadioButton, Checkbox } from 'react-native-paper';
import { Card, Divider, Checkbox } from 'react-native-paper';
import { View, Text, AsyncStorage } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
// import { Models, PulverizationMethod, PulverizationMethods } from '../../models';
// import { FieldCard } from '../00-common/field-card';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';

// type ChoosableFieldCardProps = {
// 	field: Models.field;
// 	isDiagnosisMode: boolean;
// 	chosenMethod: PulverizationMethod;
// 	onRadioButtonPress: (method: PulverizationMethod) => void;
// };

export function ChoosableFieldCard() {
	// const recommendedMethodNumber = getLatestPrescriptionPulverizationMethod(props.field);
	// const recommendedMethod = recommendedMethodNumber === 1 ? 'Drone' : recommendedMethodNumber === 2 ? 'Plane' : undefined;
	// const [checked, setChecked] = React.useState(false);
	const [checked2, setChecked2] = React.useState(false);
	const [checked3, setChecked3] = React.useState(false);
	const [checked4, setChecked4] = React.useState(false);
	return (
		<View style={styles.mainView}>
			<Card style={styles.card}>
				{/* <TouchableOpacity activeOpacity={0.5} style={styles.touchable}> */}
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
					{/* <MaterialIcons name={props.isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color="#6C6464" style={styles.icon} /> */}
					<View>
						<Text numberOfLines={1} style={styles.title}>
							{/* Tratamento: */}
						</Text>
						{/* {props.subtitle ? ( */}
						<Text numberOfLines={1} style={styles.subtitle}>
							RELATÓRIOS DISPONÍVEIS
						</Text>
						{/* ) : undefined} */}
					</View>
				</View>
				{/* {props.titleRight} */}
				{/* </TouchableOpacity> */}
				{/* {props.isExpanded ? ( */}
				<View style={styles.childrenView}>
					{/* {props.divider} */}
					<View style={styles.choosableView}>
						{/* <RadioButton.Group */}
						{/* value={props.chosenMethod === PulverizationMethods.DRONE ? 'Drone' : props.chosenMethod === PulverizationMethods.PLANE ? 'Plane' : ''}
							onValueChange={() => console.log('')} */}
						{/* > */}
						{/* <TouchableOpacity style={styles.radioItemView} onPress={() => props.onRadioButtonPress(PulverizationMethods.DRONE)}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<RadioButton color="#327387" value="Drone" />
									<Text style={styles.itemText}>Drone</Text>
									{recommendedMethod === 'Drone' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined}
								</View>
							</TouchableOpacity>
							<Divider style={styles.divider} /> */}
						<Divider style={styles.divider} />

						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="Potencial de Pisoteio"
								checked={checked2}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked2) {
										(async () => {
											await AsyncStorage.setItem('PP', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('PP', 'Potencial de Pisoteio');
										})();
									}

									setChecked2(!checked2);
								}}
							/>
							{/* <Checkbox
								status={checked2 ? 'checked' : 'unchecked'}
								onPress={async () => {
									if (checked2) {
										await AsyncStorage.setItem('PP', '');
									} else {
										await AsyncStorage.setItem('PP', 'Potencial de Pisoteio');
									}
									setChecked2(!checked2);
								}}
							/> */}
							{/* <RadioButton color="#327387" value="Drone" /> */}
							{/* <Text style={styles.itemText}>Potencial de Pisoteio</Text> */}
							{/* {recommendedMethod === 'Drone' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined} */}
						</View>
						{/* </TouchableOpacity> */}
						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="Linhas de Plantio"
								checked={checked3}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked3) {
										(async () => {
											await AsyncStorage.setItem('LP', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('LP', 'Linhas de Plantio');
										})();
									}

									setChecked3(!checked3);
								}}
							/>
							{/* <Checkbox
								status={checked3 ? 'checked' : 'unchecked'}
								onPress={async () => {
									if (checked3) {
										await AsyncStorage.setItem('LP', '');
									} else {
										await AsyncStorage.setItem('LP', 'Linhas de Plantio');
									}
									setChecked3(!checked3);
								}}
							/> */}
							{/* <RadioButton color="#327387" value="Drone" /> */}
							{/* <Text style={styles.itemText}>Linhas de Plantio</Text> */}
							{/* {recommendedMethod === 'Drone' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined} */}
						</View>
						{/* </TouchableOpacity> */}
						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="NDVI Drones"
								checked={checked4}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked4) {
										(async () => {
											await AsyncStorage.setItem('NDVI', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('NDVI', 'NDVI Drones');
										})();
									}

									setChecked4(!checked4);
								}}
							/>
							{/* <Checkbox
								status={checked4 ? 'checked' : 'unchecked'}
								onPress={async () => {
									if (checked4) {
										await AsyncStorage.setItem('NDVI', '');
									} else {
										await AsyncStorage.setItem('NDVI', 'NDVI Drones');
									}
									setChecked4(!checked4);
								}}
							/> */}
							{/* <RadioButton color="#327387" value="Drone" /> */}
							{/* <Text style={styles.itemText}>NDVI Drones</Text> */}
							{/* {recommendedMethod === 'Drone' ? <Text style={styles.recommendedText}>Recomendado</Text> : undefined} */}
						</View>
						{/* </TouchableOpacity> */}
					</View>
				</View>
			</Card>
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
