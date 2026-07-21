"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoRecurringPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const gateway_recurring_payment_dto_out_1 = require("../../dtos/gateway-recurring-payment.dto-out");
let MercadoPagoRecurringPaymentProvider = class MercadoPagoRecurringPaymentProvider {
    async createSubscription(dtoIn) {
        const requestPayload = this.buildPreapprovalRequest(dtoIn);
        const token = this.resolveProviderToken(dtoIn);
        const baseUrl = this.resolveBaseUrl(dtoIn);
        const response = await fetch(`${baseUrl}/preapproval`, {
            method: 'POST',
            headers: this.buildHeaders({
                token,
                idempotencyKey: dtoIn.idempotencyKey ?? dtoIn.paymentTransaction.idempotencyKey,
                dtoIn,
            }),
            body: JSON.stringify(requestPayload),
        });
        const responseBody = await this.parseJsonResponse(response, 'Mercado Pago returned a non JSON recurring subscription response');
        if (!response.ok) {
            return new gateway_recurring_payment_dto_out_1.GatewayRecurringPaymentDtoOut(false, 'mercadopago', null, requestPayload.preapproval_plan_id ?? null, null, null, this.toNullableString(responseBody.status) ?? String(response.status), 'failed', 'gateway_recurring_provider_failed', this.resolveMercadoPagoErrorMessage(responseBody, response.status), this.sanitizePayload(requestPayload), this.sanitizePayload(responseBody), {
                ok: false,
                provider: 'mercadopago',
                endpoint: '/preapproval',
                httpStatus: response.status,
            }, null, null);
        }
        const gatewaySubscriptionId = this.toNullableString(responseBody.id);
        const gatewayStatus = this.toNullableString(responseBody.status) ?? 'pending';
        const initPoint = this.toNullableString(responseBody.init_point) ??
            this.toNullableString(responseBody.sandbox_init_point);
        const mappedStatus = this.mapGatewayStatus(gatewayStatus);
        return new gateway_recurring_payment_dto_out_1.GatewayRecurringPaymentDtoOut(true, 'mercadopago', gatewaySubscriptionId, requestPayload.preapproval_plan_id ?? null, null, gatewaySubscriptionId, gatewayStatus, mappedStatus.status, mappedStatus.processStatus, mappedStatus.processMessage, this.sanitizePayload(requestPayload), this.sanitizePayload(responseBody), {
            ok: true,
            provider: 'mercadopago',
            endpoint: '/preapproval',
            httpStatus: response.status,
        }, initPoint, initPoint, null, null, null, null, gatewayStatus === 'authorized' ? this.nowAsIso() : null, null, null, null, dtoIn.paymentTransaction.expiresAt);
    }
    buildHeaders(params) {
        const headers = {
            Accept: 'application/json',
            Authorization: `Bearer ${params.token}`,
            'Content-Type': 'application/json',
        };
        if (params.idempotencyKey !== null && params.idempotencyKey.trim() !== '') {
            headers['X-Idempotency-Key'] = params.idempotencyKey;
        }
        return headers;
    }
    buildPreapprovalRequest(dtoIn) {
        const payer = this.asObject(dtoIn.providerPayload.payer);
        const paymentData = this.asObject(dtoIn.providerPayload.paymentData);
        const payerEmail = this.toRequiredString(payer.email, 'payer.email is required for Mercado Pago recurring payment');
        const paymentMethod = dtoIn.paymentTransaction.paymentMethod;
        const cardTokenId = this.toNullableString(paymentData.cardTokenId) ??
            this.toNullableString(paymentData.card_token_id) ??
            this.toNullableString(paymentData.cardToken) ??
            this.toNullableString(paymentData.card_token) ??
            this.toNullableString(paymentData.token);
        const shouldAuthorizeCreditCard = this.shouldAuthorizeCreditCard(dtoIn, cardTokenId);
        if (paymentMethod === 'credit_card' &&
            shouldAuthorizeCreditCard &&
            cardTokenId === null) {
            throw new Error('paymentData.cardTokenId is required for Mercado Pago recurring credit_card authorized payment');
        }
        const gatewayPlanId = this.resolveGatewayPlanId(dtoIn);
        const frequency = dtoIn.subscriptionPlan.billingIntervalCount;
        const frequencyType = this.mapFrequencyType(dtoIn.subscriptionPlan.billingInterval);
        const reason = this.toNullableString(dtoIn.subscriptionPlan.name) ??
            this.toNullableString(dtoIn.paymentTransaction.externalReference) ??
            `Assinatura ${dtoIn.subscription._id}`;
        const externalReference = dtoIn.subscription.externalReference ??
            dtoIn.paymentTransaction.externalReference ??
            dtoIn.subscription._id;
        const backUrl = this.toNullableString(this.asObject(dtoIn.providerPayload.checkoutSession).successUrl) ??
            this.resolveBackUrl(dtoIn) ??
            'https://siplug.com/payment/success';
        const startDate = this.resolveStartDate(dtoIn);
        const endDate = this.resolveEndDate(dtoIn);
        const request = {
            reason: this.limitText(reason, 255),
            external_reference: externalReference,
            payer_email: payerEmail,
            auto_recurring: {
                frequency,
                frequency_type: frequencyType,
                transaction_amount: this.centsToAmount(dtoIn.paymentTransaction.amount),
                currency_id: dtoIn.paymentTransaction.currency,
            },
            back_url: backUrl,
            status: this.shouldAuthorizeCreditCard(dtoIn, cardTokenId)
                ? 'authorized'
                : 'pending',
        };
        if (startDate !== null) {
            request.auto_recurring.start_date = startDate;
        }
        if (endDate !== null) {
            request.auto_recurring.end_date = endDate;
        }
        if (shouldAuthorizeCreditCard && cardTokenId !== null) {
            request.card_token_id = cardTokenId;
        }
        if (gatewayPlanId !== null) {
            request.preapproval_plan_id = gatewayPlanId;
        }
        return request;
    }
    resolveGatewayPlanId(dtoIn) {
        const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
        const gatewayMappings = this.asObject(planConfig.gatewayMappings);
        const mercadoPagoMapping = this.asObject(gatewayMappings.mercadopago).id !== undefined
            ? this.asObject(gatewayMappings.mercadopago)
            : this.asObject(gatewayMappings.mercado_pago);
        return (this.toNullableString(mercadoPagoMapping.gatewayPlanId) ??
            this.toNullableString(mercadoPagoMapping.preapprovalPlanId) ??
            this.toNullableString(mercadoPagoMapping.preapproval_plan_id) ??
            dtoIn.subscriptionPlan.gatewayPlanId);
    }
    shouldAuthorizeCreditCard(dtoIn, cardTokenId) {
        if (dtoIn.paymentTransaction.paymentMethod !== 'credit_card') {
            return false;
        }
        if (cardTokenId === null) {
            return false;
        }
        const transactionConfig = this.asObject(dtoIn.paymentTransaction.config);
        const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
        const subscriptionPlanConfig = this.asObject(dtoIn.subscriptionPlan.config);
        const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);
        const explicitlyDisabled = transactionConfig.allowTransparentCard === false ||
            apiCredentialConfig.allowTransparentCard === false ||
            subscriptionPlanConfig.allowTransparentCard === false ||
            gatewayConfig.allowTransparentCard === false;
        if (explicitlyDisabled) {
            return false;
        }
        return true;
    }
    resolveStartDate(dtoIn) {
        if (dtoIn.subscriptionPlan.trialDays !== null &&
            dtoIn.subscriptionPlan.trialDays > 0) {
            const date = new Date();
            date.setDate(date.getDate() + dtoIn.subscriptionPlan.trialDays);
            return date.toISOString();
        }
        const nextBillingAt = this.toNullableString(dtoIn.subscription.nextBillingAt);
        if (nextBillingAt === null) {
            return null;
        }
        const parsedNextBillingAt = new Date(nextBillingAt);
        if (Number.isNaN(parsedNextBillingAt.getTime())) {
            return null;
        }
        const minimumFutureDate = new Date();
        minimumFutureDate.setMinutes(minimumFutureDate.getMinutes() + 5);
        if (parsedNextBillingAt <= minimumFutureDate) {
            return null;
        }
        return parsedNextBillingAt.toISOString();
    }
    resolveEndDate(dtoIn) {
        if (dtoIn.subscriptionPlan.maxBillingCycles === null) {
            return null;
        }
        const startDate = this.resolveStartDate(dtoIn) ?? new Date().toISOString();
        const endDate = new Date(startDate);
        const intervalCount = dtoIn.subscriptionPlan.billingIntervalCount *
            dtoIn.subscriptionPlan.maxBillingCycles;
        if (dtoIn.subscriptionPlan.billingInterval === 'day') {
            endDate.setDate(endDate.getDate() + intervalCount);
            return endDate.toISOString();
        }
        if (dtoIn.subscriptionPlan.billingInterval === 'week') {
            endDate.setDate(endDate.getDate() + intervalCount * 7);
            return endDate.toISOString();
        }
        if (dtoIn.subscriptionPlan.billingInterval === 'month') {
            endDate.setMonth(endDate.getMonth() + intervalCount);
            return endDate.toISOString();
        }
        if (dtoIn.subscriptionPlan.billingInterval === 'year') {
            endDate.setFullYear(endDate.getFullYear() + intervalCount);
            return endDate.toISOString();
        }
        return null;
    }
    mapFrequencyType(interval) {
        if (interval === 'day') {
            return 'days';
        }
        if (interval === 'week') {
            return 'weeks';
        }
        if (interval === 'month') {
            return 'months';
        }
        if (interval === 'year') {
            return 'years';
        }
        throw new Error(`unsupported Mercado Pago recurring interval: ${interval}`);
    }
    mapGatewayStatus(gatewayStatus) {
        const normalized = gatewayStatus.toLowerCase().trim();
        if (normalized === 'authorized') {
            return {
                status: 'authorized',
                processStatus: 'gateway_recurring_subscription_authorized',
                processMessage: 'Mercado Pago recurring subscription authorized',
            };
        }
        if (normalized === 'pending') {
            return {
                status: 'pending',
                processStatus: 'gateway_recurring_subscription_pending',
                processMessage: 'Mercado Pago recurring subscription created and waiting buyer approval',
            };
        }
        if (normalized === 'paused') {
            return {
                status: 'pending',
                processStatus: 'gateway_recurring_subscription_paused',
                processMessage: 'Mercado Pago recurring subscription paused',
            };
        }
        if (normalized === 'cancelled' || normalized === 'canceled') {
            return {
                status: 'canceled',
                processStatus: 'gateway_recurring_subscription_canceled',
                processMessage: 'Mercado Pago recurring subscription canceled',
            };
        }
        return {
            status: 'pending',
            processStatus: 'gateway_recurring_subscription_created',
            processMessage: `Mercado Pago recurring subscription created with status ${gatewayStatus}`,
        };
    }
    resolveProviderToken(dtoIn) {
        const token = this.toNullableString(dtoIn.apiCredential.token) ??
            this.toNullableString(dtoIn.apiCredential.connectionData?.token);
        if (token === null) {
            throw new Error('Mercado Pago provider token is required');
        }
        return token;
    }
    resolveBaseUrl(dtoIn) {
        const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
        const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);
        return (this.toNullableString(apiCredentialConfig.baseUrl) ??
            this.toNullableString(apiCredentialConfig.base_url) ??
            this.toNullableString(gatewayConfig.baseUrl) ??
            this.toNullableString(gatewayConfig.base_url) ??
            'https://api.mercadopago.com');
    }
    resolveBackUrl(dtoIn) {
        const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
        const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);
        const checkoutSessionConfig = this.asObject(dtoIn.config.checkoutSessionConfig);
        return (this.toNullableString(checkoutSessionConfig.successUrl) ??
            this.toNullableString(apiCredentialConfig.successUrl) ??
            this.toNullableString(apiCredentialConfig.success_url) ??
            this.toNullableString(apiCredentialConfig.backUrl) ??
            this.toNullableString(apiCredentialConfig.back_url) ??
            this.toNullableString(gatewayConfig.successUrl) ??
            this.toNullableString(gatewayConfig.backUrl));
    }
    centsToAmount(valueInCents) {
        return Number((valueInCents / 100).toFixed(2));
    }
    async parseJsonResponse(response, fallbackMessage) {
        const rawText = await response.text();
        if (rawText.trim() === '') {
            return {
                message: `${fallbackMessage}: empty response`,
                statusCode: response.status,
            };
        }
        try {
            const parsed = JSON.parse(rawText);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed;
            }
            return {
                message: fallbackMessage,
                rawResponse: rawText,
                statusCode: response.status,
            };
        }
        catch {
            return {
                message: fallbackMessage,
                rawResponse: rawText.slice(0, 2000),
                statusCode: response.status,
            };
        }
    }
    resolveMercadoPagoErrorMessage(responseBody, statusCode) {
        const message = this.toNullableString(responseBody.message) ??
            this.toNullableString(responseBody.error) ??
            this.toNullableString(responseBody.cause);
        return (message ??
            `Mercado Pago recurring subscription request failed with status ${statusCode}`);
    }
    sanitizePayload(payload) {
        if (payload === null) {
            return null;
        }
        const sanitized = this.sanitizeUnknownValue(payload);
        if (!sanitized ||
            typeof sanitized !== 'object' ||
            Array.isArray(sanitized)) {
            return null;
        }
        return sanitized;
    }
    sanitizeUnknownValue(value) {
        if (Array.isArray(value)) {
            return value.map((item) => this.sanitizeUnknownValue(item));
        }
        if (value && typeof value === 'object') {
            const output = {};
            for (const [key, itemValue] of Object.entries(value)) {
                if (this.isSensitiveKey(key)) {
                    output[key] = '[REDACTED]';
                    continue;
                }
                output[key] = this.sanitizeUnknownValue(itemValue);
            }
            return output;
        }
        return value;
    }
    isSensitiveKey(key) {
        const normalizedKey = key
            .toLowerCase()
            .trim()
            .replace(/[\s_\-]/g, '');
        const sensitiveKeys = [
            'token',
            'providertoken',
            'authorization',
            'accesstoken',
            'clientsecret',
            'merchantkey',
            'secret',
            'password',
            'card',
            'cardnumber',
            'cardtoken',
            'encryptedcard',
            'cvv',
            'securitycode',
            'pan',
            'rawcard',
        ];
        return sensitiveKeys.includes(normalizedKey);
    }
    asObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return {};
        }
        return value;
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toRequiredString(value, message) {
        if (value === undefined || value === null || String(value).trim() === '') {
            throw new Error(message);
        }
        return String(value).trim();
    }
    limitText(value, limit) {
        if (value.length <= limit) {
            return value;
        }
        return value.slice(0, limit);
    }
    nowAsIso() {
        return new Date().toISOString();
    }
};
exports.MercadoPagoRecurringPaymentProvider = MercadoPagoRecurringPaymentProvider;
exports.MercadoPagoRecurringPaymentProvider = MercadoPagoRecurringPaymentProvider = __decorate([
    (0, common_1.Injectable)()
], MercadoPagoRecurringPaymentProvider);
//# sourceMappingURL=mercado-pago-recurring-payment.provider.js.map