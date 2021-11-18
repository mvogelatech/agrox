import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import PImage = require('pureimage');
import ensureError = require('ensure-error');
import { hexToRGBA } from '../dev-scripts/helpers/color-utils';
import { WritableStream } from 'memory-streams';
import { MapTilesService } from '../map-tiles/map-tiles.service';
import Stream = require('stream');

const prisma = new PrismaClient();

type Coordinate = [number, number];

// https://geojson.org/geojson-spec.html
interface IPlaguePoint {
	center: {
		longitude: number;
		latitude: number;
	};
	coordinates: [Coordinate[]];
}

type LatLng = {
	latitude: number;
	longitude: number;
};

type WorldCoordinate = {
	x: number;
	y: number;
};

const TILE_SIZE = 256;

function zoomLevelToScale(zoomLevel: number): number {
	return 1 << zoomLevel; // Fast way to compute 2 ** Math.floor(zoom)
}

function geoToWorldCoords(geo: LatLng): WorldCoordinate {
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

function worldDistanceToPixels(distance: number, zoomLevel: number): number {
	return distance * zoomLevelToScale(zoomLevel);
}

function getPixelOffset(reference: LatLng, point: LatLng, zoomLevel: number): { pixelsX: number; pixelsY: number } {
	const referenceAsWorldCoords = geoToWorldCoords(reference);
	const pointAsWorldCoords = geoToWorldCoords(point);
	const pixelsX = worldDistanceToPixels(pointAsWorldCoords.x - referenceAsWorldCoords.x, zoomLevel);
	const pixelsY = worldDistanceToPixels(pointAsWorldCoords.y - referenceAsWorldCoords.y, zoomLevel);
	return { pixelsX, pixelsY };
}

async function findDiagnosisById(diagnosisId: number) {
	const diagnosisData = await prisma.diagnosis.findUnique({
		where: {
			id: diagnosisId,
		},
		include: {
			crop: {
				include: {
					field: {
						include: {
							area: {
								include: {
									farm: true,
								},
							},
						},
					},
				},
			},
			infestation: { include: { plague: true } },
		},
	});
	if (!diagnosisData) throw new Error(`Failed to find diagnosis data for id ${diagnosisId}`);

	return diagnosisData;
}

// given an polygon (array of lat/long) calculates the topleft and bottom right bounding box for a polygon in geo coordinates
function overlayBounding(coordinates: Array<[number, number]>): [[number, number], [number, number]] {
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

// from gdal2tiles.py gdal.org
function metersToLatLon(mx: number, my: number) {
	// "Converts XY point from Spherical Mercator EPSG:900913 to lat/lon in WGS84 Datum"
	const originShift = (2 * Math.PI * 6378137) / 2;
	const lon = (mx / originShift) * 180;
	let lat = (my / originShift) * 180;

	lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
	return [lat, lon];
}

// from gdal2tiles.py gdal.org
function resolution(zoom: number) {
	// "Resolution (meters/pixel) for given zoom level (measured at Equator)"
	return (2 * Math.PI * 6378137) / TILE_SIZE / (1 << zoom);
}

// from gdal2tiles.py gdal.org
function pixelsToMeters(px: number, py: number, zoom: number) {
	// "Converts pixel coordinates in given zoom level of pyramid to EPSG:900913"
	const originShift = (2 * Math.PI * 6378137) / 2;
	const res = resolution(zoom);
	const mx = px * res - originShift;
	const my = py * res - originShift;
	return [mx, my];
}

// from gdal2tiles.py gdal.org
function tileBounds(tx: number, ty: number, zoom: number) {
	// "Returns bounds of the given tile in EPSG:900913 coordinates"

	const [minx, miny] = pixelsToMeters(tx * TILE_SIZE, ty * TILE_SIZE, zoom);
	const [maxx, maxy] = pixelsToMeters((tx + 1) * TILE_SIZE, (ty + 1) * TILE_SIZE, zoom);
	return [minx, miny, maxx, maxy];
}

// from gdal2tiles.py gdal.org
function tileLatLonBounds(tx: number, ty: number, zoom: number) {
	// "Returns bounds of the given tile in latutude/longitude using WGS84 datum"
	const bounds = tileBounds(tx, ty, zoom);
	const [minLat, minLon] = metersToLatLon(bounds[0], bounds[1]);
	const [maxLat, maxLon] = metersToLatLon(bounds[2], bounds[3]);
	return [-minLat, minLon, -maxLat, maxLon];
}

function degTorad(deg: number) {
	return (deg * Math.PI) / 180;
}

function lonToTileX(lon: number, zoomLevel: number) {
	return Math.floor(((lon + 180) / 360) * (1 << zoomLevel));
}

function latToTileY(lat: number, zoomLevel: number) {
	return Math.floor(((1 - Math.log(Math.tan(degTorad(lat)) + 1 / Math.cos(degTorad(lat))) / Math.PI) / 2) * (1 << zoomLevel));
}

// from: https://gis.stackexchange.com/questions/189445/finding-the-map-tilesz-x-y-tile-data-in-a-given-bounding-box-and-zoom-level
async function drawTilesForBbox(farmid: number, date: string, minTileX: number, maxTileX: number, minTileY: number, maxTileY: number, zoom: number) {
	const mts: MapTilesService = new MapTilesService();
	const height = (maxTileY + 1 - minTileY) * TILE_SIZE;
	const width = (maxTileX + 1 - minTileX) * TILE_SIZE;
	const pImage = await PImage.make(width, height);
	const ctx = pImage.getContext('2d');
	// compute necessary tiles and offsets to reconstruct the original map image
	let destX = 0;
	let destY = 0;
	for (let x = minTileX; x < maxTileX + 1; x++) {
		for (let y = minTileY; y < maxTileY + 1; y++) {
			// flip y axis = TMS y -> Google gy
			const gy = (1 << zoom) - y - 1;
			const tileBuff = await mts.tileUrl(`${farmid}`, date, `${zoom}`, `${x}`, `${gy}`);
			if (tileBuff) {
				const stream = Stream.Readable.from(tileBuff);
				const bitmap = await PImage.decodePNGFromStream(stream);
				ctx.drawImage(bitmap, 0, 0, TILE_SIZE, TILE_SIZE, destX, destY, TILE_SIZE, TILE_SIZE);
			}

			destY += TILE_SIZE;
		}

		destX += TILE_SIZE;
		destY = 0;
	}

	return pImage;
}

function drawFences(ctx: any, coordinates: Coordinate[], centerLat: number, centerLon: number, zoom: number, sideW: number, sideH: number) {
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#FFFFFF';
	let firstPoint = true;
	for (const point of coordinates) {
		const tileCoordPixels: { pixelsX: number; pixelsY: number } = getPixelOffset(
			{ latitude: centerLat, longitude: centerLon },
			{ latitude: point[1], longitude: point[0] },
			zoom,
		);
		const x = Math.floor(tileCoordPixels.pixelsX + sideW / 2);
		const y = Math.floor(tileCoordPixels.pixelsY + sideH / 2);
		if (firstPoint) {
			ctx.moveTo(x, y);
			firstPoint = false;
		} else {
			ctx.lineTo(x, y);
		}
	}

	ctx.closePath();
	ctx.stroke();
}

function drawDiagnosis(ctx: any, infestation: any, centerLat: number, centerLon: number, zoom: number, sideW: number, sideH: number) {
	for (const infestationData of infestation) {
		for (const point of (infestationData.points as unknown) as IPlaguePoint[]) {
			const tileCoordPixels: { pixelsX: number; pixelsY: number } = getPixelOffset(
				{ latitude: centerLat, longitude: centerLon },
				{ latitude: point.center.latitude, longitude: point.center.longitude },
				zoom,
			);
			const x = Math.floor(tileCoordPixels.pixelsX + sideW / 2);
			const y = Math.floor(tileCoordPixels.pixelsY + sideH / 2);
			ctx.strokeStyle = hexToRGBA(infestationData.plague.color, 1);
			ctx.lineWidth = 2;
			ctx.fillStyle = hexToRGBA(infestationData.plague.color, 1);
			ctx.beginPath();
			ctx.arc(x, y, 1.5, 0, 0, true); // Outer circle
			ctx.closePath();
			ctx.fill();
		}
	}
}

@Injectable()
export class DiagnosisReportService {
	private readonly logger = new Logger(DiagnosisReportService.name);

	async generateFieldDiagnosisPNG(diagnosisId: number, mapDatePath?: string, zoom?: number) {
		try {
			const diagnosis = await findDiagnosisById(diagnosisId);

			if (!diagnosis.crop) throw new Error(`Failed to find crop-diagnosis data for id ${diagnosisId}`);

			if (!zoom) zoom = 17;

			const coords = diagnosis.crop.field.coordinates as Coordinate[];
			const [[topLeftY, topLeftX], [bottomRightY, bottomRightX]] = overlayBounding(coords);

			let finalImage = null;
			let ctx = null;

			if (mapDatePath) {
				const minTileX = lonToTileX(topLeftX, zoom);
				const maxTileX = lonToTileX(bottomRightX, zoom);
				const minTileY = latToTileY(topLeftY, zoom);
				const maxTileY = latToTileY(bottomRightY, zoom);

				// Calculates the offset from the actual field and cut from the original map image
				const topLeftBound = tileLatLonBounds(minTileX, minTileY, zoom); // [minLat, minLon, maxLat2, maxLon2]
				const bottomRightBound = tileLatLonBounds(maxTileX, maxTileY, zoom); // [minLat2, minLon2, maxLat, maxLon]

				const topLeftOffset: { pixelsX: number; pixelsY: number } = getPixelOffset(
					{ latitude: topLeftBound[0], longitude: topLeftBound[1] },
					{ latitude: topLeftY, longitude: topLeftX },
					zoom,
				);

				const mapImage = await drawTilesForBbox(diagnosis.crop.field.area.farm_id, mapDatePath, minTileX, maxTileX, minTileY, maxTileY, zoom);

				// source offset
				const sx = Math.floor(topLeftOffset.pixelsX);
				const sy = Math.floor(topLeftOffset.pixelsY);

				const bottomRightOffset: { pixelsX: number; pixelsY: number } = getPixelOffset(
					{ latitude: bottomRightY, longitude: bottomRightX },
					{ latitude: bottomRightBound[2], longitude: bottomRightBound[3] },
					zoom,
				);

				// destination offset
				const dx = Math.floor(bottomRightOffset.pixelsX);
				const dy = Math.floor(bottomRightOffset.pixelsY);

				const finalHeight = mapImage.height - (sy + dy);
				const finalWidth = mapImage.width - (sx + dx);
				finalImage = await PImage.make(finalWidth, finalHeight);
				ctx = finalImage.getContext('2d');
				ctx.drawImage(mapImage, sx, sy, mapImage.width - dx, mapImage.height - dy, 0, 0, mapImage.width - dx, mapImage.height - dy);
			} else {
				// calculate the width and height of the diagnosis image based on its coordinates and zoom level
				const [[topLeftY, topLeftX], [bottomRightY, bottomRightX]] = overlayBounding(coords);
				const [topRightY, topRightX, bottomLeftY, bottomLeftX] = [topLeftY, bottomRightX, bottomRightY, topLeftX];
				const zoom = 17;
				const offsW = getPixelOffset({ latitude: topLeftY, longitude: topLeftX }, { latitude: topRightY, longitude: topRightX }, zoom);
				const offsH = getPixelOffset({ latitude: topLeftY, longitude: topLeftX }, { latitude: bottomLeftY, longitude: bottomLeftX }, zoom);

				const sideW = offsW.pixelsX;
				const sideH = offsH.pixelsY;

				finalImage = await PImage.make(sideW, sideH);
				ctx = finalImage.getContext('2d');
			}

			const centerLat: number = diagnosis.crop.field.lat;
			const centerLon: number = diagnosis.crop.field.long;

			// draw the fence around the field
			drawFences(ctx, coords, centerLat, centerLon, zoom, finalImage.width, finalImage.height);
			// draw the infestation points
			drawDiagnosis(ctx, diagnosis.infestation, centerLat, centerLon, zoom, finalImage.width, finalImage.height);

			const writer = new WritableStream();
			await PImage.encodePNGToStream(finalImage, writer);
			return writer.toBuffer();
		} catch (error) {
			const message = `generateFieldDiagnosisPNG failed: ${ensureError(error).message}`;
			this.logger.error(message);
			console.log(error);
			return []; // empty buffer
		}
	}
}
