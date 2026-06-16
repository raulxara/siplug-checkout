"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentWebhookEventModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const payment_webhook_events_module_1 = require("../../modules/payment-webhook-events/payment-webhook-events.module");
const payment_splits_module_1 = require("../../modules/payment-splits/payment-splits.module");
const dispatch_payment_split_to_gateway_module_1 = require("../dispatch-payment-split-to-gateway/dispatch-payment-split-to-gateway.module");
const process_payment_webhook_event_use_case_1 = require("./process-payment-webhook-event.use-case");
let ProcessPaymentWebhookEventModule = class ProcessPaymentWebhookEventModule {
};
exports.ProcessPaymentWebhookEventModule = ProcessPaymentWebhookEventModule;
exports.ProcessPaymentWebhookEventModule = ProcessPaymentWebhookEventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            use_case_support_module_1.UseCaseSupportModule,
            payment_webhook_events_module_1.PaymentWebhookEventsModule,
            payment_transactions_module_1.PaymentTransactionsModule,
            payment_splits_module_1.PaymentSplitsModule,
            dispatch_payment_split_to_gateway_module_1.DispatchPaymentSplitToGatewayModule,
        ],
        providers: [process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase],
        exports: [process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase],
    })
], ProcessPaymentWebhookEventModule);
//# sourceMappingURL=process-payment-webhook-event.module.js.map