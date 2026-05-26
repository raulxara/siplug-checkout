"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCheckoutSessionByUniqueIdModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const checkout_sessions_module_1 = require("../../modules/checkout-sessions/checkout-sessions.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const security_module_1 = require("../../modules/security/security.module");
const get_checkout_session_by_unique_id_controller_1 = require("./get-checkout-session-by-unique-id.controller");
const get_checkout_session_by_unique_id_use_case_1 = require("./get-checkout-session-by-unique-id.use-case");
let GetCheckoutSessionByUniqueIdModule = class GetCheckoutSessionByUniqueIdModule {
};
exports.GetCheckoutSessionByUniqueIdModule = GetCheckoutSessionByUniqueIdModule;
exports.GetCheckoutSessionByUniqueIdModule = GetCheckoutSessionByUniqueIdModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offices_module_1.OfficesModule,
            checkout_sessions_module_1.CheckoutSessionsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [get_checkout_session_by_unique_id_controller_1.GetCheckoutSessionByUniqueIdController],
        providers: [get_checkout_session_by_unique_id_use_case_1.GetCheckoutSessionByUniqueIdUseCase],
        exports: [get_checkout_session_by_unique_id_use_case_1.GetCheckoutSessionByUniqueIdUseCase],
    })
], GetCheckoutSessionByUniqueIdModule);
//# sourceMappingURL=get-checkout-session-by-unique-id.module.js.map