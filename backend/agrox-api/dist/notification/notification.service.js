"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const pMap = require("p-map");
const push_to_token_1 = require("./helpers/push-to-token");
const notification_types_1 = require("./helpers/notification-types");
const prisma = new client_1.PrismaClient();
const DEVICE_TOKEN_SEPARATOR = '###';
let NotificationService = class NotificationService {
    async saveUserToken(userId, token) {
        var _a;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error(`User with id ${userId} not found.`);
        if (!((_a = user.fcm_token) === null || _a === void 0 ? void 0 : _a.includes(token))) {
            const newTokenString = user.fcm_token ? `${user.fcm_token}${DEVICE_TOKEN_SEPARATOR}${token}` : token;
            await prisma.user.update({
                where: { id: userId },
                data: { fcm_token: newTokenString },
            });
        }
    }
    async setNotificationRead(id) {
        await prisma.notification.update({
            where: { id },
            data: {
                read_date: new Date(),
            },
        });
    }
    async sendSimpleMessageNotification(userId, data) {
        await this.createAndSendNotification(userId, 'MESSAGE', data, false);
    }
    async sendTermsAndConditionsNotification(userId, data) {
        await this.createAndSendNotification(userId, 'TERMS', data, false);
    }
    async sendQuotationReadyNotification(userId, data) {
        await this.createAndSendNotification(userId, 'QUOTATION', data, false);
    }
    async sendPrescriptionReadyNotification(userId, data) {
        await this.createAndSendNotification(userId, 'PRESCRIPTION', data, false);
    }
    async sendDiagnosisReadyNotification(userId, data) {
        await this.createAndSendNotification(userId, 'DIAGNOSIS', data, false);
    }
    async sendAppUpdateNotification(userId, data) {
        await this.createAndSendNotification(userId, 'APPUPDATE', data, false);
    }
    async getUserTokens(userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error(`User with id ${userId} not found.`);
        if (!user.fcm_token)
            return [];
        return user.fcm_token.split(DEVICE_TOKEN_SEPARATOR);
    }
    async createAndSendNotification(userId, type, data, silent) {
        const notification = await this.prismaCreateNotification(userId, type, data);
        console.log(`Created notification #${notification.id} in our database.`);
        await this.sendPushNotificationToUser(userId, {
            silent,
            messageTitle: data.title,
            messageContent: data.message,
            agroNotification: notification,
        });
        console.log(`Sent push notification to user's devices.`);
    }
    async prismaCreateNotification(userId, type, data) {
        return prisma.notification.create({
            data: {
                type: notification_types_1.notificationTypeToMagicNumber(type),
                body: data,
                sent_date: new Date(),
                user: {
                    connect: { id: userId },
                },
            },
        });
    }
    async sendPushNotificationToUser(userId, data) {
        const tokens = await this.getUserTokens(userId);
        if (tokens.length === 0)
            throw new Error(`User with id ${userId} does not have any FCM token.`);
        await pMap(tokens, async (token) => {
            await push_to_token_1.sendPushNotificationToToken(token, data);
        });
    }
};
NotificationService = __decorate([
    common_1.Injectable()
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map