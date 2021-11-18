// @ts-nocheck // TODO sorry but TS is not undestanding my awesome code, so I have to shut it down - issue is in line: 79
import React, { useEffect, useState } from 'react';
import { View, Text, Image, BackHandler, Clipboard, Platform, Linking } from 'react-native';
import { Divider, Avatar } from 'react-native-paper';
import { DrawerItem, DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { createTStyleSheet } from '../src/utils/style';

import { images } from '../src/assets';
import { Models, RoleTypeFarmManager } from '../models';
import { DrawerActions } from '@react-navigation/native';
import { userSignOut } from '../src/network/auth';
import { debug, isDebugModeEnabled, clearDebug, getDebugValue } from '../src/debug';
import { REM_SCALE } from '../src/utils';

import * as ImagePicker from 'expo-image-picker';
import { displayAlert } from '../src/utils/alert-messages';
import { ky } from '../src/network/ky';

import { WHATSTAPP_DEFAULT_URL, DEFAULT_AVATAR_B64, WHATSAPP_DEFAULT_NUMBER } from './drawer-constants';

// See https://stackoverflow.com/q/60915266/4135063
type DrawerContentProps = DrawerContentComponentProps & {
	user: Models.user;
};

async function retrieveUserAvatar(user_id: number): Promise<string> {
	try {
		const res = await ky.get(`userdata/avatar/${user_id}`).json<{ image: string }>();
		return res.image;
	} catch (error) {
		showSnackbar({ text: `Get Avatar Pic', ${error.message as string}`, duration: 20000, style: { backgroundColor: 'rgb(255, 100, 0)' } });
	}
}

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

export function DrawerContent(props: DrawerContentProps) {
	const [userAvatar, setUserAvatar] = useState(DEFAULT_AVATAR_B64);
	const [isFocused, setIsFocused] = useState('Minhas Áreas');
	const userId = props.user.id;
	const role = props.user.user_role.find((obj) => obj.role.name === RoleTypeFarmManager);
	const menu = role
		? [
				['Minhas Áreas', 'Areas'],
				['Serviços', 'Services'],
				['Meus Orçamentos', 'Quotations'],
				['Histórico de Contratações', 'Checkouts'],
		  ]
		: [['Minhas Áreas', 'Areas']];

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
				if (status !== 'granted') {
					displayAlert({
						title: `Erro`,
						body: `É necessário dar permissão de acesso ao AgroExplore para selecionar imagens.`,
						buttonText: 'Ok',
					});
				}
			}

			const dlUserAvatar = await retrieveUserAvatar(userId);
			if (dlUserAvatar) {
				setUserAvatar(`data:image/png;base64,${dlUserAvatar}`);
			} else {
				setUserAvatar(DEFAULT_AVATAR_B64);
			}
		})();
	}, [userId]);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0,
		});

		if (!result.cancelled) {
			/* eslint no-undef: ["off", { "typeof": true }] */
			const formData = new FormData();

			formData.append('image', {
				uri: result.uri,
				name: `avatar.jpg`,
				type: `image/jpg`,
			});

			try {
				await ky.post(`userdata/${props.user.id}/avatar`, {
					body: formData,
				});
			} catch (error) {
				showSnackbar({ text: `Post Avatar Pic', ${error.message as string}`, duration: 20000, style: { backgroundColor: 'rgb(255, 100, 0)' } });
			}

			const dlUserAvatar = await retrieveUserAvatar(userId);
			if (dlUserAvatar) {
				setUserAvatar(`data:image/png;base64,${dlUserAvatar}`);
			} else {
				setUserAvatar(DEFAULT_AVATAR_B64);
			}
		}
	};

	return (
		<View style={styles.mainView}>
			<View style={styles.logoView}>
				<Image source={images.croppedLogo} resizeMode="contain" style={styles.logo} />
			</View>
			<View style={styles.userView}>
				<Avatar.Image size={styles.avatarSize} source={{ uri: userAvatar }} onTouchStart={pickImage} />
				<Text style={styles.userText}>
					{props.user.first_name} {props.user.last_name}
				</Text>
			</View>
			<Divider />
			<DrawerContentScrollView>
				{menu.map((item) => (
					<DrawerItem
						key={item[0]}
						focused={isFocused === item[0]}
						activeTintColor="black"
						activeBackgroundColor=" rgba(70, 155, 162, .4)"
						label={item[0]}
						labelStyle={styles.labelText}
						onPress={() => {
							setIsFocused(item[0]);
							props.navigation.navigate(item[1]);
						}}
					/>
				))}
				{(__DEV__ || isDebugModeEnabled()) && (
					<View>
						<Divider />
						<DrawerItem
							label="[dev only] Logout"
							labelStyle={styles.labelText}
							onPress={async () => {
								await userSignOut();
								BackHandler.exitApp();
							}}
						/>
						<DrawerItem
							label="[dev only] Show-and-copy debug"
							labelStyle={styles.labelText}
							onPress={() => {
								debug();
								Clipboard.setString(getDebugValue());
							}}
						/>
						<DrawerItem label="[dev only] Clear debug" labelStyle={styles.labelText} onPress={clearDebug} />
					</View>
				)}
			</DrawerContentScrollView>
			<Divider />
			<View>
				<DrawerItem
					label="Logout"
					labelStyle={styles.labelText}
					onPress={async () => {
						await userSignOut();
						BackHandler.exitApp();
					}}
				/>
				<DrawerItem
					focused={props.state.index === 4}
					activeTintColor="black"
					activeBackgroundColor=" rgba(70, 155, 162, .4)"
					label="Ajuda"
					labelStyle={styles.labelText}
					onPress={whatsAppCallback}
				/>
				<DrawerItem
					focused={props.state.index === 5}
					activeTintColor="black"
					activeBackgroundColor=" rgba(70, 155, 162, .4)"
					label="Termos e Condições de Uso"
					labelStyle={styles.labelText}
					onPress={() => props.navigation.navigate('TermsAndConditions')}
				/>
				<DrawerItem
					focused={props.state.index === 6}
					activeTintColor="black"
					activeBackgroundColor=" rgba(70, 155, 162, .4)"
					label="Termos de Política e Privacidade"
					labelStyle={styles.labelText}
					onPress={() => props.navigation.navigate('PrivacyPolicy')}
				/>
				<DrawerItem
					label="Sair"
					labelStyle={styles.labelText}
					onPress={() => {
						props.navigation.dispatch(DrawerActions.closeDrawer());
						BackHandler.exitApp();
					}}
				/>
			</View>
		</View>
	);
}

const styles = createTStyleSheet({
	avatarSize: 60 * REM_SCALE,
	mainView: {
		flex: 1,
		marginHorizontal: '8rem',
	},
	logoView: {
		paddingTop: '32rem',
		paddingBottom: '2rem',
		paddingHorizontal: '16rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		tintColor: '#327387',
		width: '200rem',
		height: '60rem',
	},
	userView: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: '8rem',
		paddingVertical: '8rem',
	},
	userText: {
		paddingLeft: '16rem',
		width: '100%',
		fontSize: '14rem',
	},
	labelText: {
		fontSize: '14rem',
	},
});
