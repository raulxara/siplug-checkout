"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCheckoutSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const checkout_sessions_module_1 = require("../../modules/checkout-sessions/checkout-sessions.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const security_module_1 = require("../../modules/security/security.module");
const list_checkout_sessions_controller_1 = require("./list-checkout-sessions.controller");
const list_checkout_sessions_use_case_1 = require("./list-checkout-sessions.use-case");
let ListCheckoutSessionsModule = class ListCheckoutSessionsModule {
};
exports.ListCheckoutSessionsModule = ListCheckoutSessionsModule;
exports.ListCheckoutSessionsModule = ListCheckoutSessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offices_module_1.OfficesModule,
            checkout_sessions_module_1.CheckoutSessionsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [list_checkout_sessions_controller_1.ListCheckoutSessionsController],
        providers: [list_checkout_sessions_use_case_1.ListCheckoutSessionsUseCase],
        exports: [list_checkout_sessions_use_case_1.ListCheckoutSessionsUseCase],
    })
], ListCheckoutSessionsModule);
//# sourceMappingURL=list-checkout-sessions.module.js.map