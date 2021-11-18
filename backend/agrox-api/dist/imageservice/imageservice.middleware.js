"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageServiceMiddleware = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
let ImageServiceMiddleware = class ImageServiceMiddleware {
    use(req, res, next) {
        if (req.path.includes('images')) {
            res.sendFile(path_1.join(process.cwd(), req.path));
        }
        else {
            return next();
        }
    }
};
ImageServiceMiddleware = __decorate([
    common_1.Injectable()
], ImageServiceMiddleware);
exports.ImageServiceMiddleware = ImageServiceMiddleware;
//# sourceMappingURL=imageservice.middleware.js.map