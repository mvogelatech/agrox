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
exports.QuotationController = exports.QuotationDto = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const quotation_service_1 = require("./quotation.service");
const mail_service_1 = require("../mail/mail.service");
class QuotationDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], QuotationDto.prototype, "pulverizationStartDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], QuotationDto.prototype, "pulverizationEndDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ each: true }),
    __metadata("design:type", Object)
], QuotationDto.prototype, "fieldsWithMethods", void 0);
exports.QuotationDto = QuotationDto;
let QuotationController = class QuotationController {
    constructor(quotationService, mailService) {
        this.quotationService = quotationService;
        this.mailService = mailService;
    }
    async createQuotation(req, quotation) {
        const createdPackage = await this.quotationService.createQuotationPackage(req.user.userId, new Date(quotation.pulverizationStartDate), new Date(quotation.pulverizationEndDate), new Map(Object.entries(quotation.fieldsWithMethods).map((pair) => [Number(pair[0]), pair[1]])));
        const QUOTATION_MAIL_DESTINATIONS = await this.quotationService.getMails();
        const mailMessage = await this.quotationService.getMessageData(req.user.userId, createdPackage);
        await this.mailService.sendMail({
            to: QUOTATION_MAIL_DESTINATIONS,
            subject: `[Novo Orçamento] - Usuário: ${req.user.userId} - ID do Pacote: ${createdPackage.id}`,
            text: `${mailMessage}\n\n\nTimestamp: ${new Date().toISOString()}`,
        });
        return JSON.stringify(createdPackage, undefined, '\t');
    }
    async getQuotationPackages(req) {
        const packages = await this.quotationService.getQuotationPackages(req.user.userId);
        return JSON.stringify(packages, undefined, '\t');
    }
};
__decorate([
    common_1.Post(),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, QuotationDto]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "createQuotation", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "getQuotationPackages", null);
QuotationController = __decorate([
    common_1.Controller('quotation'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [quotation_service_1.QuotationService, mail_service_1.MailService])
], QuotationController);
exports.QuotationController = QuotationController;
//# sourceMappingURL=quotation.controller.js.map