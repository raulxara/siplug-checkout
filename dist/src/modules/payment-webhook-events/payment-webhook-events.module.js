"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookEventsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const payment_webhook_events_repository_1 = require("./repositories/payment-webhook-events.repository");
const payment_webhook_events_tokens_1 = require("./tokens/payment-webhook-events.tokens");
const register_payment_webhook_event_service_1 = require("./services/register-payment-webhook-event/register-payment-webhook-event.service");
const mark_payment_webhook_event_as_processed_service_1 = require("./services/mark-payment-webhook-event-as-processed/mark-payment-webhook-event-as-processed.service");
const mark_payment_webhook_event_as_failed_service_1 = require("./services/mark-payment-webhook-event-as-failed/mark-payment-webhook-event-as-failed.service");
const mark_payment_webhook_event_as_processing_service_1 = require("./services/mark-payment-webhook-event-as-processing/mark-payment-webhook-event-as-processing.service");
let PaymentWebhookEventsModule = class PaymentWebhookEventsModule {
};
exports.PaymentWebhookEventsModule = PaymentWebhookEventsModule;
exports.PaymentWebhookEventsModule = PaymentWebhookEventsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            build_changes_history_service_1.BuildChangesHistoryService,
            {
                provide: payment_webhook_events_tokens_1.PAYMENT_WEBHOOK_EVENTS_REPOSITORY,
                useClass: payment_webhook_events_repository_1.PaymentWebhookEventsRepository,
            },
            register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
            mark_payment_webhook_event_as_processed_service_1.MarkPaymentWebhookEventAsProcessedService,
            mark_payment_webhook_event_as_failed_service_1.MarkPaymentWebhookEventAsFailedService,
            mark_payment_webhook_event_as_processing_service_1.MarkPaymentWebhookEventAsProcessingService,
        ],
        exports: [
            payment_webhook_events_tokens_1.PAYMENT_WEBHOOK_EVENTS_REPOSITORY,
            register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
            mark_payment_webhook_event_as_processed_service_1.MarkPaymentWebhookEventAsProcessedService,
            mark_payment_webhook_event_as_failed_service_1.MarkPaymentWebhookEventAsFailedService,
            mark_payment_webhook_event_as_processing_service_1.MarkPaymentWebhookEventAsProcessingService,
        ],
    })
], PaymentWebhookEventsModule);
//# sourceMappingURL=payment-webhook-events.module.js.map