"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateUserAccessCodeService = void 0;
const common_1 = require("@nestjs/common");
let GenerateUserAccessCodeService = class GenerateUserAccessCodeService {
    exec(length = 6) {
        const normalizedLength = length > 0 ? length : 6;
        const min = 10 ** (normalizedLength - 1);
        const max = 10 ** normalizedLength - 1;
        return String(Math.floor(min + Math.random() * (max - min + 1)));
    }
};
exports.GenerateUserAccessCodeService = GenerateUserAccessCodeService;
exports.GenerateUserAccessCodeService = GenerateUserAccessCodeService = __decorate([
    (0, common_1.Injectable)()
], GenerateUserAccessCodeService);
//# sourceMappingURL=generate-user-access-code.service.js.map