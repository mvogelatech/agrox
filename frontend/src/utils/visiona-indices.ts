import dayjs from 'dayjs';
import { Models, VegetationIndex, VegetationIndexName } from '../../models';
import * as FileSystem from 'expo-file-system';
import { downloadIndexImage } from '../network';

export function isAnyIndexAvailableForArea(area: Models.area) {
	let isAny = false;
	for (const field of area.field) {
		isAny = isIndexAvailable(field) || isAny;
	}

	return isAny;
}

export function isIndexAvailable(field: Models.field) {
	if (field.visiona) return field.visiona.length > 0;
	return false;
}

export function getIndexImageLocalUri(field: Models.field, idxName: VegetationIndexName, date: string) {
	if (field?.visiona && field?.visiona.length > 0) {
		const obs = field.visiona.find((observation) => dayjs(observation.date).format('YYYY-MM-DD') === date);
		if (obs) {
			const idx = getProperty(obs.stats.indice, idxName);
			if (idx) {
				console.log(idx.browseUrl);
				return translateToLocalUri(idx.browseUrl);
			}
		}
	}

	return undefined;
}

export async function cacheAreaIndexImages(area: Models.area, index: VegetationIndex) {
	const proms = [];
	for (const field of area.field) {
		proms.push(cacheFieldIndexImages(field, index));
	}

	await Promise.all(proms);
}

export async function cacheFieldIndexImages(field: Models.field, index: VegetationIndex) {
	const proms = [];
	if (field.visiona) {
		for (let a = 0, l = field.visiona.length; a < l; a++) {
			const observation = field.visiona[a];
			const idx = getProperty(observation.stats.indice, index.name);
			if (idx?.browseUrl) {
				proms.push(checkAndDownloadIndexImage(idx.browseUrl));
			}
		}
	}

	await Promise.all(proms);
}

async function checkAndDownloadIndexImage(remoteUri: string) {
	const localUri = translateToLocalUri(remoteUri);
	if (localUri) {
		const { exists } = await FileSystem.getInfoAsync(localUri);
		console.log('topzera', localUri);

		if (!exists) {
			const data = await downloadIndexImage(remoteUri, localUri);
			console.log('topzera2', data);

			if (data.status === 200) {
				const size = Number.parseInt(data.headers['Content-Length'], 10);
				if (size === 0) await FileSystem.deleteAsync(localUri);
			}
		}
	}
}

export function getDatesForIndexDataFromArea(area: Models.area, filterDate?: string): string[] {
	const dates: string[] = [];
	// add all dates into single array
	for (const field of area.field) {
		const indicesDates = getDatesForIndexDataFromField(field, filterDate);
		for (const date of indicesDates) {
			if (!dates.includes(date)) {
				dates.push(date);
			}
		}
	}

	return dates;
}

export function getDatesForIndexDataFromField(field: Models.field, filterDate?: string): string[] {
	const dateArr: string[] = [];
	if (field.visiona) {
		for (let a = 0, l = field.visiona.length; a < l; a++) {
			const observation = field.visiona[a];
			if (filterDate) {
				if (dayjs(observation.date).isAfter(dayjs(filterDate))) dateArr.push(observation.date);
			} else {
				dateArr.push(observation.date);
			}
		}
	}

	return dateArr;
}

function translateToLocalUri(remoteUri: string): string | undefined {
	let localUri;
	if (remoteUri?.includes('/img/')) {
		const r = remoteUri.split('/img/')[1];
		const localName = r.replace(/\//g, '_');
		localUri = `${FileSystem.documentDirectory!}${localName}.png`;
	}

	return localUri;
}

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
	return o[propertyName]; // o[propertyName] is of type T[K]
}
