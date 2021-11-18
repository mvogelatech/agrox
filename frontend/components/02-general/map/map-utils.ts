import { Dimensions } from 'react-native';
import { REM_SCALE } from '../../../src/utils';

const WINDOW_WIDTH_PX = Dimensions.get('window').width;
const WINDOW_HEIGHT_PX = Dimensions.get('window').height;

export type LatLng = {
	latitude: number;
	longitude: number;
};

export type WorldCoordinate = {
	x: number; // 0 to 256
	y: number; // 0 to 256
};

export type BoundingBox = [WorldCoordinate, WorldCoordinate];

export type TilePixelCoordinate = {
	tileX: number;
	tileY: number;
	pixelX: number;
	pixelY: number;
};

export type TileCode = {
	zoomLevel: number;
	tileX: number;
	tileY: number;
};

export type Region = {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
};

export type MapViewDimensions = {
	widthPx: number;
	heightPx: number;
};

export type SimpleCamera = { center: LatLng; zoom: number };

export type DetailedPaddingRem = {
	top: number;
	left: number;
	bottom: number;
	right: number;
};

export type PaddingRem = number | DetailedPaddingRem;

type PaddingPx = {
	topPx: number;
	leftPx: number;
	bottomPx: number;
	rightPx: number;
};

function toPaddingPx(padding: PaddingRem): PaddingPx {
	if (typeof padding === 'number') {
		return { topPx: REM_SCALE * padding, leftPx: REM_SCALE * padding, bottomPx: REM_SCALE * padding, rightPx: REM_SCALE * padding };
	}

	return { topPx: REM_SCALE * padding.top, leftPx: REM_SCALE * padding.left, bottomPx: REM_SCALE * padding.bottom, rightPx: REM_SCALE * padding.right };
}

const TILE_SIZE = 256;

export function zoomLevelToScale(zoomLevel: number): number {
	return 1 << zoomLevel; // Fast way to compute 2 ** Math.floor(zoom)
}

export function geoToWorldCoords(geo: LatLng): WorldCoordinate {
	// https://developers.google.com/maps/documentation/javascript/examples/map-coordinates?csw=1
	let siny = Math.sin((geo.latitude * Math.PI) / 180);

	// Truncating to 0.9999 effectively limits latitude to 89.189. This is
	// about a third of a tile past the edge of the world tile.
	siny = Math.min(Math.max(siny, -0.9999), 0.9999);

	return {
		x: TILE_SIZE * (0.5 + geo.longitude / 360),
		y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
	};
}

export function worldCoordsToGeo(world: WorldCoordinate): LatLng {
	// Just the mathematical inverse of `geoToWorldCoords` ignoring the sine truncation in (-0.9999, 0.9999).
	const temp = Math.exp(4 * Math.PI * (0.5 - world.y / TILE_SIZE));
	const siny = (temp - 1) / (temp + 1);

	return {
		latitude: (180 * Math.asin(siny)) / Math.PI,
		longitude: 360 * (world.x / TILE_SIZE - 0.5),
	};
}

export function worldCoordsToTilePixel(world: WorldCoordinate, zoomLevel: number): TilePixelCoordinate {
	const scale = zoomLevelToScale(zoomLevel);

	return {
		pixelX: Math.floor(world.x * scale),
		pixelY: Math.floor(world.y * scale),
		tileX: Math.floor((world.x * scale) / TILE_SIZE),
		tileY: Math.floor((world.y * scale) / TILE_SIZE),
	};
}

export function getBoundingBox(points: WorldCoordinate[], padding?: PaddingRem): BoundingBox {
	if (points.length === 0) {
		console.warn('Cannot compute a bounding box for an empty array of points. Instead of failing I will return the center of the world...');
		return [
			{ x: 256 / 4, y: 256 / 4 },
			{ x: (256 / 4) * 3, y: (256 / 4) * 3 },
		];
	}

	if (points.length === 1) {
		console.warn('Cannot compute a bounding box of a single point, but I will make a guess.');
		const point = points[0];
		return [
			{ x: 0.9 * point.x, y: 0.9 * point.y },
			{ x: 1.1 * point.x, y: 1.1 * point.y },
		];
	}

	if (padding) {
		const unpaddedBox = getBoundingBox(points);
		return addRoughPaddingToBoundingBox(unpaddedBox, padding);
	}

	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;

	for (const point of points) {
		if (point.x < minX) minX = point.x;
		if (point.x > maxX) maxX = point.x;
		if (point.y < minY) minY = point.y;
		if (point.y > maxY) maxY = point.y;
	}

	return [
		{ x: minX, y: minY },
		{ x: maxX, y: maxY },
	];
}

export function getCenteredBoundingBox(center: WorldCoordinate, points: WorldCoordinate[], padding?: PaddingRem): BoundingBox {
	const [minPointIgnoringCenter, maxPointIgnoringCenter] = getBoundingBox(points, padding);

	// prettier-ignore
	const horizontalDistanceToCenter = Math.max(
		Math.abs(center.x - minPointIgnoringCenter.x),
		Math.abs(center.x - maxPointIgnoringCenter.x),
	);

	// prettier-ignore
	const verticalDistanceToCenter = Math.max(
		Math.abs(center.y - minPointIgnoringCenter.y),
		Math.abs(center.y - maxPointIgnoringCenter.y),
	);

	return [
		{ x: center.x - horizontalDistanceToCenter, y: center.y - verticalDistanceToCenter },
		{ x: center.x + horizontalDistanceToCenter, y: center.y + verticalDistanceToCenter },
	];
}

export function boundingBoxToRegion(box: BoundingBox): Region {
	// https://stackoverflow.com/a/36688156/4135063
	// In a Region object, the latitude and longitude specify the center location and
	// latitudeDelta and longitudeDelta specify the span of the viewable map area.

	const centerX = (box[0].x + box[1].x) / 2;
	const centerY = (box[0].y + box[1].y) / 2;

	const topLeftGeo = worldCoordsToGeo(box[0]);
	const bottomRightGeo = worldCoordsToGeo(box[1]);
	const centerGeo = worldCoordsToGeo({ x: centerX, y: centerY });

	return {
		latitude: centerGeo.latitude,
		longitude: centerGeo.longitude,
		latitudeDelta: Math.abs(topLeftGeo.latitude - bottomRightGeo.latitude),
		longitudeDelta: Math.abs(topLeftGeo.longitude - bottomRightGeo.longitude),
	};
}

export function boundingBoxContains(box: BoundingBox, point: WorldCoordinate): boolean {
	return box[0].x < point.x && point.x < box[1].x && box[0].y < point.y && point.y < box[1].y;
}

export function getBoundingBoxCenter(box: BoundingBox): WorldCoordinate {
	return {
		x: (box[0].x + box[1].x) / 2,
		y: (box[0].y + box[1].y) / 2,
	};
}

export function cameraToBoundingBox(center: LatLng, zoomLevel: number, viewDimensions: MapViewDimensions): BoundingBox {
	const scale = 1 << zoomLevel; // Fast way to compute 2 ** Math.floor(zoom)

	const halfBoxWidth = Math.min(viewDimensions.widthPx / scale, TILE_SIZE) / 2;
	const halfBoxHeight = Math.min(viewDimensions.heightPx / scale, TILE_SIZE) / 2;
	const convertedCenter = geoToWorldCoords(center);

	return [
		{ x: convertedCenter.x - halfBoxWidth, y: convertedCenter.y - halfBoxHeight },
		{ x: convertedCenter.x + halfBoxWidth, y: convertedCenter.y + halfBoxHeight },
	];
}

export function boundingBoxToCamera(box: BoundingBox, viewDimensions: MapViewDimensions, maxZoomLevel: number): SimpleCamera {
	const region = boundingBoxToRegion(box);
	const center = {
		latitude: region.latitude,
		longitude: region.longitude,
	};

	let bestZoomLevel = 0;

	for (let level = 1; level <= maxZoomLevel; level++) {
		const guessedBox = cameraToBoundingBox(center, level, viewDimensions);
		if (boundingBoxContains(guessedBox, box[0]) && boundingBoxContains(guessedBox, box[1])) {
			bestZoomLevel = level;
		} else {
			break;
		}
	}

	return { center, zoom: bestZoomLevel };
}

export function cameraToTiles(center: LatLng, zoomLevel: number, viewDimensions: MapViewDimensions): TileCode[] {
	const box = cameraToBoundingBox(center, zoomLevel, viewDimensions);
	const topLeft = worldCoordsToTilePixel(box[0], zoomLevel);
	const bottomRight = worldCoordsToTilePixel(box[1], zoomLevel);

	const tiles: TileCode[] = [];

	for (let { tileX } = topLeft; tileX <= bottomRight.tileX; tileX++) {
		for (let { tileY } = topLeft; tileY <= bottomRight.tileY; tileY++) {
			tiles.push({ tileX, tileY, zoomLevel });
		}
	}

	return tiles;
}

export function worldDistanceToPixels(distance: number, zoomLevel: number): number {
	return distance * zoomLevelToScale(zoomLevel);
}

export function pixelsToWorldDistance(pixels: number, zoomLevel: number): number {
	return pixels / zoomLevelToScale(zoomLevel);
}

export function addExactPaddingToBoundingBox(box: BoundingBox, zoomLevel: number, padding: PaddingRem): BoundingBox {
	const paddingPx = toPaddingPx(padding);

	return [
		{
			x: box[0].x - pixelsToWorldDistance(paddingPx.leftPx, zoomLevel),
			y: box[0].y - pixelsToWorldDistance(paddingPx.topPx, zoomLevel),
		},
		{
			x: box[1].x + pixelsToWorldDistance(paddingPx.rightPx, zoomLevel),
			y: box[1].y + pixelsToWorldDistance(paddingPx.bottomPx, zoomLevel),
		},
	];
}

export function guessCameraZoomForBoundingBox(): number {
	return 17;
}

export function addRoughPaddingToBoundingBox(box: BoundingBox, paddingPixels: PaddingRem): BoundingBox {
	return addExactPaddingToBoundingBox(box, guessCameraZoomForBoundingBox(), paddingPixels);
}

export function mergeBoundingBoxes(box1: BoundingBox, box2: BoundingBox): BoundingBox {
	return [
		{ x: Math.min(box1[0].x, box2[0].x), y: Math.min(box1[0].y, box2[0].y) },
		{ x: Math.max(box1[1].x, box2[1].x), y: Math.max(box1[1].y, box2[1].y) },
	];
}

const PIN_PADDING = toPaddingPx({
	bottom: 16,
	left: 32,
	right: 32,
	top: 88,
});

export function addEnoughPaddingToEnsurePinsVisible(box: BoundingBox, pins: WorldCoordinate[]): BoundingBox {
	if (pins.length === 0) return box;

	const zoomLevel = guessCameraZoomForBoundingBox();

	const topPadding = pixelsToWorldDistance(PIN_PADDING.topPx, zoomLevel);
	const leftPadding = pixelsToWorldDistance(PIN_PADDING.leftPx, zoomLevel);
	const rightPadding = pixelsToWorldDistance(PIN_PADDING.rightPx, zoomLevel);

	const uppermostPinYValue = Math.min(...pins.map((pin) => pin.y));
	const leftmostPinXValue = Math.min(...pins.map((pin) => pin.x));
	const rightmostPinXValue = Math.max(...pins.map((pin) => pin.x));

	return [
		{ x: Math.min(box[0].x, leftmostPinXValue - leftPadding), y: Math.min(box[0].y, uppermostPinYValue - topPadding) },
		{ x: Math.max(box[1].x, rightmostPinXValue + rightPadding), y: box[1].y },
	];
}

export function safelyPredictTilesForBoundingBox(box: BoundingBox): TileCode[] {
	const mainZoomLevel = guessCameraZoomForBoundingBox();
	const safeGuessForDimensions: MapViewDimensions = { widthPx: WINDOW_WIDTH_PX * 1.2, heightPx: WINDOW_HEIGHT_PX * 0.9 };
	const center = worldCoordsToGeo(getBoundingBoxCenter(box));

	let tiles: TileCode[] = [];

	for (let zoomLevel = mainZoomLevel - 1; zoomLevel <= mainZoomLevel + 2; zoomLevel++) {
		tiles = tiles.concat(cameraToTiles(center, zoomLevel, safeGuessForDimensions));
	}

	return tiles;
}

// given an polygon (array of lat/long) calculates the topleft and bottom right bounding box for a polygon in geo coordinates
export function overlayBounding(coordinates: Array<[number, number]>): [[number, number], [number, number]] {
	let topLeftX = Infinity;
	let bottomRightX = -Infinity;
	let topLeftY = -Infinity;
	let bottomRightY = Infinity;

	for (const point of coordinates) {
		if (point[0] < topLeftX) topLeftX = point[0];
		if (point[0] > bottomRightX) bottomRightX = point[0];
		if (point[1] < bottomRightY) bottomRightY = point[1];
		if (point[1] > topLeftY) topLeftY = point[1];
	}

	return [
		[topLeftY, topLeftX],
		[bottomRightY, bottomRightX],
	];
}

// given polygon get a rought approximation of the upper center position
export function upperCenter(coordinates: Array<[number, number]>): LatLng {
	let topLeftX = Infinity;
	let topLeftY = -Infinity;
	let topRightX = -Infinity;
	let topRightY = -Infinity;

	for (const point of coordinates) {
		topLeftX = Math.min(topLeftX, point[0]);
		topLeftY = Math.max(topLeftY, point[1]);
		topRightX = Math.max(topRightX, point[0]);
		topRightY = Math.max(topRightY, point[1]);
	}

	return { longitude: (topLeftX + topRightX) / 2, latitude: (topLeftY + topRightY) / 2 };
}

// given polygon get a rought approximation of the lower center position
export function lowerCenter(coordinates: Array<[number, number]>): LatLng {
	let topLeftX = Infinity;
	let bottomLeftY = Infinity;
	let topRightX = -Infinity;
	let bottomRightY = Infinity;

	for (const point of coordinates) {
		topLeftX = Math.min(topLeftX, point[0]);
		bottomLeftY = Math.min(bottomLeftY, point[1]);
		topRightX = Math.max(topRightX, point[0]);
		bottomRightY = Math.min(bottomRightY, point[1]);
	}

	return { longitude: (topLeftX + topRightX) / 2, latitude: (bottomLeftY + bottomRightY) / 2 };
}

// given polygon get a rought approximation of the center position
export function center(coordinates: Array<[number, number]>): LatLng {
	const up = upperCenter(coordinates);
	const bottom = lowerCenter(coordinates);

	return { longitude: (up.longitude + bottom.longitude) / 2, latitude: (up.latitude + bottom.latitude) / 2 };
}
