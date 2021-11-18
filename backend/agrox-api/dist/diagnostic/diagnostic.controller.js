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
exports.DiagnosticController = exports.DiagnosticDto = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const diagnostic_service_1 = require("./diagnostic.service");
const mail_service_1 = require("../mail/mail.service");
class DiagnosticDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], DiagnosticDto.prototype, "pulverizationStartDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], DiagnosticDto.prototype, "pulverizationEndDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ each: true }),
    __metadata("design:type", Object)
], DiagnosticDto.prototype, "fieldsWithMethods", void 0);
exports.DiagnosticDto = DiagnosticDto;
let DiagnosticController = class DiagnosticController {
    constructor(diagnosticService, mailService) {
        this.diagnosticService = diagnosticService;
        this.mailService = mailService;
    }
    async createDiagnostic(req) {
        const QUOTATION_MAIL_DESTINATIONS = await this.diagnosticService.getMails();
        const mailMessage = await this.diagnosticService.getMessageData(req.user.userId, req.body);
        await this.mailService.sendMail({
            to: QUOTATION_MAIL_DESTINATIONS,
            subject: `[Novo Orçamento] - Usuário: ${req.user.userId}`,
            text: `${mailMessage}\n\n\nTimestamp: ${new Date().toISOString()}`,
        });
        return JSON.stringify(mailMessage, undefined, '\t');
    }
};
__decorate([
    common_1.Post(),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosticController.prototype, "createDiagnostic", null);
DiagnosticController = __decorate([
    common_1.Controller('diagnostic'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [diagnostic_service_1.DiagnosticService, mail_service_1.MailService])
], DiagnosticController);
exports.DiagnosticController = DiagnosticController;
//# sourceMappingURL=diagnostic.controller.js.map