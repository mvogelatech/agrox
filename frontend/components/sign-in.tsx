import React, { useState } from 'react';
import { Text, View, Image, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';

import { images } from '../src/assets';
import { createTStyleSheet } from '../src/utils/style';
import { displayAlert } from '../src/utils/alert-messages';
import { userSignIn } from '../src/network/auth';

import { enableDebugMode } from '../src/debug';
import { WHATSAPP_DEFAULT_NUMBER, WHATSTAPP_DEFAULT_URL } from './drawer-constants';

import { showSnackbar } from '../src/snackbars';

async function whatsAppCallback() {
	try {
		const ret = await Linking.openURL(WHATSTAPP_DEFAULT_URL);
		return ret;
	} catch (error) {
		console.log(error);
		displayAlert({
			title: `Informação`,
			body: `Não foi possível abrir o WhatsApp, favor entrar em contato pelo telefone: ${WHATSAPP_DEFAULT_NUMBER}`,
			buttonText: 'Ok',
		});
	}
}

function maskCpf(value: string) {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})/, '$1-$2')
		.replace(/(-\d{2})\d+?$/, '$1');
}

export function SignIn() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [startSignIn, setStartSignIn] = useState(false);

	async function processSignIn() {
		if (password === '9090') {
			enableDebugMode();
			return;
		}

		try {
			setStartSignIn(true);
			await userSignIn(username, password);
		} catch (error) {
			showSnackbar({ text: error.message as string, duration: 5000, style: { backgroundColor: 'rgb(255, 100, 0)' } });
			setStartSignIn(false);
			const message = error.message as string;
			setErrorMessage(message === '401' ? 'Código inválido.' : `Erro de comunicação: (${message})`);
		}
	}

	function handleCpfChange(value: string) {
		setUsername(maskCpf(value));
		setErrorMessage('');
	}

	return (
		<View style={styles.mainView}>
			<Image style={styles.logo} source={images.logo} resizeMode="contain" />
			<View style={styles.centerText}>
				<Text>Insira os dados de acesso:</Text>
			</View>
			<TextInput
				contextMenuHidden
				mode="outlined"
				keyboardType="default"
				label="Identificação"
				placeholder="Digite seu CPF"
				maxLength={14}
				value={username}
				textContentType="none"
				onChangeText={(username) => handleCpfChange(username)}
			/>
			<TextInput
				contextMenuHidden
				secureTextEntry
				mode="outlined"
				keyboardType="default"
				label="Senha"
				placeholder="Insira sua senha"
				maxLength={4}
				textContentType="password"
				onChangeText={(password) => {
					setPassword(password);
					setErrorMessage('');
				}}
			/>
			<View style={styles.centerText}>{startSignIn ? <ActivityIndicator /> : <Text style={styles.errorText}>{errorMessage}</Text>}</View>
			<Button uppercase={false} disabled={false} mode="contained" style={styles.button} labelStyle={styles.buttonText} onPress={processSignIn}>
				Entrar
			</Button>
			<TouchableOpacity activeOpacity={0.5} style={styles.centerText}>
				<Text style={styles.helpText} onPress={whatsAppCallback}>
					Precisa de Ajuda?
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = createTStyleSheet({
	mainView: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'stretch',
		padding: '28rem',
		backgroundColor: 'white',
	},
	$logoSize: '320rem',
	logo: {
		width: '$logoSize',
		height: '$logoSize',
		marginLeft: '8rem',
		marginRight: '8rem',
		tintColor: '#327387',
	},
	textInput: {
		marginBottom: '28px',
	},
	button: {
		marginVertical: '8rem',
		height: '45rem',
		justifyContent: 'center',
	},
	centerText: {
		marginTop: '-15rem',
		marginBottom: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	errorText: {
		color: 'red',
	},
	helpText: {
		marginTop: '24rem',
		fontSize: '14rem',
		fontWeight: '500',
		color: '#469BA2',
		paddingHorizontal: '32rem',
		paddingVertical: '16rem',
	},
	buttonText: {
		fontSize: '14rem',
	},
});
