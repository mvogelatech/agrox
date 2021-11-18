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
exports.WebController = void 0;
const common_1 = require("@nestjs/common");
const web_service_1 = require("./web.service");
const quotation_service_1 = require("../quotation/quotation.service");
const mail_service_1 = require("../mail/mail.service");
const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
function assertAccessTokenValid(token) {
    if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
        throw new Error(`Invalid access token: ${token}`);
    }
}
let WebController = class WebController {
    constructor(WebService, quotationService, mailService) {
        this.WebService = WebService;
        this.quotationService = quotationService;
        this.mailService = mailService;
    }
    async getDiagnosisWithMap(diagnosisId) {
        console.log('teste');
        const data = await this.WebService.getFarmDataByUserId(2);
        return JSON.stringify(data, undefined, '\t');
    }
    async updateDiagnosisData(body) {
        console.log('post');
        const update = await this.WebService.savePrescription(body.data);
        console.log('data', update);
        return update;
    }
};
__decorate([
    common_1.Get(),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('diagnosis_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "getDiagnosisWithMap", null);
__decorate([
    common_1.Post('update'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "updateDiagnosisData", null);
WebController = __decorate([
    common_1.Controller('web'),
    __metadata("design:paramtypes", [web_service_1.WebService, quotation_service_1.QuotationService, mail_service_1.MailService])
], WebController);
exports.WebController = WebController;
//# sourceMappingURL=web.controller.js.map