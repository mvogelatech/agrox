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
exports.VisionaController = exports.ImageDTO = exports.VisionaDTO = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const visiona_service_1 = require("./visiona.service");
const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
function assertAccessTokenValid(token) {
    if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
        throw new Error(`Invalid access token: ${token}`);
    }
}
class VisionaDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], VisionaDTO.prototype, "accessToken", void 0);
exports.VisionaDTO = VisionaDTO;
class ImageDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ImageDTO.prototype, "accessToken", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ImageDTO.prototype, "url", void 0);
exports.ImageDTO = ImageDTO;
let VisionaController = class VisionaController {
    constructor(visionaService) {
        this.visionaService = visionaService;
    }
    async listArea(data) {
        assertAccessTokenValid(data.accessToken);
        if (data.id)
            return this.visionaService.listArea(data.id);
        return this.visionaService.listArea();
    }
    async createArea(data) {
        assertAccessTokenValid(data.accessToken);
        return this.visionaService.createArea(data.id);
    }
    async createAreas(data) {
        assertAccessTokenValid(data.accessToken);
        return this.visionaService.createAreas(data.id);
    }
    async deleteArea(data) {
        assertAccessTokenValid(data.accessToken);
        return this.visionaService.deleteArea(data.id);
    }
    async deleteAreas(data) {
        assertAccessTokenValid(data.accessToken);
        return this.visionaService.deleteAreas(data.id);
    }
    async listObservations(data) {
        assertAccessTokenValid(data.accessToken);
        return this.visionaService.listObservations(data.id);
    }
};
__decorate([
    common_1.Post('list-area'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VisionaDTO]),
    __metadata("design:returntype", Promise)
], VisionaController.prototype, "listArea", null);
__decorate([
    common_1.Post('create-area'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VisionaDTO]),
    __metadata("design:returntype", Promise)
], VisionaController.prototype, "createArea", null);
__decorate([
    common_1.Post('create-areas'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VisionaDTO]),
    __metadata("design:returntype", Promise)
], VisionaController.prototype, "createAreas", null);
__decorate([
    common_1.Post('delete-area'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VisionaDTO]),
    __metadata("design:returntype", Promise)
], VisionaController.prototype, "deleteArea", null);
__decorate([
    common_1.Post('delete-areas'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VisionaDTO]),
    __metadata("design:returntype", Promise)
], VisionaController.prototype, "deleteAreas", null);
__decorate([
    common_1.Post('list-observations'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VisionaDTO]),
    __metadata("design:returntype", Promise)
], VisionaController.prototype, "listObservations", null);
VisionaController = __decorate([
    common_1.Controller('visiona'),
    __metadata("design:paramtypes", [visiona_service_1.VisionaService])
], VisionaController);
exports.VisionaController = VisionaController;
//# sourceMappingURL=visiona.controller.js.map