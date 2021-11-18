"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let DiagnosticService = class DiagnosticService {
    async getMails() {
        const mail = await prisma.email.findMany();
        return mail.map((mail) => mail.email);
    }
    async getMessageData(id, quotationPackage) {
        var _a;
        console.log('teste', quotationPackage.fields);
        const message = [];
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            throw new Error(`Unable to find user with id '${id}'`);
        message.push(this.rightPadStringWithDashes('\n\n\nDados do Produtor', 120));
        message.push(`Nome: ${user.first_name} ${user.last_name}`);
        message.push(`Celular: ${user.phone_number}`);
        message.push(`Email: ${(_a = user.email) !== null && _a !== void 0 ? _a : '-'}`);
        message.push(`DADOS DO PEDIDO  -------------------------`);
        message.push(`Áreas: ${[...new Set(quotationPackage.fields.flatMap((field) => field.area_id))].slice().sort(undefined).join(', ')}`);
        message.push(`Talhão: ${[...new Set(quotationPackage.fields.flatMap((field) => field.name.split(' ')[1]))].slice().sort(undefined).join(', ')}`);
        return message.join('\n');
    }
    rightPadStringWithDashes(string, length) {
        const lastLineSize = string.replace(/[\s\S]*\n/, '').length;
        if (lastLineSize >= length)
            return string;
        return `${string} ${'-'.repeat(length - 1 - lastLineSize)}`;
    }
};
DiagnosticService = __decorate([
    common_1.Injectable()
], DiagnosticService);
exports.DiagnosticService = DiagnosticService;
//# sourceMappingURL=diagnostic.service.js.map