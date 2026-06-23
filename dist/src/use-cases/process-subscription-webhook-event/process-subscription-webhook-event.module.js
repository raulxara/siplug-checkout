"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessSubscriptionWebhookEventModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const payment_webhook_events_module_1 = require("../../modules/payment-webhook-events/payment-webhook-events.module");
const subscription_cycles_module_1 = require("../../modules/subscription-cycles/subscription-cycles.module");
const subscription_invoices_module_1 = require("../../modules/subscription-invoices/subscription-invoices.module");
const subscriptions_module_1 = require("../../modules/subscriptions/subscriptions.module");
const process_subscription_webhook_event_use_case_1 = require("./process-subscription-webhook-event.use-case");
let ProcessSubscriptionWebhookEventModule = class ProcessSubscriptionWebhookEventModule {
};
exports.ProcessSubscriptionWebhookEventModule = ProcessSubscriptionWebhookEventModule;
exports.ProcessSubscriptionWebhookEventModule = ProcessSubscriptionWebhookEventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            use_case_support_module_1.UseCaseSupportModule,
            payment_webhook_events_module_1.PaymentWebhookEventsModule,
            subscriptions_module_1.SubscriptionsModule,
            subscription_cycles_module_1.SubscriptionCyclesModule,
            subscription_invoices_module_1.SubscriptionInvoicesModule,
        ],
        providers: [
            build_changes_history_service_1.BuildChangesHistoryService,
            process_subscription_webhook_event_use_case_1.ProcessSubscriptionWebhookEventUseCase,
        ],
        exports: [process_subscription_webhook_event_use_case_1.ProcessSubscriptionWebhookEventUseCase],
    })
], ProcessSubscriptionWebhookEventModule);
//# sourceMappingURL=process-subscription-webhook-event.module.js.map