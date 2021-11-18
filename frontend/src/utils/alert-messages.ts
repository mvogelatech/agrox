import { Alert } from 'react-native';
import { showSnackbar } from '../snackbars';

export const serviceNotAvailable = {
	title: 'Serviço indisponível',
	body: 'Este serviço ainda não está disponível.\nAguarde para mais novidades.',
	buttonText: 'OK, entendi!',
};

export const areaNotHired = {
	title: 'Diagnóstico Não Contratado',
	body: 'O serviço de diagnóstico ainda não foi contratado para este talhão.',
	buttonText: 'OK, entendi!',
};

export const areaHiredUnavailable = {
	title: 'Diagnóstico Indisponível',
	body: 'O diagnóstico ainda não está disponível para este talhão, por favor aguarde.',
	buttonText: 'OK, entendi!',
};

export const alertDatePrescription = {
	title: 'Diagnóstico Desatualizado',
	body: 'Este diagnóstico foi realizado a mais de um mês. \n \nDeseja continuar mesmo assim?',
	buttonText: 'OK, entendi!',
};

export const defaultNotImplemented = {
	title: 'Em Construção',
	body: 'Esta função ainda não está disponível em nosso aplicativo.\n\nAguarde para mais novidades.',
	buttonText: 'OK, entendi!',
};

export const quotationNotAvailable = {
	title: 'Orçamento ainda não disponível',
	body: 'O orçamento está sendo preparado e você será notificado quando ele estiver disponivel.',
	buttonText: 'OK, entendi!',
};

export const waitingForPrescription = {
	title: 'Aguardando Receituários',
	body: `O agrônomo está preparando os receituários.\n\nVocê será notificado quando eles estiverem disponíveis.`,
	buttonText: 'OK, entendi!',
};

export const dbHasNoCompanies = {
	title: 'Aguardando Empresas De Pulverização',
	body: `Estamos reunindo as melhores empresas para a prestação do serviço de pulverização.\n\nVocê será notificado quando elas estiverem disponíveis.`,
	buttonText: 'OK, entendi!',
};

export const needsToBeOnline = {
	title: 'Sem conexão',
	body: 'Esta ação requer conexão com a internet.\n\nTente novamente quando sua conexão for reestabelecida.',
	buttonText: 'OK, entendi!',
};

export const userHasChangedSuggestedMethod = {
	title: 'Atenção!',
	body:
		'Você alterou algum método de pulverização que sugerimos para os seus talhões. Não recomendamos que essa alteração seja feita, afim de garantir a qualidade e eficiência do serviço.\n\nEssa ação não poderá ser desfeita e caso continue, será de sua inteira responsabilidade.\n\nTem certeza que deseja continuar?',
	confirmButtonText: 'Sim, continuar',
	cancelButtonText: 'Cancelar',
};

export const userHasCancelledQuotation = {
	title: 'Deseja Realmente Sair?',
	body: 'Você ainda possui pendências no pedido de orçamento de pulverização.',
	confirmButtonText: 'Sair',
	cancelButtonText: 'Não Sair ',
};

export const userDidNotSelectPaymentMethod = {
	title: 'Atenção!',
	body:
		'Você não selecionou uma empresa para pulverização via Drone para algum dos talhões.\n\nTem certeza que deseja prosseguir?\n\nEssa ação não poderá ser desfeita.',
	confirmButtonText: 'Sim, avançar',
	cancelButtonText: 'Cancelar',
};

export const plantingReport = {
	title: 'Relatório de Plantio',
	body: 'Qual ação gostaria de tomar ?',
	confirmButtonText: 'Novo Relatório',
	cancelButtonText: 'Visualizar Relatório',
};

export const pulverizationNotInfested = {
	title: 'Fique tranquilo!',
	firstLine: 'Este talhão não está infestado.',
	secondLine: 'Este talhão não precisa de pulverização.',
};

export const pulverizationNotAvailable = {
	title: 'Fique tranquilo!',
	firstLine: 'O agrônomo está preparando o receituário deste talhão.',
	secondLine: 'Você será notificado quando ele estiver disponível.',
};

export const prescriptionNotInfested = {
	title: 'Fique tranquilo!',
	firstLine: 'Este talhão não está infestado.',
	secondLine: 'Este talhão não precisa de um receituário.',
};

export const prescriptionNotAvailable = {
	title: 'Fique tranquilo!',
	firstLine: 'O agrônomo está preparando o receituário deste talhão.',
	secondLine: 'Você será notificado quando ele estiver disponível.',
};

export const pulverizationQuoteNotAllowed = {
	title: 'Atenção!',
	body: 'Apenas o administrador da propriedade pode orçar uma pulverização.',
	buttonText: 'OK, entendi!',
};

export const termsAndConditions = {
	title: 'Termos e Condições de Uso',
	body:
		'Para utilizar o aplicativo AgroExplore é necessário que os Termos e Condições de Uso sejam aceitos.\n\nSeu código de acesso ficará ativo por dez dias a partir da data de instalação.\n\nApós este período o código será desativado.',
	buttonText: 'OK, entendi!',
};

export const privacyPolicy = {
	title: 'Termos de Política e Privacidade',
	body:
		'Para utilizar o aplicativo AgroExplore é necessário que os Termos de Política e privacidade sejam aceitos.\n\nSeu código de acesso ficará ativo por dez dias a partir da data de instalação.\n\nApós este período o código será desativado.',
	buttonText: 'OK, entendi!',
};

export const indexNotAvailable = {
	title: 'Indices ainda não disponíveis',
	body: 'Os indices para o campo selecionado ainda não foram processados ou não foi contratada esta funcionalidade.',
	buttonText: 'OK, entendi!',
};

export const needModal = {
	title: 'Atenção',
	body: 'Ainda não é possível contratar serviços para este modal.',
	buttonText: 'OK, entendi!',
};

export const fieldNotHired = areaNotHired;

export const fieldHiredUnavailable = areaHiredUnavailable;

export const fieldIndexNotAvailable = indexNotAvailable;

export function displayTimeoutErrorSnackbar(error: string, action: string) {
	showSnackbar({
		text: 'Ops! Um erro inesperado ocorreu.\nPor favor, verifique sua conexão\ncom a internet e tente novamente.',
		textColor: '#70171F',
		actionText: 'OK, ENTENDI!',
		actionTextColor: '#70171F',
		style: {
			backgroundColor: '#F6C0C5',
		},
	});
	console.log(action, error);
}

export type DialogType = {
	title: string;
	body: string;
	buttonText: string;
};

export type CancelableDialogType = {
	title: string;
	body: string;
	confirmButtonText: string;
	cancelButtonText: string;
};

export async function confirmQuotationLeave(navigation: any) {
	const response = await asyncCancelableAlert(userHasCancelledQuotation);
	if (response === 'CONFIRM')
		navigation.reset({
			index: 0,
			routes: [{ name: 'Areas' }],
		});
}

export async function confirmplantingReport(navigation: any) {
	console.log('ta aqui', navigation);

	const response = await asyncCancelableAlert(plantingReport);
	if (response === 'CONFIRM') {
		console.log('ta aqui');
		navigation.navigate('MethodSelection');
	}
	// navigation.navigate({
	// 	index: 0,
	// 	routes: [{ name: 'MethodSelection' }],
	// });
}

export function displayAlert(props: DialogType) {
	return Alert.alert(props.title, props.body, [{ text: props.buttonText }]);
}

export async function asyncCancelableAlert(props: CancelableDialogType) {
	return new Promise((resolve) => {
		Alert.alert(
			props.title,
			props.body,
			[
				{
					text: props.cancelButtonText,
					style: 'cancel',
					onPress: () => resolve('CANCEL'),
				},
				{ text: props.confirmButtonText, onPress: () => resolve('CONFIRM') },
			],
			{ cancelable: true },
		);
	});
}
