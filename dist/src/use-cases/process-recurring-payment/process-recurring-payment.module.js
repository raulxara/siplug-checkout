"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessRecurringPaymentModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const checkout_sessions_module_1 = require("../../modules/checkout-sessions/checkout-sessions.module");
const gateway_orchestration_module_1 = require("../../modules/gateway-orchestration/gateway-orchestration.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const security_module_1 = require("../../modules/security/security.module");
const subscription_cycles_module_1 = require("../../modules/subscription-cycles/subscription-cycles.module");
const subscription_invoices_module_1 = require("../../modules/subscription-invoices/subscription-invoices.module");
const subscription_plans_module_1 = require("../../modules/subscription-plans/subscription-plans.module");
const subscriptions_module_1 = require("../../modules/subscriptions/subscriptions.module");
const process_recurring_payment_controller_1 = require("./process-recurring-payment.controller");
const process_recurring_payment_use_case_1 = require("./process-recurring-payment.use-case");
const payment_customers_module_1 = require("../../modules/payment-customers/payment-customers.module");
const payment_split_recipients_module_1 = require("../../modules/payment-split-recipients/payment-split-recipients.module");
const payment_splits_module_1 = require("../../modules/payment-splits/payment-splits.module");
const split_calculations_module_1 = require("../../modules/split-calculations/split-calculations.module");
let ProcessRecurringPaymentModule = class ProcessRecurringPaymentModule {
};
exports.ProcessRecurringPaymentModule = ProcessRecurringPaymentModule;
exports.ProcessRecurringPaymentModule = ProcessRecurringPaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            checkout_sessions_module_1.CheckoutSessionsModule,
            payment_customers_module_1.PaymentCustomersModule,
            subscription_plans_module_1.SubscriptionPlansModule,
            subscriptions_module_1.SubscriptionsModule,
            subscription_cycles_module_1.SubscriptionCyclesModule,
            subscription_invoices_module_1.SubscriptionInvoicesModule,
            payment_transactions_module_1.PaymentTransactionsModule,
            payment_splits_module_1.PaymentSplitsModule,
            payment_split_recipients_module_1.PaymentSplitRecipientsModule,
            split_calculations_module_1.SplitCalculationsModule,
            gateway_orchestration_module_1.GatewayOrchestrationModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [process_recurring_payment_controller_1.ProcessRecurringPaymentController],
        providers: [process_recurring_payment_use_case_1.ProcessRecurringPaymentUseCase],
        exports: [process_recurring_payment_use_case_1.ProcessRecurringPaymentUseCase],
    })
], ProcessRecurringPaymentModule);
//# sourceMappingURL=process-recurring-payment.module.js.map