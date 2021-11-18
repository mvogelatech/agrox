"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MapTilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapTilesService = void 0;
const common_1 = require("@nestjs/common");
const storage_1 = require("@google-cloud/storage");
let MapTilesService = MapTilesService_1 = class MapTilesService {
    constructor() {
        this.logger = new common_1.Logger(MapTilesService_1.name);
        this.storage = new storage_1.Storage();
    }
    async tileUrl(farmid, date, z, x, y) {
        const bucketName = 'agroexplore-field-maps';
        const myBucket = this.storage.bucket(bucketName);
        const fileName = `farm-id-${farmid}/${date}/${z}/${x}/${y}.png`;
        const file = myBucket.file(fileName);
        const check = await file.exists();
        if (check[0]) {
            const buff = await file.download();
            return buff[0];
        }
        return null;
    }
};
MapTilesService = MapTilesService_1 = __decorate([
    common_1.Injectable()
], MapTilesService);
exports.MapTilesService = MapTilesService;
//# sourceMappingURL=map-tiles.service.js.map