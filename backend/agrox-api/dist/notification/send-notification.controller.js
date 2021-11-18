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
exports.SendNotificationController = exports.NotificationController = exports.NotifySomethingReadyDto = exports.NotifySimpleMessageLinkDto = exports.NotifySimpleMessageDto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const notification_service_1 = require("./notification.service");
const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';
function assertAccessTokenValid(token) {
    if (token !== ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS) {
        throw new Error(`Invalid access token: ${token}`);
    }
}
class NotifySimpleMessageDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], NotifySimpleMessageDto.prototype, "accessToken", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], NotifySimpleMessageDto.prototype, "userId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], NotifySimpleMessageDto.prototype, "messageTitle", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], NotifySimpleMessageDto.prototype, "messageContent", void 0);
exports.NotifySimpleMessageDto = NotifySimpleMessageDto;
class SetReadDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], SetReadDto.prototype, "notificationId", void 0);
class NotifySimpleMessageLinkDto extends NotifySimpleMessageDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], NotifySimpleMessageLinkDto.prototype, "link", void 0);
exports.NotifySimpleMessageLinkDto = NotifySimpleMessageLinkDto;
class NotifySomethingReadyDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], NotifySomethingReadyDto.prototype, "accessToken", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], NotifySomethingReadyDto.prototype, "userId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], NotifySomethingReadyDto.prototype, "genericId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], NotifySomethingReadyDto.prototype, "messageTitle", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], NotifySomethingReadyDto.prototype, "messageContent", void 0);
exports.NotifySomethingReadyDto = NotifySomethingReadyDto;
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async setRead(data) {
        console.log(`Notification ${data.notificationId} was read`);
        await this.notificationService.setNotificationRead(data.notificationId);
    }
};
__decorate([
    common_1.Post('set-read'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetReadDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "setRead", null);
NotificationController = __decorate([
    common_1.Controller('notification'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
exports.NotificationController = NotificationController;
let SendNotificationController = class SendNotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async notifySimpleMessage(data) {
        assertAccessTokenValid(data.accessToken);
        console.log(`Will send simple-message notification for user ${data.userId}`);
        await this.notificationService.sendSimpleMessageNotification(data.userId, {
            title: data.messageTitle,
            message: data.messageContent,
        });
    }
    async notifyQuotationReady(data) {
        assertAccessTokenValid(data.accessToken);
        console.log(`Will send quotation-ready notification for user ${data.userId} (quotation ${data.genericId})`);
        await this.notificationService.sendQuotationReadyNotification(data.userId, {
            title: data.messageTitle,
            message: data.messageContent,
            genericId: data.genericId,
        });
    }
    async notifyPrescriptionReady(data) {
        assertAccessTokenValid(data.accessToken);
        console.log(`Will send prescription-ready notification for user ${data.userId} (prescription ${data.genericId})`);
        await this.notificationService.sendPrescriptionReadyNotification(data.userId, {
            title: data.messageTitle,
            message: data.messageContent,
            genericId: data.genericId,
        });
    }
    async notifyDiagnosisReady(data) {
        assertAccessTokenValid(data.accessToken);
        console.log(`Will send diagnosis-ready notification for user ${data.userId} (diagnosis ${data.genericId})`);
        await this.notificationService.sendDiagnosisReadyNotification(data.userId, {
            title: data.messageTitle,
            message: data.messageContent,
            genericId: data.genericId,
        });
    }
    async notifyNewTermsAndConditions(data) {
        assertAccessTokenValid(data.accessToken);
        console.log(`Will send new-terms-and-conditions notification for user ${data.userId}`);
        await this.notificationService.sendTermsAndConditionsNotification(data.userId, {
            title: data.messageTitle,
            message: data.messageContent,
        });
    }
    async notifyAppUpdate(data) {
        assertAccessTokenValid(data.accessToken);
        console.log(`Will send app-update notification for user ${data.userId}`);
        await this.notificationService.sendAppUpdateNotification(data.userId, {
            title: data.messageTitle,
            message: data.messageContent,
            link: data.link,
        });
    }
};
__decorate([
    common_1.Post('simple-message'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NotifySimpleMessageDto]),
    __metadata("design:returntype", Promise)
], SendNotificationController.prototype, "notifySimpleMessage", null);
__decorate([
    common_1.Post('quotation-ready'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NotifySomethingReadyDto]),
    __metadata("design:returntype", Promise)
], SendNotificationController.prototype, "notifyQuotationReady", null);
__decorate([
    common_1.Post('prescription-ready'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NotifySomethingReadyDto]),
    __metadata("design:returntype", Promise)
], SendNotificationController.prototype, "notifyPrescriptionReady", null);
__decorate([
    common_1.Post('diagnosis-ready'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NotifySomethingReadyDto]),
    __metadata("design:returntype", Promise)
], SendNotificationController.prototype, "notifyDiagnosisReady", null);
__decorate([
    common_1.Post('new-terms-and-conditions'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NotifySimpleMessageDto]),
    __metadata("design:returntype", Promise)
], SendNotificationController.prototype, "notifyNewTermsAndConditions", null);
__decorate([
    common_1.Post('app-update'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NotifySimpleMessageLinkDto]),
    __metadata("design:returntype", Promise)
], SendNotificationController.prototype, "notifyAppUpdate", null);
SendNotificationController = __decorate([
    common_1.Controller('send-notification'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], SendNotificationController);
exports.SendNotificationController = SendNotificationController;
//# sourceMappingURL=send-notification.controller.js.map