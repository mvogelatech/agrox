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
exports.PlagueController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const plague_service_1 = require("./plague.service");
let PlagueController = class PlagueController {
    constructor(plagueService) {
        this.plagueService = plagueService;
    }
    async getPlagues() {
        const plagues = await this.plagueService.getPlagues();
        return JSON.stringify(plagues, undefined, '\t');
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlagueController.prototype, "getPlagues", null);
PlagueController = __decorate([
    common_1.Controller('plague'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [plague_service_1.PlagueService])
], PlagueController);
exports.PlagueController = PlagueController;
//# sourceMappingURL=plague.controller.js.map