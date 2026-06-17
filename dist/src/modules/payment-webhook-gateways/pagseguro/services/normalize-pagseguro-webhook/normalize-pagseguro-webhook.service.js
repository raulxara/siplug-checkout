"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizePagSeguroWebhookService = void 0;
const common_1 = require("@nestjs/common");
const normalized_payment_webhook_event_dto_1 = require("../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const normalize_pagseguro_webhook_dto_out_1 = require("./dtos/normalize-pagseguro-webhook.dto-out");
let NormalizePagSeguroWebhookService = class NormalizePagSeguroWebhookService {
    exec(dtoIn) {
        const orderId = this.getString(dtoIn.payload, 'id');
        const referenceId = this.getString(dtoIn.payload, 'reference_id');
        const charges = this.getObjectsArray(dtoIn.payload, 'charges');
        const primaryCharge = this.resolvePrimaryCharge(charges);
        const chargeId = this.getString(primaryCharge, 'id');
        const chargeStatus = this.getString(primaryCharge, 'status');
        const chargeReferenceId = this.getString(primaryCharge, 'reference_id');
        const orderStatus = this.getString(dtoIn.payload, 'status');
        const status = chargeStatus ?? orderStatus ?? 'UNKNOWN';
        const paymentMethod = this.getObject(primaryCharge, 'payment_method');
        const paymentMethodType = this.getString(paymentMethod, 'type');
        const gatewayTransactionId = this.resolveGatewayTransactionId({
            orderId,
            chargeId,
            payloadStatus: orderStatus,
            chargeStatus,
            paymentMethodType,
        });
        const eventId = this.resolveEventId({
            orderId,
            chargeId,
            status,
            referenceId: chargeReferenceId ?? referenceId,
            xProductId: this.getString(dtoIn.headers, 'x-product-id'),
        });
        const amount = this.resolveAmount(primaryCharge, dtoIn.payload);
        const currency = this.resolveCurrency(primaryCharge, dtoIn.payload);
        const normalizedEvent = new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: 'pagseguro',
            eventId,
            eventType: this.resolveEventType({ orderId, chargeId }),
            eventAction: this.resolveEventAction({ chargeId, status }),
            canonicalStatus: this.resolveCanonicalStatus(status),
            gatewayTransactionId,
            gatewayPaymentIntentId: orderId,
            gatewayChargeId: chargeId,
            gatewaySubscriptionId: null,
            gatewayInvoiceId: null,
            paymentTransactionId: null,
            checkoutSessionId: null,
            subscriptionId: null,
            subscriptionInvoiceId: null,
            externalReference: chargeReferenceId ?? referenceId,
            amount,
            currency,
            rawPayload: {
                pagseguro: dtoIn.payload,
            },
            headers: dtoIn.headers,
        });
        return new normalize_pagseguro_webhook_dto_out_1.NormalizePagSeguroWebhookDtoOut(normalizedEvent);
    }
    resolvePrimaryCharge(charges) {
        if (charges.length === 0) {
            return null;
        }
        const paidCharge = charges.find((charge) => this.getString(charge, 'status') === 'PAID');
        return paidCharge ?? charges[0];
    }
    resolveGatewayTransactionId(params) {
        const method = String(params.paymentMethodType ?? '').toUpperCase();
        if (method === 'PIX' && params.orderId !== null) {
            return params.orderId;
        }
        if (params.chargeId !== null) {
            return params.chargeId;
        }
        return params.orderId;
    }
    resolveEventId(params) {
        const base = params.xProductId ??
            params.chargeId ??
            params.orderId ??
            params.referenceId ??
            'unknown';
        return `${base}:${params.status}`;
    }
    resolveEventType(params) {
        if (params.chargeId !== null) {
            return 'charge';
        }
        if (params.orderId?.startsWith('CHEC_')) {
            return 'checkout';
        }
        return 'order';
    }
    resolveEventAction(params) {
        const status = params.status.toLowerCase();
        return params.chargeId !== null ? `charge.${status}` : `order.${status}`;
    }
    resolveCanonicalStatus(status) {
        const normalized = String(status ?? '').trim().toUpperCase();
        switch (normalized) {
            case 'PAID':
                return 'paid';
            case 'AUTHORIZED':
                return 'authorized';
            case 'WAITING':
            case 'IN_ANALYSIS':
            case 'ACTIVE':
            case 'CREATED':
                return 'pending';
            case 'CANCELED':
            case 'CANCELLED':
                return 'canceled';
            case 'DECLINED':
                return 'failed';
            case 'EXPIRED':
                return 'expired';
            case 'REFUNDED':
                return 'refunded';
            case 'CHARGEBACK':
                return 'chargeback';
            default:
                return 'ignored';
        }
    }
    resolveAmount(charge, payload) {
        const chargeAmount = this.getObject(charge, 'amount');
        const payloadAmount = this.getObject(payload, 'amount');
        return (this.getNumber(chargeAmount, 'value') ??
            this.getNumber(payloadAmount, 'value'));
    }
    resolveCurrency(charge, payload) {
        const chargeAmount = this.getObject(charge, 'amount');
        const payloadAmount = this.getObject(payload, 'amount');
        const currency = this.getString(chargeAmount, 'currency') ??
            this.getString(payloadAmount, 'currency');
        return currency ? currency.toUpperCase() : null;
    }
    getObjectsArray(object, key) {
        const value = object[key];
        if (!Array.isArray(value)) {
            return [];
        }
        return value.filter((item) => !!item && typeof item === 'object' && !Array.isArray(item));
    }
    getObject(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    getString(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    getNumber(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        return Number.isNaN(numberValue) ? null : numberValue;
    }
};
exports.NormalizePagSeguroWebhookService = NormalizePagSeguroWebhookService;
exports.NormalizePagSeguroWebhookService = NormalizePagSeguroWebhookService = __decorate([
    (0, common_1.Injectable)()
], NormalizePagSeguroWebhookService);
//# sourceMappingURL=normalize-pagseguro-webhook.service.js.map