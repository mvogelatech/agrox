"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let RecordService = class RecordService {
    async getFarmDataByUserId(data) {
        const diag = await prisma.field.findUnique({
            where: { id: Number(data) },
        });
        console.log('aqui', diag === null || diag === void 0 ? void 0 : diag.event);
        return diag === null || diag === void 0 ? void 0 : diag.event;
    }
    async saveRecord(data) {
        const diag = await prisma.field.findUnique({
            where: { id: data.id },
        });
        console.log(diag === null || diag === void 0 ? void 0 : diag.event);
        const teste = diag === null || diag === void 0 ? void 0 : diag.event;
        let aux = JSON.parse(teste);
        if (aux === null) {
            aux = [];
            aux.push(data.record);
        }
        else {
            aux.push(data.record);
        }
        try {
            if (diag) {
                await prisma.field.update({
                    where: {
                        id: data.id,
                    },
                    data: {
                        event: JSON.stringify(aux),
                    },
                });
            }
            else {
                console.log(`no record for id: ${data.id}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
RecordService = __decorate([
    common_1.Injectable()
], RecordService);
exports.RecordService = RecordService;
//# sourceMappingURL=record.service.js.map