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
exports.TermsAndConditionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const terms_and_conditions_service_1 = require("./terms-and-conditions.service");
const class_validator_1 = require("class-validator");
class SetReadDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], SetReadDto.prototype, "termsAndConditionsId", void 0);
let TermsAndConditionsController = class TermsAndConditionsController {
    constructor(termsAndConditionsService) {
        this.termsAndConditionsService = termsAndConditionsService;
    }
    async getCompanies() {
        const termsAndConditions = await this.termsAndConditionsService.getTermsAndConditions();
        return JSON.stringify(termsAndConditions, undefined, '\t');
    }
    async createUserAcceptedTerms(req, data) {
        console.log(`Terms And Conditions ${data.termsAndConditionsId} was read`);
        const acceptedTerms = await this.termsAndConditionsService.createUserAcceptedTerms(req.user.userId, data.termsAndConditionsId);
        return JSON.stringify(acceptedTerms, undefined, '\t');
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TermsAndConditionsController.prototype, "getCompanies", null);
__decorate([
    common_1.Post('set-read'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SetReadDto]),
    __metadata("design:returntype", Promise)
], TermsAndConditionsController.prototype, "createUserAcceptedTerms", null);
TermsAndConditionsController = __decorate([
    common_1.Controller('terms-and-conditions'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [terms_and_conditions_service_1.TermsAndConditionsService])
], TermsAndConditionsController);
exports.TermsAndConditionsController = TermsAndConditionsController;
//# sourceMappingURL=terms-and-conditions.controller.js.map