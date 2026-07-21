"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCheckoutSessionModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const checkout_sessions_module_1 = require("../../modules/checkout-sessions/checkout-sessions.module");
const clients_module_1 = require("../../modules/clients/clients.module");
const gateways_module_1 = require("../../modules/gateways/gateways.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const payment_customers_module_1 = require("../../modules/payment-customers/payment-customers.module");
const security_module_1 = require("../../modules/security/security.module");
const register_checkout_session_controller_1 = require("./register-checkout-session.controller");
const register_checkout_session_use_case_1 = require("./register-checkout-session.use-case");
let RegisterCheckoutSessionModule = class RegisterCheckoutSessionModule {
};
exports.RegisterCheckoutSessionModule = RegisterCheckoutSessionModule;
exports.RegisterCheckoutSessionModule = RegisterCheckoutSessionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offices_module_1.OfficesModule,
            clients_module_1.ClientsModule,
            payment_customers_module_1.PaymentCustomersModule,
            gateways_module_1.GatewaysModule,
            api_credentials_module_1.ApiCredentialsModule,
            checkout_sessions_module_1.CheckoutSessionsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [register_checkout_session_controller_1.RegisterCheckoutSessionController],
        providers: [register_checkout_session_use_case_1.RegisterCheckoutSessionUseCase],
        exports: [register_checkout_session_use_case_1.RegisterCheckoutSessionUseCase],
    })
], RegisterCheckoutSessionModule);
//# sourceMappingURL=register-checkout-session.module.js.map