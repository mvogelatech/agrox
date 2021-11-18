import { ky, kyWithoutAuth } from './ky';
import { getAuthDataWithoutStateUpdate, dispatch } from '../../redux-things/utils';

export type UserProfile = {
	username: string;
	userId: number;
};

export type LoginResponse = {
	access_token: string;
};

export async function getAuthenticatedUserId(): Promise<number | null> {
	return getAuthDataWithoutStateUpdate().userId;
}

export async function getAuthenticatedUserToken(): Promise<string | null> {
	return getAuthDataWithoutStateUpdate().userToken;
}

export async function userSignOut() {
	dispatch({ type: 'GLOBAL_RESET' });
}

export async function userSignIn(username: string, password: string): Promise<boolean> {
	console.log('user', username);
	console.log('pass', password);
	const { access_token } = await kyWithoutAuth.post('login', { json: { username, password } }).json<LoginResponse>();
	console.log('entrou login2', access_token);
	dispatch({ type: 'SET_AUTH_DATA_USER_TOKEN', userToken: access_token });
	const profile = await ky.get('profile').json<UserProfile>();

	// get user profile and store on device
	if (profile) {
		dispatch({ type: 'SET_AUTH_DATA_USER_ID', userId: profile.userId });
	}

	return profile !== null;
}

export async function userSignInFromCode(code: string): Promise<boolean> {
	return userSignIn("''", code);
}
