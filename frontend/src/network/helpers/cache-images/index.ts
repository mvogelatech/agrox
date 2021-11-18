import { AsyncStorage } from 'react-native';
import * as FileSystem from 'expo-file-system';
import pMap from 'p-map';
import { getRandomString } from './random-string';
import { extractExtname } from './extract-extname';
import { getAuthorizationHeader } from '../../ky';

const LOCAL_URI_ROOT = FileSystem.documentDirectory!;

let imageCache = new Map<string, string>(); // Maps external URLs into local URIs

async function cache(externalUrl: string): Promise<void> {
	const cacheTargetUri = LOCAL_URI_ROOT + getRandomString() + extractExtname(externalUrl);
	const authorizationHeader = await getAuthorizationHeader();
	const downloadOptions = authorizationHeader ? { headers: { Authorization: authorizationHeader } } : undefined;

	await FileSystem.downloadAsync(externalUrl, cacheTargetUri, downloadOptions); // This overwrites if exists

	if (imageCache.has(externalUrl)) {
		await FileSystem.deleteAsync(imageCache.get(externalUrl)!, { idempotent: true });
	}

	imageCache.set(externalUrl, cacheTargetUri);

	console.log(`Successfully cached "${externalUrl}"`);

	// return cacheTargetUri;
}

export async function cacheMany(externalUrls: string[], concurrency: number): Promise<void> {
	await loadFromAsyncStorageIfPresent();
	await pMap(externalUrls, async (url: string) => cache(url), { concurrency });
	await saveIntoAsyncStorage();
}

export function getCached(externalUrl: string): string | undefined {
	return imageCache.get(externalUrl);
}

const SERIALIZATION_PREFIX = '##CACHE_MAP_V1_SERIALIZATION_PREFIX##';

function serializeCacheMap(): string {
	return `${SERIALIZATION_PREFIX}${JSON.stringify([...imageCache.entries()])}`;
}

function deserializeCacheMap(serialized: string): Map<string, string> {
	if (!serialized.startsWith(SERIALIZATION_PREFIX)) {
		throw new Error(`Invalid serialized cache map: ${JSON.stringify(serialized)}`);
	}

	const payload = serialized.slice(SERIALIZATION_PREFIX.length);

	return new Map<string, string>(JSON.parse(payload));
}

const CACHE_KEY_FOR_ASYNC_STORAGE = '##CACHE_MAP_V1_KEY_FOR_ASYNC_STORAGE##';

export async function loadFromAsyncStorageIfPresent(): Promise<void> {
	const serialized = await AsyncStorage.getItem(CACHE_KEY_FOR_ASYNC_STORAGE);
	if (serialized) imageCache = deserializeCacheMap(serialized);
}

export async function saveIntoAsyncStorage(): Promise<void> {
	await AsyncStorage.setItem(CACHE_KEY_FOR_ASYNC_STORAGE, serializeCacheMap());
}
