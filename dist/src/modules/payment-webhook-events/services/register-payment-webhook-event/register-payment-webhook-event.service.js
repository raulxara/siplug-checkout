"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPaymentWebhookEventService = void 0;
const common_1 = require("@nestjs/common");
const payment_webhook_event_entity_1 = require("../../entities/payment-webhook-event.entity");
const payment_webhook_events_tokens_1 = require("../../tokens/payment-webhook-events.tokens");
const register_payment_webhook_event_dto_out_1 = require("./dtos/register-payment-webhook-event.dto-out");
let RegisterPaymentWebhookEventService = class RegisterPaymentWebhookEventService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        const current = await this.repository.findByProviderAndEventId({
            provider: dtoIn.provider,
            eventId: dtoIn.eventId,
        });
        if (current !== null) {
            return new register_payment_webhook_event_dto_out_1.RegisterPaymentWebhookEventDtoOut(current, true);
        }
        const entity = new payment_webhook_event_entity_1.PaymentWebhookEventEntity(this.repository, {
            provider: dtoIn.provider,
            eventId: dtoIn.eventId,
            eventType: dtoIn.eventType,
            eventAction: dtoIn.eventAction,
            canonicalStatus: dtoIn.canonicalStatus,
            gatewayTransactionId: dtoIn.gatewayTransactionId,
            gatewayPaymentIntentId: dtoIn.gatewayPaymentIntentId,
            gatewayChargeId: dtoIn.gatewayChargeId,
            gatewaySubscriptionId: dtoIn.gatewaySubscriptionId,
            gatewayInvoiceId: dtoIn.gatewayInvoiceId,
            paymentTransactionId: dtoIn.paymentTransactionId,
            checkoutSessionId: dtoIn.checkoutSessionId,
            subscriptionId: dtoIn.subscriptionId,
            subscriptionInvoiceId: dtoIn.subscriptionInvoiceId,
            externalReference: dtoIn.externalReference,
            amount: dtoIn.amount,
            currency: dtoIn.currency,
            headers: dtoIn.headers,
            payload: dtoIn.payload,
            normalizedPayload: dtoIn.normalizedPayload,
            processingResult: null,
            errorMessage: null,
            receivedAt: new Date().toISOString(),
            processedAt: null,
            metadata: dtoIn.metadata,
            config: dtoIn.config,
            changesHistory: [
                {
                    action: 'created',
                    source: 'RegisterPaymentWebhookEventService',
                    createdAt: new Date().toISOString(),
                },
            ],
            status: 'received',
        });
        const created = await entity.create();
        return new register_payment_webhook_event_dto_out_1.RegisterPaymentWebhookEventDtoOut(created, false);
    }
};
exports.RegisterPaymentWebhookEventService = RegisterPaymentWebhookEventService;
exports.RegisterPaymentWebhookEventService = RegisterPaymentWebhookEventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_webhook_events_tokens_1.PAYMENT_WEBHOOK_EVENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], RegisterPaymentWebhookEventService);
//# sourceMappingURL=register-payment-webhook-event.service.js.map