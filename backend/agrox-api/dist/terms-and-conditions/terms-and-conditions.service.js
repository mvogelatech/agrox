"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let TermsAndConditionsService = class TermsAndConditionsService {
    async getTermsAndConditions() {
        return prisma.terms_and_conditions.findMany({
            orderBy: { publish_date: 'desc' },
        });
    }
    async getUserAcceptedTerms(id) {
        return prisma.user_accepted_terms.findUnique({
            where: { id },
        });
    }
    async createUserAcceptedTerms(userId, termsId) {
        const acceptedTerms = await prisma.user_accepted_terms.create({
            data: {
                terms_and_conditions: { connect: { id: termsId } },
                user: { connect: { id: userId } },
                accepted_date: new Date(),
            },
        });
        return this.getUserAcceptedTerms(acceptedTerms.id);
    }
};
TermsAndConditionsService = __decorate([
    common_1.Injectable()
], TermsAndConditionsService);
exports.TermsAndConditionsService = TermsAndConditionsService;
//# sourceMappingURL=terms-and-conditions.service.js.map