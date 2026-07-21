"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveInfinitePayWebhookModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const payment_webhook_gateways_module_1 = require("../../modules/payment-webhook-gateways/payment-webhook-gateways.module");
const payment_webhook_events_module_1 = require("../../modules/payment-webhook-events/payment-webhook-events.module");
const process_payment_webhook_event_module_1 = require("../process-payment-webhook-event/process-payment-webhook-event.module");
const receive_infinitepay_webhook_controller_1 = require("./receive-infinitepay-webhook.controller");
const receive_infinitepay_webhook_use_case_1 = require("./receive-infinitepay-webhook.use-case");
let ReceiveInfinitePayWebhookModule = class ReceiveInfinitePayWebhookModule {
};
exports.ReceiveInfinitePayWebhookModule = ReceiveInfinitePayWebhookModule;
exports.ReceiveInfinitePayWebhookModule = ReceiveInfinitePayWebhookModule = __decorate([
    (0, common_1.Module)({
        imports: [
            use_case_support_module_1.UseCaseSupportModule,
            payment_webhook_gateways_module_1.PaymentWebhookGatewaysModule,
            payment_webhook_events_module_1.PaymentWebhookEventsModule,
            payment_transactions_module_1.PaymentTransactionsModule,
            process_payment_webhook_event_module_1.ProcessPaymentWebhookEventModule,
        ],
        controllers: [receive_infinitepay_webhook_controller_1.ReceiveInfinitePayWebhookController],
        providers: [receive_infinitepay_webhook_use_case_1.ReceiveInfinitePayWebhookUseCase],
        exports: [receive_infinitepay_webhook_use_case_1.ReceiveInfinitePayWebhookUseCase],
    })
], ReceiveInfinitePayWebhookModule);
//# sourceMappingURL=receive-infinitepay-webhook.module.js.map