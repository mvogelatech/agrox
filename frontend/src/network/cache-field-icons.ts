import { Models } from '../../models';
import { BACKEND_BASE_URL } from './ky';
import { cacheMany, getCached } from './helpers/cache-images';

// TODO if this file is ever used again, refactor to use the `./cache-images` helper from this same folder

function getFieldIconImageExternalUrl(field: Models.field): string | undefined {
	const uri = field.image_uri;
	if (uri) return `${BACKEND_BASE_URL}/${uri}`;
}

function getIconUrlsFromArea(area: Models.area): string[] {
	return area.field.map((field) => getFieldIconImageExternalUrl(field)).filter((x) => Boolean(x)) as string[];
}

function getIconUrlsFromAreas(areas: Models.area[]): string[] {
	return areas.flatMap((area) => getIconUrlsFromArea(area));
}

export function getCachedFieldIconUri(field: Models.field): string | undefined {
	const uri = getFieldIconImageExternalUrl(field);
	if (!uri) return;
	return getCached(uri);
}

export async function cacheFieldIconImagesForAreas(areas: Models.area[], concurrency: number): Promise<void> {
	if (areas.length === 0) return;
	const externalUrls = getIconUrlsFromAreas(areas);
	await cacheMany(externalUrls, concurrency);
}
