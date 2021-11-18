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
exports.FarmController = exports.RegistrationDTO = exports.AreaFieldCropRegistrationDTO = exports.CropRegistrationDTO = exports.FieldRegistrationDTO = exports.AreaRegistrationDTO = exports.FarmRegistrationDTO = exports.AddressRegistrationDTO = exports.UserRegistrationDTO = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const farm_service_1 = require("./farm.service");
const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
function assertAccessTokenValid(token) {
    if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
        throw new Error(`Invalid access token: ${token}`);
    }
}
class UserRegistrationDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserRegistrationDTO.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserRegistrationDTO.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserRegistrationDTO.prototype, "username", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserRegistrationDTO.prototype, "password", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserRegistrationDTO.prototype, "cpf", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserRegistrationDTO.prototype, "phoneNumber", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserRegistrationDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UserRegistrationDTO.prototype, "roleName", void 0);
exports.UserRegistrationDTO = UserRegistrationDTO;
class AddressRegistrationDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddressRegistrationDTO.prototype, "street", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddressRegistrationDTO.prototype, "city", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddressRegistrationDTO.prototype, "number", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddressRegistrationDTO.prototype, "km", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddressRegistrationDTO.prototype, "postalCode", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddressRegistrationDTO.prototype, "complement", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddressRegistrationDTO.prototype, "neighborhood", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddressRegistrationDTO.prototype, "phoneNumber", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddressRegistrationDTO.prototype, "contactName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddressRegistrationDTO.prototype, "stateInitials", void 0);
exports.AddressRegistrationDTO = AddressRegistrationDTO;
class FarmRegistrationDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FarmRegistrationDTO.prototype, "cnpj", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FarmRegistrationDTO.prototype, "socialName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FarmRegistrationDTO.prototype, "fantasyName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FarmRegistrationDTO.prototype, "lat", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FarmRegistrationDTO.prototype, "long", void 0);
exports.FarmRegistrationDTO = FarmRegistrationDTO;
class AreaRegistrationDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AreaRegistrationDTO.prototype, "code", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AreaRegistrationDTO.prototype, "lat", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AreaRegistrationDTO.prototype, "long", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AreaRegistrationDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AreaRegistrationDTO.prototype, "stateInitials", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AreaRegistrationDTO.prototype, "city", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AreaRegistrationDTO.prototype, "zone", void 0);
exports.AreaRegistrationDTO = AreaRegistrationDTO;
class FieldRegistrationDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FieldRegistrationDTO.prototype, "code", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FieldRegistrationDTO.prototype, "areaHA", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FieldRegistrationDTO.prototype, "lat", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], FieldRegistrationDTO.prototype, "long", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], FieldRegistrationDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], FieldRegistrationDTO.prototype, "coordinates", void 0);
exports.FieldRegistrationDTO = FieldRegistrationDTO;
class CropRegistrationDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CropRegistrationDTO.prototype, "cropType", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CropRegistrationDTO.prototype, "variety", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CropRegistrationDTO.prototype, "sowingDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CropRegistrationDTO.prototype, "expectedHarvestDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], CropRegistrationDTO.prototype, "number", void 0);
exports.CropRegistrationDTO = CropRegistrationDTO;
class AreaFieldCropRegistrationDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", AreaRegistrationDTO)
], AreaFieldCropRegistrationDTO.prototype, "areaData", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", FieldRegistrationDTO)
], AreaFieldCropRegistrationDTO.prototype, "fieldData", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", CropRegistrationDTO)
], AreaFieldCropRegistrationDTO.prototype, "cropData", void 0);
exports.AreaFieldCropRegistrationDTO = AreaFieldCropRegistrationDTO;
class RegistrationDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RegistrationDTO.prototype, "accessToken", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", FarmRegistrationDTO)
], RegistrationDTO.prototype, "farmData", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", AddressRegistrationDTO)
], RegistrationDTO.prototype, "addressData", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Array)
], RegistrationDTO.prototype, "userListData", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Array)
], RegistrationDTO.prototype, "areaFieldCropListData", void 0);
exports.RegistrationDTO = RegistrationDTO;
let FarmController = class FarmController {
    constructor(farmService) {
        this.farmService = farmService;
    }
    async registerFarm(data) {
        assertAccessTokenValid(data.accessToken);
        await this.farmService.registerFarmBulk(data);
    }
};
__decorate([
    common_1.Post('register-farm'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegistrationDTO]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "registerFarm", null);
FarmController = __decorate([
    common_1.Controller('farm'),
    __metadata("design:paramtypes", [farm_service_1.FarmService])
], FarmController);
exports.FarmController = FarmController;
//# sourceMappingURL=farm.controller.js.map