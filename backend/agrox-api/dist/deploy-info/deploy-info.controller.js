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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployInfoController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function dbConnectionOk() {
    try {
        await prisma.$queryRaw('SELECT 1+1 as result;');
        return true;
    }
    catch (_a) {
        return false;
    }
}
let DeployInfoController = class DeployInfoController {
    async deployInfo() {
        var _a;
        const dbOk = await dbConnectionOk();
        const info = '___AGROX_DEPLOY_INFO_HERE___';
        return `${info} | ${(_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'NODE_ENV not set!'} | DB connection ${dbOk ? 'OK' : 'NOT OK'}`;
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeployInfoController.prototype, "deployInfo", null);
DeployInfoController = __decorate([
    common_1.Controller('deploy-info')
], DeployInfoController);
exports.DeployInfoController = DeployInfoController;
//# sourceMappingURL=deploy-info.controller.js.map