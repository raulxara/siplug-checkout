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
exports.DevPagSeguroEncryptedCardPageController = void 0;
const common_1 = require("@nestjs/common");
const dev_pagseguro_encrypted_card_page_dto_in_1 = require("./dtos/dev-pagseguro-encrypted-card-page.dto-in");
const dev_pagseguro_encrypted_card_page_use_case_1 = require("./dev-pagseguro-encrypted-card-page.use-case");
let DevPagSeguroEncryptedCardPageController = class DevPagSeguroEncryptedCardPageController {
    devPagSeguroEncryptedCardPageUseCase;
    constructor(devPagSeguroEncryptedCardPageUseCase) {
        this.devPagSeguroEncryptedCardPageUseCase = devPagSeguroEncryptedCardPageUseCase;
    }
    async page(apiCredentialId, response) {
        const dtoOut = await this.devPagSeguroEncryptedCardPageUseCase.exec(new dev_pagseguro_encrypted_card_page_dto_in_1.DevPagSeguroEncryptedCardPageDtoIn({
            apiCredentialId,
        }));
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(dtoOut.html);
    }
};
exports.DevPagSeguroEncryptedCardPageController = DevPagSeguroEncryptedCardPageController;
__decorate([
    (0, common_1.Get)('encrypted-card-page/:apiCredentialId'),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevPagSeguroEncryptedCardPageController.prototype, "page", null);
exports.DevPagSeguroEncryptedCardPageController = DevPagSeguroEncryptedCardPageController = __decorate([
    (0, common_1.Controller)('dev/pagseguro'),
    __metadata("design:paramtypes", [dev_pagseguro_encrypted_card_page_use_case_1.DevPagSeguroEncryptedCardPageUseCase])
], DevPagSeguroEncryptedCardPageController);
//# sourceMappingURL=dev-pagseguro-encrypted-card-page.controller.js.map