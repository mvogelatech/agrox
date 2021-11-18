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
exports.UserDataController = void 0;
const common_1 = require("@nestjs/common");
const userdata_service_1 = require("./userdata.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let UserDataController = class UserDataController {
    constructor(userDataService) {
        this.userDataService = userDataService;
    }
    async getFarmDataByUserId(user_id) {
        const userId = Number.parseInt(user_id, 10);
        const data = await this.userDataService.getFarmDataByUserId(userId);
        return JSON.stringify(data, undefined, '\t');
    }
    async getUnreadNotificationsCount(user_id) {
        const userId = Number.parseInt(user_id, 10);
        const data = await this.userDataService.getUnreadNotificationsCount(userId);
        return data.toString();
    }
    uploadUserAvatar(user_id, image) {
        const b64string = image.buffer.toString(`base64`);
        void this.userDataService.setUserAvatar(Number.parseInt(user_id, 10), b64string);
    }
    async downloadUserAvatar(user_id, res) {
        const base64Img = await this.userDataService.getUserAvatar(Number.parseInt(user_id, 10));
        res.type('json').send({ image: base64Img });
    }
};
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "getFarmDataByUserId", null);
__decorate([
    common_1.Get(':id/unread-notification-count'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "getUnreadNotificationsCount", null);
__decorate([
    common_1.Post(':id/avatar'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('image')),
    __param(0, common_1.Param('id')),
    __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserDataController.prototype, "uploadUserAvatar", null);
__decorate([
    common_1.Get('avatar/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "downloadUserAvatar", null);
UserDataController = __decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('userdata'),
    __metadata("design:paramtypes", [userdata_service_1.UserDataService])
], UserDataController);
exports.UserDataController = UserDataController;
//# sourceMappingURL=userdata.controller.js.map