"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapTilesController = void 0;
const common_1 = require("@nestjs/common");
const map_tiles_service_1 = require("./map-tiles.service");
const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
function assertAccessTokenValid(token) {
    if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
        throw new Error(`Invalid access token: ${token}`);
    }
}
let MapTilesController = class MapTilesController {
    constructor(mapTilesService) {
        this.mapTilesService = mapTilesService;
    }
    async getTile(farmid, date, z, x, y, token, res) {
        const buff = Buffer.from(token, 'base64');
        const decodedToken = buff.toString('ascii');
        assertAccessTokenValid(decodedToken);
        const img = await this.mapTilesService.tileUrl(farmid, date, z, x, y);
        if (img && img.length > 0)
            res.type('png').send(img);
    }
};
__decorate([
    common_1.Get(':farmid/:date/:z/:x/:y/:token'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('farmid')),
    __param(1, common_1.Param('date')),
    __param(2, common_1.Param('z')),
    __param(3, common_1.Param('x')),
    __param(4, common_1.Param('y')),
    __param(5, common_1.Param('token')),
    __param(6, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MapTilesController.prototype, "getTile", null);
MapTilesController = __decorate([
    common_1.Controller('map-tiles'),
    __metadata("design:paramtypes", [map_tiles_service_1.MapTilesService])
], MapTilesController);
exports.MapTilesController = MapTilesController;
//# sourceMappingURL=map-tiles.controller.js.map