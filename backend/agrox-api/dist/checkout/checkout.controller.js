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
exports.CheckoutController = exports.CheckoutDto = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const checkout_service_1 = require("./checkout.service");
const mail_service_1 = require("../mail/mail.service");
class CheckoutDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "selectedPrice", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CheckoutDto.prototype, "quotationID", void 0);
exports.CheckoutDto = CheckoutDto;
let CheckoutController = class CheckoutController {
    constructor(checkoutService, mailService) {
        this.checkoutService = checkoutService;
        this.mailService = mailService;
    }
    async createCheckout(req, checkout) {
        const createdCheckout = await this.checkoutService.createCheckout(req.user.userId, checkout.selectedPrice, checkout.quotationID);
        const CHECKOUT_MAIL_DESTINATIONS = await this.checkoutService.getMails();
        const mailMessage = await this.checkoutService.getMessageData(req.user.userId, createdCheckout);
        await this.mailService.sendMail({
            to: CHECKOUT_MAIL_DESTINATIONS,
            subject: `[Nova Pulverização] - Usuário: ${req.user.userId} - ID do Checkout: ${createdCheckout.id}`,
            text: `${mailMessage}\n\n\nTimestamp: ${new Date().toISOString()}`,
        });
        return JSON.stringify(createdCheckout, undefined, '\t');
    }
    async getCheckoutGroups(req) {
        const checkoutGroups = await this.checkoutService.getCheckoutGroups(req.user.userId);
        return JSON.stringify(checkoutGroups, undefined, '\t');
    }
};
__decorate([
    common_1.Post(),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CheckoutDto]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "createCheckout", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "getCheckoutGroups", null);
CheckoutController = __decorate([
    common_1.Controller('checkout'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [checkout_service_1.CheckoutService, mail_service_1.MailService])
], CheckoutController);
exports.CheckoutController = CheckoutController;
//# sourceMappingURL=checkout.controller.js.map