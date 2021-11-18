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
exports.DiagnosisReportController = void 0;
const common_1 = require("@nestjs/common");
const diagnosis_report_service_1 = require("./diagnosis-report.service");
const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
function assertAccessTokenValid(token) {
    if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
        throw new Error(`Invalid access token: ${token}`);
    }
}
let DiagnosisReportController = class DiagnosisReportController {
    constructor(diagnosisService) {
        this.diagnosisService = diagnosisService;
    }
    async getDiagnosis(fieldId, diagnosisId, token, res) {
        const buff = Buffer.from(token, 'base64');
        const decodedToken = buff.toString('ascii');
        assertAccessTokenValid(decodedToken);
        const img = await this.diagnosisService.generateFieldDiagnosisPNG(Number.parseInt(diagnosisId, 10));
        res.type('png').send(img);
    }
    async getDiagnosisWithMap(diagnosisId, datePath, zoom, token, res) {
        const buff = Buffer.from(token, 'base64');
        const decodedToken = buff.toString('ascii');
        assertAccessTokenValid(decodedToken);
        const img = await this.diagnosisService.generateFieldDiagnosisPNG(Number.parseInt(diagnosisId, 10), datePath, Number.parseInt(zoom, 10));
        res.type('png').send(img);
    }
};
__decorate([
    common_1.Get(':field_id/:diagnosis_id/:token'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('field_id')), __param(1, common_1.Param('diagnosis_id')), __param(2, common_1.Param('token')), __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], DiagnosisReportController.prototype, "getDiagnosis", null);
__decorate([
    common_1.Get(':diagnosis_id/:date_path/:zoom/:token/'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('diagnosis_id')),
    __param(1, common_1.Param('date_path')),
    __param(2, common_1.Param('zoom')),
    __param(3, common_1.Param('token')),
    __param(4, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], DiagnosisReportController.prototype, "getDiagnosisWithMap", null);
DiagnosisReportController = __decorate([
    common_1.Controller('diagnosis'),
    __metadata("design:paramtypes", [diagnosis_report_service_1.DiagnosisReportService])
], DiagnosisReportController);
exports.DiagnosisReportController = DiagnosisReportController;
//# sourceMappingURL=diagnosis-report.controller.js.map