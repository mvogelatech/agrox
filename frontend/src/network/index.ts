import { ky } from './ky';
import { getAuthenticatedUserId } from './auth';
import { Models } from '../../models';
import { dispatch } from '../../redux-things/utils';
// import { cacheFieldIconImagesForAreas } from './cache-field-icons';
import { enableShorterLogsForModel } from './helpers/shorter-logs-for-model';
import { showSnackbar } from '../snackbars';
import * as FileSystem from 'expo-file-system';
export { BACKEND_BASE_URL } from './ky';

let backendDataFetchOngoing = false;

export function getBackendDataFetchStatus() {
	return backendDataFetchOngoing;
}

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
const VISIONA_DEV_AUTH_TOKEN = 'YW50b25pby5mZXJuYW5kb0BlbWJyYWVyLmNvbS5icjpBZ3JvZXhwbG9yZTFA=';

async function fetchUser(): Promise<Models.user> {
	const id = (await getAuthenticatedUserId())!;
	const user = await ky.get(`userdata/${id}`).json<Models.user>();
	enableShorterLogsForModel(user, 'user');
	return user;
}

async function fetchCompanies(): Promise<Models.company[]> {
	const companies = await ky.get('company').json<Models.company[]>();
	for (const company of companies) enableShorterLogsForModel(company, 'company');
	return companies;
}

async function fetchQuotationPackages(): Promise<Models.quotation_package[]> {
	const packages = await ky.get('quotation').json<Models.quotation_package[]>();
	for (const quotation of packages) enableShorterLogsForModel(quotation, 'quotation_package');
	return packages;
}

async function fetchQuotationCheckouts(): Promise<Models.quotation_checkout_group[]> {
	const checkoutGroups = await ky.get('checkout').json<Models.quotation_checkout_group[]>();
	for (const group of checkoutGroups) {
		for (const checkout of group) enableShorterLogsForModel(checkout, 'quotation_checkout');
	}

	return checkoutGroups;
}

async function fetchTermsAndConditions(): Promise<Models.terms_and_conditions[]> {
	const termsAndConditions = await ky.get('terms-and-conditions').json<Models.terms_and_conditions[]>();
	for (const term of termsAndConditions) enableShorterLogsForModel(term, 'terms-and-conditions');
	return termsAndConditions;
}

async function fetchPrivacyPolicy(): Promise<Models.privacy_policy[]> {
	const privacyPolicy = await ky.get('privacy-policy').json<Models.privacy_policy[]>();
	for (const term of privacyPolicy) enableShorterLogsForModel(term, 'privacy-policy');
	return privacyPolicy;
}

async function fetchPlagues(): Promise<Models.plague[]> {
	const plagues = await ky.get('plague').json<Models.plague[]>();
	for (const plague of plagues) enableShorterLogsForModel(plague, 'plague');
	return plagues;
}

export async function fetchBackendData(): Promise<void> {
	if (backendDataFetchOngoing) {
		// throw new Error(`Fetch already in progress. Refusing to make a duplicate request.`);
		return;
	}

	try {
		backendDataFetchOngoing = true;

		const [user, companies, packages, groups, terms, privacyPolicy, plagues] = await Promise.all([
			fetchUser(),
			fetchCompanies(),
			fetchQuotationPackages(),
			fetchQuotationCheckouts(),
			fetchTermsAndConditions(),
			fetchPrivacyPolicy(),
			fetchPlagues(),
		]);

		// fetch index data from backend and visiona api service
		await fetchIndices(user.many_user_has_many_farm.flatMap((x) => x.farm.area));

		// void cacheFieldIconImagesForAreas(
		// 	user.many_user_has_many_farm.flatMap((x) => x.farm.area),
		// 	30,
		// );

		// TODO decide what to do about map tiles
		// TODO decide what to do about map tiles (offline mode)
		// void cacheMapTilesForAreas(user.producer.farm.area, 20);

		dispatch({ type: 'BACKEND_DATA_RECEIVED__USER', user });
		dispatch({ type: 'BACKEND_DATA_RECEIVED__COMPANIES', companies });
		dispatch({ type: 'BACKEND_DATA_RECEIVED__QUOTATION_PACKAGES', packages });
		dispatch({ type: 'BACKEND_DATA_RECEIVED__CHECKOUT_GROUPS', groups });
		dispatch({ type: 'BACKEND_DATA_RECEIVED__TERMS_AND_CONDITIONS', terms });
		dispatch({ type: 'BACKEND_DATA_RECEIVED__PRIVACY_POLICY', privacyPolicy });
		dispatch({ type: 'BACKEND_DATA_RECEIVED__PLAGUES', plagues });
	} catch (error) {
		showSnackbar({
			text: 'Ops! Um erro inesperado ocorreu.\nPor favor, verifique sua conexão\ncom a internet e reinicie o aplicativo.',
			textColor: '#70171F',
			actionText: 'OK, ENTENDI',
			actionTextColor: '#70171F',
			style: {
				backgroundColor: '#F6C0C5',
			},
		});
		console.log('APP_FIRST_FETCH_ERROR', error);
	} finally {
		backendDataFetchOngoing = false;
	}
}

export async function fetchUserUnreadNotificationCount(): Promise<number> {
	const id = (await getAuthenticatedUserId())!;
	const count = await ky.get(`userdata/${id}/unread-notification-count`).json<number>();
	return count;
}

async function fetchIndices(areas: Models.area[]) {
	for (const area of areas) {
		for (const field of area.field) {
			field.visiona = await fetchIndicesForField(field.id);
			console.log('o que eu quero agora', field.visiona);
		}
	}
}

async function fetchIndicesForField(fieldId: number) {
	const response = await ky
		.post(`visiona/list-area`, {
			json: {
				accessToken: ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS,
				id: fieldId,
			},
		})
		.json<Models.VisionaObservation[]>();
	return response;
}

export async function downloadIndexImage(remoteUri: string, localUri: string) {
	const VISIONA_API_AUTH_TOKEN_TEXT = VISIONA_DEV_AUTH_TOKEN;
	const options: FileSystem.DownloadOptions = { headers: { Authorization: `Basic ${VISIONA_API_AUTH_TOKEN_TEXT}` } };
	return FileSystem.downloadAsync(remoteUri, localUri, options);
}

export async function fetchDiagnosisImage(fieldId: number) {
	const image = await ky.get(`diag/${fieldId}`);
	return image.body;
}
