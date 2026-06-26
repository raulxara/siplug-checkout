"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeMercadoPagoWebhookService = void 0;
const common_1 = require("@nestjs/common");
const normalized_payment_webhook_event_dto_1 = require("../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const normalize_mercado_pago_webhook_dto_out_1 = require("./dtos/normalize-mercado-pago-webhook.dto-out");
let NormalizeMercadoPagoWebhookService = class NormalizeMercadoPagoWebhookService {
    exec(dtoIn) {
        if (dtoIn.preapproval !== null) {
            return new normalize_mercado_pago_webhook_dto_out_1.NormalizeMercadoPagoWebhookDtoOut(this.normalizePreapproval(dtoIn));
        }
        if (dtoIn.payment !== null) {
            return new normalize_mercado_pago_webhook_dto_out_1.NormalizeMercadoPagoWebhookDtoOut(this.normalizePayment(dtoIn));
        }
        throw new Error('Mercado Pago payment or preapproval is required');
    }
    normalizePayment(dtoIn) {
        const payment = dtoIn.payment;
        if (payment === null) {
            throw new Error('Mercado Pago payment is required');
        }
        const paymentId = this.getString(payment, 'id');
        if (paymentId === null) {
            throw new Error('Mercado Pago payment id is required');
        }
        const metadata = this.getObject(payment, 'metadata') ?? {};
        const payloadData = this.getObject(dtoIn.payload, 'data') ?? {};
        const payloadType = this.getString(dtoIn.payload, 'type') ??
            this.getString(dtoIn.queryParams, 'type') ??
            'payment';
        const action = this.getString(dtoIn.payload, 'action') ??
            this.getString(dtoIn.queryParams, 'action') ??
            `payment.${this.getString(payment, 'status') ?? 'updated'}`;
        const status = this.getString(payment, 'status');
        const gatewaySubscriptionId = this.resolvePaymentGatewaySubscriptionId(payment);
        const gatewayInvoiceId = this.resolvePaymentGatewayInvoiceId(payment);
        return new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: 'mercado_pago',
            eventId: this.getString(dtoIn.payload, 'id') ??
                this.getString(dtoIn.queryParams, 'id') ??
                this.getString(payloadData, 'id') ??
                `${payloadType}:${paymentId}:${action}:${status ?? 'unknown'}`,
            eventType: payloadType,
            eventAction: action,
            canonicalStatus: this.resolvePaymentCanonicalStatus(status),
            gatewayTransactionId: paymentId,
            gatewayPaymentIntentId: null,
            gatewayChargeId: null,
            gatewaySubscriptionId,
            gatewayInvoiceId,
            paymentTransactionId: this.getString(metadata, 'paymentTransactionId') ??
                this.getString(metadata, 'payment_transaction_id'),
            checkoutSessionId: this.getString(metadata, 'checkoutSessionId') ??
                this.getString(metadata, 'checkout_session_id'),
            subscriptionId: this.getString(metadata, 'subscriptionId') ??
                this.getString(metadata, 'subscription_id'),
            subscriptionInvoiceId: this.getString(metadata, 'subscriptionInvoiceId') ??
                this.getString(metadata, 'subscription_invoice_id'),
            externalReference: this.getString(payment, 'external_reference') ??
                this.getString(metadata, 'externalReference') ??
                this.getString(metadata, 'external_reference'),
            amount: this.resolveAmount(payment),
            currency: this.resolveCurrency(payment),
            rawPayload: {
                notification: dtoIn.payload,
                payment,
                queryParams: dtoIn.queryParams,
            },
            headers: dtoIn.headers,
        });
    }
    resolvePaymentGatewaySubscriptionId(payment) {
        const pointOfInteraction = this.getObject(payment, 'point_of_interaction');
        const transactionData = pointOfInteraction !== null
            ? this.getObject(pointOfInteraction, 'transaction_data')
            : null;
        return (this.getString(payment, 'preapproval_id') ??
            this.getString(payment, 'subscription_id') ??
            this.getString(transactionData, 'subscription_id'));
    }
    resolvePaymentGatewayInvoiceId(payment) {
        const pointOfInteraction = this.getObject(payment, 'point_of_interaction');
        const transactionData = pointOfInteraction !== null
            ? this.getObject(pointOfInteraction, 'transaction_data')
            : null;
        return (this.getString(payment, 'invoice_id') ??
            this.getString(payment, 'statement_descriptor') ??
            this.getString(transactionData, 'invoice_id') ??
            this.findPointOfInteractionReferenceId(payment, 'RECURRING_INVOICE'));
    }
    findPointOfInteractionReferenceId(payment, referenceType) {
        const pointOfInteraction = this.getObject(payment, 'point_of_interaction');
        if (pointOfInteraction === null) {
            return null;
        }
        const references = pointOfInteraction.references;
        if (!Array.isArray(references)) {
            return null;
        }
        for (const reference of references) {
            if (!reference || typeof reference !== 'object' || Array.isArray(reference)) {
                continue;
            }
            const referenceObject = reference;
            const type = this.getString(referenceObject, 'type');
            const id = this.getString(referenceObject, 'id');
            if (type === referenceType && id !== null) {
                return id;
            }
        }
        return null;
    }
    normalizePreapproval(dtoIn) {
        const preapproval = dtoIn.preapproval;
        if (preapproval === null) {
            throw new Error('Mercado Pago preapproval is required');
        }
        const preapprovalId = this.getString(preapproval, 'id');
        if (preapprovalId === null) {
            throw new Error('Mercado Pago preapproval id is required');
        }
        const metadata = this.getObject(preapproval, 'metadata') ?? {};
        const autoRecurring = this.getObject(preapproval, 'auto_recurring') ?? {};
        const payloadData = this.getObject(dtoIn.payload, 'data') ?? {};
        const payloadType = this.getString(dtoIn.payload, 'type') ??
            this.getString(dtoIn.queryParams, 'type') ??
            'preapproval';
        const status = this.getString(preapproval, 'status');
        const action = this.getString(dtoIn.payload, 'action') ??
            this.getString(dtoIn.queryParams, 'action') ??
            `preapproval.${status ?? 'updated'}`;
        return new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: 'mercado_pago',
            eventId: this.getString(dtoIn.payload, 'id') ??
                this.getString(dtoIn.queryParams, 'id') ??
                this.getString(payloadData, 'id') ??
                `${payloadType}:${preapprovalId}:${action}:${status ?? 'unknown'}`,
            eventType: payloadType,
            eventAction: action,
            canonicalStatus: this.resolvePreapprovalCanonicalStatus(status),
            gatewayTransactionId: preapprovalId,
            gatewayPaymentIntentId: null,
            gatewayChargeId: null,
            gatewaySubscriptionId: preapprovalId,
            gatewayInvoiceId: null,
            paymentTransactionId: this.getString(metadata, 'paymentTransactionId') ??
                this.getString(metadata, 'payment_transaction_id'),
            checkoutSessionId: this.getString(metadata, 'checkoutSessionId') ??
                this.getString(metadata, 'checkout_session_id'),
            subscriptionId: this.getString(metadata, 'subscriptionId') ??
                this.getString(metadata, 'subscription_id'),
            subscriptionInvoiceId: this.getString(metadata, 'subscriptionInvoiceId') ??
                this.getString(metadata, 'subscription_invoice_id'),
            externalReference: this.getString(preapproval, 'external_reference') ??
                this.getString(metadata, 'externalReference') ??
                this.getString(metadata, 'external_reference'),
            amount: this.resolveAmount(autoRecurring),
            currency: this.resolveCurrency(autoRecurring),
            rawPayload: {
                notification: dtoIn.payload,
                preapproval,
                queryParams: dtoIn.queryParams,
            },
            headers: dtoIn.headers,
        });
    }
    resolvePaymentCanonicalStatus(status) {
        switch (status) {
            case 'approved':
                return 'paid';
            case 'authorized':
                return 'authorized';
            case 'pending':
            case 'in_process':
                return 'pending';
            case 'rejected':
                return 'failed';
            case 'cancelled':
            case 'canceled':
                return 'canceled';
            case 'refunded':
                return 'refunded';
            case 'charged_back':
                return 'chargeback';
            default:
                return 'ignored';
        }
    }
    resolvePreapprovalCanonicalStatus(status) {
        switch (status) {
            case 'authorized':
                return 'subscription_active';
            case 'pending':
                return 'pending';
            case 'paused':
                return 'pending';
            case 'cancelled':
            case 'canceled':
                return 'subscription_canceled';
            default:
                return 'ignored';
        }
    }
    resolveAmount(object) {
        const value = this.getNumber(object, 'transaction_amount') ??
            this.getNumber(object, 'total_paid_amount');
        if (value === null) {
            return null;
        }
        return Math.round(value * 100);
    }
    resolveCurrency(object) {
        const currency = this.getString(object, 'currency_id') ??
            this.getString(object, 'currency');
        return currency ? currency.toUpperCase() : null;
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
        const value = object[key];
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        return Number.isNaN(numberValue) ? null : numberValue;
    }
};
exports.NormalizeMercadoPagoWebhookService = NormalizeMercadoPagoWebhookService;
exports.NormalizeMercadoPagoWebhookService = NormalizeMercadoPagoWebhookService = __decorate([
    (0, common_1.Injectable)()
], NormalizeMercadoPagoWebhookService);
//# sourceMappingURL=normalize-mercado-pago-webhook.service.js.map