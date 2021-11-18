import React, { useState } from 'react';
import { View, Text, Linking } from 'react-native';
import { createTStyleSheet } from '../../src/utils/style';

import { ClosableHeader } from '../00-common';
import { AgroXScreenProps } from '../navigation-types';

import { Models } from '../../models';
import { useIsOffline } from '../../redux-things';
// import { ky } from '../../src/network/ky';
import { Button } from 'react-native-paper';
import { displayAlert, needsToBeOnline, confirmQuotationLeave, displayTimeoutErrorSnackbar } from '../../src/utils/alert-messages';
import { asAliveOnlyScreenComponent } from '../../src/utils/smart-lifecycle-components';
import { WaitOverlay } from '../00-common/wait-overlay';
import { WHATSAPP_DEFAULT_NUMBER } from '../drawer-constants';

type ScreenProps = AgroXScreenProps<'HiringReview'>;

async function requestDiagnostic(newRequest: Models.field[]) {
	// const createdQuotation = await ky
	// 	.post('diagnostic', {
	// 		json: {
	// 			fields: newRequest,
	// 		},
	// 	})
	// 	.json<Models.field>();
	const area = [...new Set(newRequest.flatMap((field: any) => field.area_id))].slice().sort(undefined).join(', ');
	const talhao = [...new Set(newRequest.flatMap((field: any) => field.name.split(' ')[1]))].slice().sort(undefined).join(', ');
	const msg = `"Time Agroexplore, Favor atender as seguintes demandas de contratação de diagnósticos." \n\n Área(s): ${area} \n Talhões: ${talhao}`;
	try {
		const ret = await Linking.openURL(`whatsapp://send?text=${msg}&phone=${WHATSAPP_DEFAULT_NUMBER}`);
		return ret;
	} catch (error) {
		console.log(error);
		displayAlert({
			title: `Informação`,
			body: `Não foi possível abrir o WhatsApp, favor entrar em contato pelo telefone: ${WHATSAPP_DEFAULT_NUMBER}`,
			buttonText: 'Ok',
		});
	}
	// dispatch({ type: 'BACKEND_DATA__POSTED_NEW_QUOTATION_PACKAGE', package: createdQuotation });
}

export const HiringReview = asAliveOnlyScreenComponent(({ navigation, route }: ScreenProps) => {
	const isOnline = !useIsOffline();

	const [showIndicator, setShowIndicator] = useState(false);

	return (
		<View style={{ flex: 1 }}>
			{showIndicator ? <WaitOverlay text="Aguarde" /> : undefined}
			<ClosableHeader
				onBackPress={() => {
					navigation.goBack();
				}}
				onClose={() => {
					void confirmQuotationLeave(navigation);
				}}
			/>

			<View style={styles.mainView}>
				<View style={styles.contentView}>
					<Text style={styles.titleText}>Confira os talhões selecionados para serem diagnosticados</Text>
					<View style={styles.gridView}>
						{route.params.selectedFields.map((field) => (
							<Text key={field.id.toString()}>{field.name}</Text>
						))}
					</View>
				</View>

				<Button
					uppercase={false}
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonText}
					onPress={async () => {
						if (isOnline) {
							setShowIndicator(true);
							try {
								// console.log('teste do rele', route.params.selectedFields);
								await requestDiagnostic(route.params.selectedFields);
								navigation.navigate('FeedbackDiagnostic');
							} catch (error) {
								setShowIndicator(false);
								displayTimeoutErrorSnackbar(error, 'Post Quotation');
							}
						} else {
							displayAlert(needsToBeOnline);
						}
					}}
				>
					Contratar
				</Button>
			</View>
		</View>
	);
});

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		backgroundColor: 'white',
		paddingHorizontal: '16rem',
		justifyContent: 'space-between',
	},
	titleText: {
		paddingLeft: '8rem',
		paddingVertical: '8rem',
		fontSize: '23rem',
	},
	contentView: {},
	button: {
		marginVertical: '24rem',
		height: '45rem',
		justifyContent: 'center',
		width: '100%',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
