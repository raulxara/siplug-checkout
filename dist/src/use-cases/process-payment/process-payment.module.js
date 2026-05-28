"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const checkout_sessions_module_1 = require("../../modules/checkout-sessions/checkout-sessions.module");
const clients_module_1 = require("../../modules/clients/clients.module");
const gateway_orchestration_module_1 = require("../../modules/gateway-orchestration/gateway-orchestration.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const payment_customers_module_1 = require("../../modules/payment-customers/payment-customers.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const security_module_1 = require("../../modules/security/security.module");
const process_payment_controller_1 = require("./process-payment.controller");
const process_payment_use_case_1 = require("./process-payment.use-case");
let ProcessPaymentModule = class ProcessPaymentModule {
};
exports.ProcessPaymentModule = ProcessPaymentModule;
exports.ProcessPaymentModule = ProcessPaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offices_module_1.OfficesModule,
            clients_module_1.ClientsModule,
            payment_customers_module_1.PaymentCustomersModule,
            checkout_sessions_module_1.CheckoutSessionsModule,
            payment_transactions_module_1.PaymentTransactionsModule,
            gateway_orchestration_module_1.GatewayOrchestrationModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [process_payment_controller_1.ProcessPaymentController],
        providers: [process_payment_use_case_1.ProcessPaymentUseCase],
        exports: [process_payment_use_case_1.ProcessPaymentUseCase],
    })
], ProcessPaymentModule);
//# sourceMappingURL=process-payment.module.js.map