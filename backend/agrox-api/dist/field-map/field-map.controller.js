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
exports.FieldMapController = exports.FieldMapDTO = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const field_map_service_1 = require("./field-map.service");
const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
function assertAccessTokenValid(token) {
    if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
        throw new Error(`Invalid access token: ${token}`);
    }
}
class FieldMapDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FieldMapDTO.prototype, "accessToken", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Object)
], FieldMapDTO.prototype, "geojsonData", void 0);
exports.FieldMapDTO = FieldMapDTO;
let FieldMapController = class FieldMapController {
    constructor(fieldMapService) {
        this.fieldMapService = fieldMapService;
    }
    async createUpdateFieldMap(data) {
        assertAccessTokenValid(data.accessToken);
        return this.fieldMapService.insertFieldData(data.geojsonData);
    }
};
__decorate([
    common_1.Post('create-update'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FieldMapDTO]),
    __metadata("design:returntype", Promise)
], FieldMapController.prototype, "createUpdateFieldMap", null);
FieldMapController = __decorate([
    common_1.Controller('field-map'),
    __metadata("design:paramtypes", [field_map_service_1.FieldMapService])
], FieldMapController);
exports.FieldMapController = FieldMapController;
//# sourceMappingURL=field-map.controller.js.map