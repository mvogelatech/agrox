"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let WebService = class WebService {
    async getFarmDataByUserId(userId) {
        return prisma.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                username: true,
                password: true,
                phone_number: true,
                email: true,
                active: true,
                creation_date: true,
                access_date: true,
                update_date: true,
                yellow_threshold: true,
                red_threshold: true,
                fcm_token: true,
                avatar: false,
                user_accepted_terms: { orderBy: { accepted_date: 'desc' } },
                user_accepted_privacy_policy: { orderBy: { accepted_date: 'desc' } },
                user_role: { include: { role: true } },
                notification: { orderBy: { sent_date: 'desc' } },
                many_user_has_many_farm: {
                    include: {
                        farm: {
                            include: {
                                imaging: { orderBy: { processing_timestamp: 'desc' } },
                                address: { include: { state: true } },
                                area: {
                                    include: {
                                        field: {
                                            include: {
                                                crop: {
                                                    include: {
                                                        diagnosis: {
                                                            include: {
                                                                prescription: { orderBy: { date: 'desc' } },
                                                                infestation: {
                                                                    select: {
                                                                        id: true,
                                                                        plague: true,
                                                                        area_ha: true,
                                                                    },
                                                                },
                                                            },
                                                            orderBy: { report_date: 'desc' },
                                                        },
                                                    },
                                                    orderBy: { sowing_date: 'desc' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async setUserAvatar(userId, image) {
        return prisma.user.update({
            data: {
                avatar: image,
            },
            where: {
                id: userId,
            },
        });
    }
    async getUserAvatar(userId) {
        var _a;
        const currentUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                avatar: true,
            },
        });
        return currentUser ? (_a = currentUser.avatar) !== null && _a !== void 0 ? _a : '' : '';
    }
    async getUnreadNotificationsCount(userId) {
        return prisma.notification.count({
            where: {
                user_id: userId,
                read_date: { equals: null },
            },
        });
    }
    async savePrescription(data) {
        const prescription = JSON.parse(data);
        const diag = await prisma.diagnosis.findUnique({
            where: { id: prescription.diagnosis_id },
        });
        try {
            if (diag) {
                await prisma.prescription.create({
                    data: {
                        date: new Date(),
                        content: prescription,
                        pulverization_method: prescription.recommended_method,
                        author: prescription.author,
                        phone_number: prescription.whatsapp,
                        diagnosis: { connect: { id: prescription.diagnosis_id } },
                    },
                });
            }
            else {
                console.log(`no diagnosis for id: ${prescription.diagnosis_id}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
WebService = __decorate([
    common_1.Injectable()
], WebService);
exports.WebService = WebService;
//# sourceMappingURL=web.service.js.map