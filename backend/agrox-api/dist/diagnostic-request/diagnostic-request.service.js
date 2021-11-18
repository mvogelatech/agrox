"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DiagnosisReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosisReportService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const PImage = require("pureimage");
const ensureError = require("ensure-error");
const color_utils_1 = require("../dev-scripts/helpers/color-utils");
const memory_streams_1 = require("memory-streams");
const map_tiles_service_1 = require("../map-tiles/map-tiles.service");
const Stream = require("stream");
const prisma = new client_1.PrismaClient();
const TILE_SIZE = 256;
function zoomLevelToScale(zoomLevel) {
    return 1 << zoomLevel;
}
function geoToWorldCoords(geo) {
    let siny = Math.sin((geo.latitude * Math.PI) / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    return {
        x: TILE_SIZE * (0.5 + geo.longitude / 360),
        y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
    };
}
function worldDistanceToPixels(distance, zoomLevel) {
    return distance * zoomLevelToScale(zoomLevel);
}
function getPixelOffset(reference, point, zoomLevel) {
    const referenceAsWorldCoords = geoToWorldCoords(reference);
    const pointAsWorldCoords = geoToWorldCoords(point);
    const pixelsX = worldDistanceToPixels(pointAsWorldCoords.x - referenceAsWorldCoords.x, zoomLevel);
    const pixelsY = worldDistanceToPixels(pointAsWorldCoords.y - referenceAsWorldCoords.y, zoomLevel);
    return { pixelsX, pixelsY };
}
async function findDiagnosisById(diagnosisId) {
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
    if (!diagnosisData)
        throw new Error(`Failed to find diagnosis data for id ${diagnosisId}`);
    return diagnosisData;
}
function overlayBounding(coordinates) {
    let topLeftX = Infinity;
    let bottomRightX = -Infinity;
    let topLeftY = -Infinity;
    let bottomRightY = Infinity;
    for (const point of coordinates) {
        if (point[0] < topLeftX)
            topLeftX = point[0];
        if (point[0] > bottomRightX)
            bottomRightX = point[0];
        if (point[1] < bottomRightY)
            bottomRightY = point[1];
        if (point[1] > topLeftY)
            topLeftY = point[1];
    }
    return [
        [topLeftY, topLeftX],
        [bottomRightY, bottomRightX],
    ];
}
function metersToLatLon(mx, my) {
    const originShift = (2 * Math.PI * 6378137) / 2;
    const lon = (mx / originShift) * 180;
    let lat = (my / originShift) * 180;
    lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
    return [lat, lon];
}
function resolution(zoom) {
    return (2 * Math.PI * 6378137) / TILE_SIZE / (1 << zoom);
}
function pixelsToMeters(px, py, zoom) {
    const originShift = (2 * Math.PI * 6378137) / 2;
    const res = resolution(zoom);
    const mx = px * res - originShift;
    const my = py * res - originShift;
    return [mx, my];
}
function tileBounds(tx, ty, zoom) {
    const [minx, miny] = pixelsToMeters(tx * TILE_SIZE, ty * TILE_SIZE, zoom);
    const [maxx, maxy] = pixelsToMeters((tx + 1) * TILE_SIZE, (ty + 1) * TILE_SIZE, zoom);
    return [minx, miny, maxx, maxy];
}
function tileLatLonBounds(tx, ty, zoom) {
    const bounds = tileBounds(tx, ty, zoom);
    const [minLat, minLon] = metersToLatLon(bounds[0], bounds[1]);
    const [maxLat, maxLon] = metersToLatLon(bounds[2], bounds[3]);
    return [-minLat, minLon, -maxLat, maxLon];
}
function degTorad(deg) {
    return (deg * Math.PI) / 180;
}
function lonToTileX(lon, zoomLevel) {
    return Math.floor(((lon + 180) / 360) * (1 << zoomLevel));
}
function latToTileY(lat, zoomLevel) {
    return Math.floor(((1 - Math.log(Math.tan(degTorad(lat)) + 1 / Math.cos(degTorad(lat))) / Math.PI) / 2) * (1 << zoomLevel));
}
async function drawTilesForBbox(farmid, date, minTileX, maxTileX, minTileY, maxTileY, zoom) {
    const mts = new map_tiles_service_1.MapTilesService();
    const height = (maxTileY + 1 - minTileY) * TILE_SIZE;
    const width = (maxTileX + 1 - minTileX) * TILE_SIZE;
    const pImage = await PImage.make(width, height);
    const ctx = pImage.getContext('2d');
    let destX = 0;
    let destY = 0;
    for (let x = minTileX; x < maxTileX + 1; x++) {
        for (let y = minTileY; y < maxTileY + 1; y++) {
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
function drawFences(ctx, coordinates, centerLat, centerLon, zoom, sideW, sideH) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    let firstPoint = true;
    for (const point of coordinates) {
        const tileCoordPixels = getPixelOffset({ latitude: centerLat, longitude: centerLon }, { latitude: point[1], longitude: point[0] }, zoom);
        const x = Math.floor(tileCoordPixels.pixelsX + sideW / 2);
        const y = Math.floor(tileCoordPixels.pixelsY + sideH / 2);
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        }
        else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();
}
function drawDiagnosis(ctx, infestation, centerLat, centerLon, zoom, sideW, sideH) {
    for (const infestationData of infestation) {
        for (const point of infestationData.points) {
            const tileCoordPixels = getPixelOffset({ latitude: centerLat, longitude: centerLon }, { latitude: point.center.latitude, longitude: point.center.longitude }, zoom);
            const x = Math.floor(tileCoordPixels.pixelsX + sideW / 2);
            const y = Math.floor(tileCoordPixels.pixelsY + sideH / 2);
            ctx.strokeStyle = color_utils_1.hexToRGBA(infestationData.plague.color, 1);
            ctx.lineWidth = 2;
            ctx.fillStyle = color_utils_1.hexToRGBA(infestationData.plague.color, 1);
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, 0, true);
            ctx.closePath();
            ctx.fill();
        }
    }
}
let DiagnosisReportService = DiagnosisReportService_1 = class DiagnosisReportService {
    constructor() {
        this.logger = new common_1.Logger(DiagnosisReportService_1.name);
    }
    async generateFieldDiagnosisPNG(diagnosisId, mapDatePath, zoom) {
        try {
            const diagnosis = await findDiagnosisById(diagnosisId);
            if (!diagnosis.crop)
                throw new Error(`Failed to find crop-diagnosis data for id ${diagnosisId}`);
            if (!zoom)
                zoom = 17;
            const coords = diagnosis.crop.field.coordinates;
            const [[topLeftY, topLeftX], [bottomRightY, bottomRightX]] = overlayBounding(coords);
            let finalImage = null;
            let ctx = null;
            if (mapDatePath) {
                const minTileX = lonToTileX(topLeftX, zoom);
                const maxTileX = lonToTileX(bottomRightX, zoom);
                const minTileY = latToTileY(topLeftY, zoom);
                const maxTileY = latToTileY(bottomRightY, zoom);
                const topLeftBound = tileLatLonBounds(minTileX, minTileY, zoom);
                const bottomRightBound = tileLatLonBounds(maxTileX, maxTileY, zoom);
                const topLeftOffset = getPixelOffset({ latitude: topLeftBound[0], longitude: topLeftBound[1] }, { latitude: topLeftY, longitude: topLeftX }, zoom);
                const mapImage = await drawTilesForBbox(diagnosis.crop.field.area.farm_id, mapDatePath, minTileX, maxTileX, minTileY, maxTileY, zoom);
                const sx = Math.floor(topLeftOffset.pixelsX);
                const sy = Math.floor(topLeftOffset.pixelsY);
                const bottomRightOffset = getPixelOffset({ latitude: bottomRightY, longitude: bottomRightX }, { latitude: bottomRightBound[2], longitude: bottomRightBound[3] }, zoom);
                const dx = Math.floor(bottomRightOffset.pixelsX);
                const dy = Math.floor(bottomRightOffset.pixelsY);
                const finalHeight = mapImage.height - (sy + dy);
                const finalWidth = mapImage.width - (sx + dx);
                finalImage = await PImage.make(finalWidth, finalHeight);
                ctx = finalImage.getContext('2d');
                ctx.drawImage(mapImage, sx, sy, mapImage.width - dx, mapImage.height - dy, 0, 0, mapImage.width - dx, mapImage.height - dy);
            }
            else {
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
            const centerLat = diagnosis.crop.field.lat;
            const centerLon = diagnosis.crop.field.long;
            drawFences(ctx, coords, centerLat, centerLon, zoom, finalImage.width, finalImage.height);
            drawDiagnosis(ctx, diagnosis.infestation, centerLat, centerLon, zoom, finalImage.width, finalImage.height);
            const writer = new memory_streams_1.WritableStream();
            await PImage.encodePNGToStream(finalImage, writer);
            return writer.toBuffer();
        }
        catch (error) {
            const message = `generateFieldDiagnosisPNG failed: ${ensureError(error).message}`;
            this.logger.error(message);
            console.log(error);
            return [];
        }
    }
};
DiagnosisReportService = DiagnosisReportService_1 = __decorate([
    common_1.Injectable()
], DiagnosisReportService);
exports.DiagnosisReportService = DiagnosisReportService;
//# sourceMappingURL=diagnostic-request.service.js.map