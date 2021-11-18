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
exports.CromaiController = exports.DiagnosisDTO = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const cromaitask_service_1 = require("./cromaitask.service");
const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
function assertAccessTokenValid(token) {
    if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
        throw new Error(`Invalid access token: ${token}`);
    }
}
class DiagnosisDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], DiagnosisDTO.prototype, "accessToken", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Object)
], DiagnosisDTO.prototype, "diagnosis", void 0);
exports.DiagnosisDTO = DiagnosisDTO;
let CromaiController = class CromaiController {
    constructor(diagnosisParser) {
        this.diagnosisParser = diagnosisParser;
    }
    async updateDiagnosisData(data) {
        assertAccessTokenValid(data.accessToken);
        await this.diagnosisParser.updateFieldPlagueDiagnosisData(data.diagnosis);
    }
};
__decorate([
    common_1.Post('update-diagnosis-data'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DiagnosisDTO]),
    __metadata("design:returntype", Promise)
], CromaiController.prototype, "updateDiagnosisData", null);
CromaiController = __decorate([
    common_1.Controller('cromai'),
    __metadata("design:paramtypes", [cromaitask_service_1.CromaiParserService])
], CromaiController);
exports.CromaiController = CromaiController;
//# sourceMappingURL=cromai.controller.js.map