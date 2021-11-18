"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyPolicyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let PrivacyPolicyService = class PrivacyPolicyService {
    async getPrivacyPolicy() {
        return prisma.privacy_policy.findMany({
            orderBy: { publish_date: 'desc' },
        });
    }
    async getUserAcceptedPrivacyPolicy(id) {
        return prisma.user_accepted_privacy_policy.findUnique({
            where: { id },
        });
    }
    async createUserAcceptedPrivacyPolicy(userId, privacyPolicyId) {
        const acceptedTerms = await prisma.user_accepted_privacy_policy.create({
            data: {
                privacy_policy: { connect: { id: privacyPolicyId } },
                user: { connect: { id: userId } },
                accepted_date: new Date(),
            },
        });
        return this.getUserAcceptedPrivacyPolicy(acceptedTerms.id);
    }
};
PrivacyPolicyService = __decorate([
    common_1.Injectable()
], PrivacyPolicyService);
exports.PrivacyPolicyService = PrivacyPolicyService;
//# sourceMappingURL=privacy-policy.service.js.map