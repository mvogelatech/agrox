// import * as React from 'react';
import React from 'react';

// import { Card, Divider, RadioButton, Checkbox } from 'react-native-paper';
import { Card, Divider, Checkbox } from 'react-native-paper';
import { View, Text, AsyncStorage } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';

export function ChoosableFieldCard() {
	const [checked, setChecked] = React.useState(false);
	const [checked2, setChecked2] = React.useState(false);
	const [checked3, setChecked3] = React.useState(false);
	const [checked4, setChecked4] = React.useState(false);
	const [checked5, setChecked5] = React.useState(false);
	const [checked6, setChecked6] = React.useState(false);

	return (
		<View style={styles.mainView}>
			<Card style={styles.card}>
				{/* <TouchableOpacity activeOpacity={0.5} style={styles.touchable}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
						<View>
							<Text numberOfLines={1} style={styles.title}>
								Tratamento:
							</Text>
							<Text numberOfLines={1} style={styles.subtitle}>
								ERVAS DANINHAS
							</Text>
						</View>
					</View>
				</TouchableOpacity> */}
				<View style={styles.childrenView}>
					<View style={styles.choosableView}>
						<Divider style={styles.divider} />
						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="Herbicidas"
								checked={checked}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked) {
										(async () => {
											await AsyncStorage.setItem('Herbicidas', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('Herbicidas', 'herbicidas');
										})();
									}

									setChecked(!checked);
								}}
							/>
							{/* <Checkbox
									status={checked ? 'checked' : 'unchecked'}
									onPress={async () => {
										if (checked) {
											await AsyncStorage.setItem('Herbicidas', '');
										} else {
											await AsyncStorage.setItem('Herbicidas', 'herbicidas');
										}

										setChecked(!checked);
									}}
								/> */}
							{/* <Text style={styles.itemText}>Herbicidas</Text> */}
						</View>
						{/* </TouchableOpacity> */}
						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="Fungicidas"
								checked={checked2}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked2) {
										(async () => {
											await AsyncStorage.setItem('Fungicidas', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('Fungicidas', 'Fungicidas');
										})();
									}

									setChecked2(!checked2);
								}}
							/>
							{/* <Checkbox
									status={checked2 ? 'checked' : 'unchecked'}
									onPress={async () => {
										if (checked2) {
											await AsyncStorage.setItem('Fungicidas', '');
										} else {
											await AsyncStorage.setItem('Fungicidas', 'Fungicidas');
										}

										setChecked2(!checked2);
									}}
								/> */}
							{/* <Text style={styles.itemText}>Fungicidas</Text> */}
						</View>
						{/* </TouchableOpacity> */}
						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="Inseticidas"
								checked={checked3}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked3) {
										(async () => {
											await AsyncStorage.setItem('Inseticidas', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('Inseticidas', 'Inseticidas');
										})();
									}

									setChecked3(!checked3);
								}}
							/>
							{/* <Checkbox
									status={checked3 ? 'checked' : 'unchecked'}
									onPress={async () => {
										if (checked3) {
											await AsyncStorage.setItem('Inseticidas', '');
										} else {
											await AsyncStorage.setItem('Inseticidas', 'Inseticidas');
										}

										setChecked3(!checked3);
									}}
								/> */}
							{/* <Text style={styles.itemText}>Inseticidas</Text> */}
						</View>
						{/* </TouchableOpacity> */}
						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="Maturador"
								checked={checked4}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked4) {
										(async () => {
											await AsyncStorage.setItem('Maturador', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('Maturador', 'Maturador');
										})();
									}

									setChecked4(!checked4);
								}}
							/>
							{/* <Checkbox
									status={checked4 ? 'checked' : 'unchecked'}
									onPress={async () => {
										if (checked4) {
											await AsyncStorage.setItem('Maturador', '');
										} else {
											await AsyncStorage.setItem('Maturador', 'Maturador');
										}

										setChecked4(!checked4);
									}}
								/> */}
							{/* <Text style={styles.itemText}>Maturador</Text> */}
						</View>
						{/* </TouchableOpacity> */}
						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="Fertilizantes"
								checked={checked5}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked5) {
										(async () => {
											await AsyncStorage.setItem('Fertilizantes', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('Fertilizantes', 'Fertilizantes');
										})();
									}

									setChecked5(!checked5);
								}}
							/>
							{/* <Checkbox
									status={checked5 ? 'checked' : 'unchecked'}
									onPress={async () => {
										if (checked5) {
											await AsyncStorage.setItem('Fertilizantes', '');
										} else {
											await AsyncStorage.setItem('Fertilizantes', 'Fertilizantes');
										}

										setChecked5(!checked5);
									}}
								/> */}
							{/* <Text style={styles.itemText}>Fertilizantes</Text> */}
						</View>
						{/* </TouchableOpacity> */}
						{/* <TouchableOpacity style={styles.radioItemView}> */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<CheckBox
								title="Outros"
								checked={checked6}
								checkedColor="#469BA2"
								containerStyle={styles.checkbox}
								onPress={() => {
									if (checked6) {
										(async () => {
											await AsyncStorage.setItem('Outros', '');
										})();
									} else {
										(async () => {
											await AsyncStorage.setItem('Outros', 'Outros');
										})();
									}

									setChecked6(!checked6);
								}}
							/>
							{/* <Checkbox
									status={checked6 ? 'checked' : 'unchecked'}
									onPress={async () => {
										if (checked6) {
											await AsyncStorage.setItem('Outros', '');
										} else {
											await AsyncStorage.setItem('Outros', 'Outros');
										}

										setChecked6(!checked6);
									}}
								/>
								<Text style={styles.itemText}>Outros</Text> */}
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
