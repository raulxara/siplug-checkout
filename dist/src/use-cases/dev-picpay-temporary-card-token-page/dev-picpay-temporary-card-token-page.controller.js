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
exports.DevPicPayTemporaryCardTokenPageController = void 0;
const common_1 = require("@nestjs/common");
const dev_picpay_temporary_card_token_page_dto_in_1 = require("./dtos/dev-picpay-temporary-card-token-page.dto-in");
const dev_picpay_temporary_card_token_page_use_case_1 = require("./dev-picpay-temporary-card-token-page.use-case");
let DevPicPayTemporaryCardTokenPageController = class DevPicPayTemporaryCardTokenPageController {
    devPicPayTemporaryCardTokenPageUseCase;
    constructor(devPicPayTemporaryCardTokenPageUseCase) {
        this.devPicPayTemporaryCardTokenPageUseCase = devPicPayTemporaryCardTokenPageUseCase;
    }
    async page(apiCredentialId, response) {
        const dtoOut = await this.devPicPayTemporaryCardTokenPageUseCase.exec(new dev_picpay_temporary_card_token_page_dto_in_1.DevPicPayTemporaryCardTokenPageDtoIn({
            apiCredentialId,
        }));
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(dtoOut.html);
    }
};
exports.DevPicPayTemporaryCardTokenPageController = DevPicPayTemporaryCardTokenPageController;
__decorate([
    (0, common_1.Get)('temporary-card-token-page/:apiCredentialId'),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevPicPayTemporaryCardTokenPageController.prototype, "page", null);
exports.DevPicPayTemporaryCardTokenPageController = DevPicPayTemporaryCardTokenPageController = __decorate([
    (0, common_1.Controller)('dev/picpay'),
    __metadata("design:paramtypes", [dev_picpay_temporary_card_token_page_use_case_1.DevPicPayTemporaryCardTokenPageUseCase])
], DevPicPayTemporaryCardTokenPageController);
//# sourceMappingURL=dev-picpay-temporary-card-token-page.controller.js.map