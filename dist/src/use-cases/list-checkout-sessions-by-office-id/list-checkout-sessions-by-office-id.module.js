"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCheckoutSessionsByOfficeIdModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const checkout_sessions_module_1 = require("../../modules/checkout-sessions/checkout-sessions.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const security_module_1 = require("../../modules/security/security.module");
const list_checkout_sessions_by_office_id_controller_1 = require("./list-checkout-sessions-by-office-id.controller");
const list_checkout_sessions_by_office_id_use_case_1 = require("./list-checkout-sessions-by-office-id.use-case");
let ListCheckoutSessionsByOfficeIdModule = class ListCheckoutSessionsByOfficeIdModule {
};
exports.ListCheckoutSessionsByOfficeIdModule = ListCheckoutSessionsByOfficeIdModule;
exports.ListCheckoutSessionsByOfficeIdModule = ListCheckoutSessionsByOfficeIdModule = __decorate([
    (0, common_1.Module)({
        imports: [
            checkout_sessions_module_1.CheckoutSessionsModule,
            offices_module_1.OfficesModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [list_checkout_sessions_by_office_id_controller_1.ListCheckoutSessionsByOfficeIdController],
        providers: [list_checkout_sessions_by_office_id_use_case_1.ListCheckoutSessionsByOfficeIdUseCase],
        exports: [list_checkout_sessions_by_office_id_use_case_1.ListCheckoutSessionsByOfficeIdUseCase],
    })
], ListCheckoutSessionsByOfficeIdModule);
//# sourceMappingURL=list-checkout-sessions-by-office-id.module.js.map