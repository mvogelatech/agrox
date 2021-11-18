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
exports.RegisterFCMTokenController = exports.RegisterFCMTokenDto = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const notification_service_1 = require("./notification.service");
class RegisterFCMTokenDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RegisterFCMTokenDto.prototype, "token", void 0);
exports.RegisterFCMTokenDto = RegisterFCMTokenDto;
let RegisterFCMTokenController = class RegisterFCMTokenController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async createQuotation(req, data) {
        console.log(`Received new FCM token for user #${req.user.userId}: ${data.token}`);
        await this.notificationService.saveUserToken(req.user.userId, data.token);
    }
};
__decorate([
    common_1.Post(),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RegisterFCMTokenDto]),
    __metadata("design:returntype", Promise)
], RegisterFCMTokenController.prototype, "createQuotation", null);
RegisterFCMTokenController = __decorate([
    common_1.Controller('register-fcm-token'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], RegisterFCMTokenController);
exports.RegisterFCMTokenController = RegisterFCMTokenController;
//# sourceMappingURL=register-fcm-token.controller.js.map