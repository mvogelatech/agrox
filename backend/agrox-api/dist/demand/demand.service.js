"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let DemandService = class DemandService {
    async getFarmDataByUserId(data) {
        const diag = await prisma.field.findUnique({
            where: { id: Number(data) },
        });
        console.log('aqui', diag === null || diag === void 0 ? void 0 : diag.event);
        return diag === null || diag === void 0 ? void 0 : diag.event;
    }
    async saveDemand(data) {
        const diag = await prisma.area.findUnique({
            where: { id: data.id },
        });
        const teste = diag === null || diag === void 0 ? void 0 : diag.demand;
        let aux = JSON.parse(teste);
        if (aux === null) {
            aux = [];
            aux.push(data.demand);
        }
        else {
            aux.push(data.demand);
        }
        try {
            if (diag) {
                await prisma.area.update({
                    where: {
                        id: data.id,
                    },
                    data: {
                        demand: JSON.stringify(aux),
                    },
                });
            }
            else {
                console.log(`no demand for id: ${data.id}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
DemandService = __decorate([
    common_1.Injectable()
], DemandService);
exports.DemandService = DemandService;
//# sourceMappingURL=demand.service.js.map