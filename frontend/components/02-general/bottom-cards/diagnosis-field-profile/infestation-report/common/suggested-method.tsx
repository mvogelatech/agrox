import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { createTStyleSheet } from '../../../../../../src/utils/style';

import { icons, colors } from '../../../../../../src/assets';

// 1 - Drone | 2 - Plane | 3 - Tractor
type MethodType = [];

type SuggestedMethodProps = {
	method: MethodType;
};
export function SuggestedMethod(props: SuggestedMethodProps) {
	return (
		<View style={styles.mainView}>
			<FlatList
				horizontal
				data={props.method}
				renderItem={({ item: element }) => (
					<Image style={styles.icon} source={element === 1 ? icons.drone : element === 2 ? icons.plane : element === 3 ? icons.manual : icons.tractor} />
				)}
				// keyExtractor={(item) => item.id.toString()}
			/>
			{/* {props.method === null ? undefined : <Image style={styles.icon} source={props.method === 'drone' ? icons.drone : icons.plane} />} */}

			{/* <Text style={styles.text}>{props.method === null ? '-----' : props.method === 'drone' ? 'DRONE' : 'AVIÃO'}</Text> */}
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		width: 'auto',
		height: 'auto',
	},
	text: {
		paddingLeft: '6rem',
		fontSize: '13rem',
	},
	$size: '15rem',
	icon: {
		width: '$size',
		height: '$size',
		marginLeft: '2rem',
		tintColor: colors.lightBlue,
	},
});
