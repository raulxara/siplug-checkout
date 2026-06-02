"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPaymentTransactionStatusModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const checkout_sessions_module_1 = require("../../modules/checkout-sessions/checkout-sessions.module");
const gateway_orchestration_module_1 = require("../../modules/gateway-orchestration/gateway-orchestration.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const security_module_1 = require("../../modules/security/security.module");
const sync_payment_transaction_status_controller_1 = require("./sync-payment-transaction-status.controller");
const sync_payment_transaction_status_use_case_1 = require("./sync-payment-transaction-status.use-case");
let SyncPaymentTransactionStatusModule = class SyncPaymentTransactionStatusModule {
};
exports.SyncPaymentTransactionStatusModule = SyncPaymentTransactionStatusModule;
exports.SyncPaymentTransactionStatusModule = SyncPaymentTransactionStatusModule = __decorate([
    (0, common_1.Module)({
        imports: [
            payment_transactions_module_1.PaymentTransactionsModule,
            checkout_sessions_module_1.CheckoutSessionsModule,
            gateway_orchestration_module_1.GatewayOrchestrationModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [sync_payment_transaction_status_controller_1.SyncPaymentTransactionStatusController],
        providers: [sync_payment_transaction_status_use_case_1.SyncPaymentTransactionStatusUseCase],
        exports: [sync_payment_transaction_status_use_case_1.SyncPaymentTransactionStatusUseCase],
    })
], SyncPaymentTransactionStatusModule);
//# sourceMappingURL=sync-payment-transaction-status.module.js.map