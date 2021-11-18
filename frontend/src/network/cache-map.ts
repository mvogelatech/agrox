import { Models } from '../../models';
import * as MapUtils from '../../components/02-general/map/map-utils';
import * as FileSystem from 'expo-file-system';
import pMap from 'p-map';

// TODO if this file is ever used again, refactor to use the `./cache-images` helper from this same folder

export function predictTilesForArea(area: Models.area): MapUtils.TileCode[] {
	const fieldPins = area.field.map((field) => MapUtils.geoToWorldCoords({ latitude: field.lat, longitude: field.long }));
	return MapUtils.safelyPredictTilesForBoundingBox(MapUtils.getBoundingBox(fieldPins));
}

export async function cacheMapTilesForArea(area: Models.area, concurrency: number): Promise<void> {
	const tiles = predictTilesForArea(area);

	const areaLogString = area.name;
	console.log(`Will ensure cache for ${tiles.length} map tiles for area "${areaLogString}".`);
	const startTime = new Date().getTime();

	await pMap(
		tiles,
		async (tile: MapUtils.TileCode) => {
			const remoteUri = `https://mt.google.com/vt/lyrs=s&x=${tile.tileX}&y=${tile.tileY}&z=${tile.zoomLevel}`;
			const localName = `mapcache_${tile.tileX}_${tile.tileY}_${tile.zoomLevel}.jpg`;
			const localUri = `${FileSystem.documentDirectory!}${localName}`;

			const { exists } = await FileSystem.getInfoAsync(localUri);

			if (exists) {
				// console.log(`Already exists, skipping: ${localName}`);
			} else {
				await FileSystem.downloadAsync(remoteUri, localUri);
				// console.log(`Succesfully downloaded: ${localName}`);
			}
		},
		{ concurrency },
	);

	const elapsed = new Date().getTime() - startTime;
	console.log(`Finished ensuring offline map cache for area "${areaLogString}" after ${elapsed}ms.`);
}

export async function cacheMapTilesForAreas(areas: Models.area[], concurrency: number): Promise<void> {
	if (areas.length === 0) return;

	const concurrencyPerArea = Math.floor(concurrency / areas.length);

	await pMap(areas, async (area) => {
		await cacheMapTilesForArea(area, concurrencyPerArea);
	});
}
