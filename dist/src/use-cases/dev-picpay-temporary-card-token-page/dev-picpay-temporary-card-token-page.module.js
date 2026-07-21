"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevPicPayTemporaryCardTokenPageModule = void 0;
const common_1 = require("@nestjs/common");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const dev_picpay_temporary_card_token_page_controller_1 = require("./dev-picpay-temporary-card-token-page.controller");
const dev_picpay_temporary_card_token_page_use_case_1 = require("./dev-picpay-temporary-card-token-page.use-case");
let DevPicPayTemporaryCardTokenPageModule = class DevPicPayTemporaryCardTokenPageModule {
};
exports.DevPicPayTemporaryCardTokenPageModule = DevPicPayTemporaryCardTokenPageModule;
exports.DevPicPayTemporaryCardTokenPageModule = DevPicPayTemporaryCardTokenPageModule = __decorate([
    (0, common_1.Module)({
        imports: [api_credentials_module_1.ApiCredentialsModule],
        controllers: [dev_picpay_temporary_card_token_page_controller_1.DevPicPayTemporaryCardTokenPageController],
        providers: [dev_picpay_temporary_card_token_page_use_case_1.DevPicPayTemporaryCardTokenPageUseCase],
        exports: [dev_picpay_temporary_card_token_page_use_case_1.DevPicPayTemporaryCardTokenPageUseCase],
    })
], DevPicPayTemporaryCardTokenPageModule);
//# sourceMappingURL=dev-picpay-temporary-card-token-page.module.js.map