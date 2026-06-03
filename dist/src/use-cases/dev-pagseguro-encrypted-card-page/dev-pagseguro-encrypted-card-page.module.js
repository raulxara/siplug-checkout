"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevPagSeguroEncryptedCardPageModule = void 0;
const common_1 = require("@nestjs/common");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const dev_pagseguro_encrypted_card_page_controller_1 = require("./dev-pagseguro-encrypted-card-page.controller");
const dev_pagseguro_encrypted_card_page_use_case_1 = require("./dev-pagseguro-encrypted-card-page.use-case");
let DevPagSeguroEncryptedCardPageModule = class DevPagSeguroEncryptedCardPageModule {
};
exports.DevPagSeguroEncryptedCardPageModule = DevPagSeguroEncryptedCardPageModule;
exports.DevPagSeguroEncryptedCardPageModule = DevPagSeguroEncryptedCardPageModule = __decorate([
    (0, common_1.Module)({
        imports: [api_credentials_module_1.ApiCredentialsModule],
        controllers: [dev_pagseguro_encrypted_card_page_controller_1.DevPagSeguroEncryptedCardPageController],
        providers: [dev_pagseguro_encrypted_card_page_use_case_1.DevPagSeguroEncryptedCardPageUseCase],
        exports: [dev_pagseguro_encrypted_card_page_use_case_1.DevPagSeguroEncryptedCardPageUseCase],
    })
], DevPagSeguroEncryptedCardPageModule);
//# sourceMappingURL=dev-pagseguro-encrypted-card-page.module.js.map