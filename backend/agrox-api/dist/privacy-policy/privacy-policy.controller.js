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
exports.PrivacyPolicyController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const privacy_policy_service_1 = require("./privacy-policy.service");
const class_validator_1 = require("class-validator");
class SetReadDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], SetReadDto.prototype, "privacyPolicyId", void 0);
let PrivacyPolicyController = class PrivacyPolicyController {
    constructor(privacyPolicyService) {
        this.privacyPolicyService = privacyPolicyService;
    }
    async getCompanies() {
        const privacyPolicy = await this.privacyPolicyService.getPrivacyPolicy();
        return JSON.stringify(privacyPolicy, undefined, '\t');
    }
    async createUserAcceptedTerms(req, data) {
        console.log(`Privacy Policy ${data.privacyPolicyId} was read`);
        const acceptedTerms = await this.privacyPolicyService.createUserAcceptedPrivacyPolicy(req.user.userId, data.privacyPolicyId);
        return JSON.stringify(acceptedTerms, undefined, '\t');
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrivacyPolicyController.prototype, "getCompanies", null);
__decorate([
    common_1.Post('set-read'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SetReadDto]),
    __metadata("design:returntype", Promise)
], PrivacyPolicyController.prototype, "createUserAcceptedTerms", null);
PrivacyPolicyController = __decorate([
    common_1.Controller('privacy-policy'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [privacy_policy_service_1.PrivacyPolicyService])
], PrivacyPolicyController);
exports.PrivacyPolicyController = PrivacyPolicyController;
//# sourceMappingURL=privacy-policy.controller.js.map