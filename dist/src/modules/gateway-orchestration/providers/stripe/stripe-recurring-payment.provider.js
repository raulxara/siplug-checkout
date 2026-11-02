"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeRecurringPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const gateway_recurring_payment_dto_out_1 = require("../../dtos/gateway-recurring-payment.dto-out");
let StripeRecurringPaymentProvider = class StripeRecurringPaymentProvider {
    async createSubscription(dtoIn) {
        const token = this.resolveProviderToken(dtoIn);
        const baseUrl = this.resolveBaseUrl(dtoIn);
        const requestPayload = this.buildCheckoutSessionRequest(dtoIn);
        const response = await fetch(`${baseUrl}/checkout/sessions`, {
            method: 'POST',
            headers: this.buildHeaders({
                token,
                idempotencyKey: dtoIn.idempotencyKey ?? dtoIn.paymentTransaction.idempotencyKey,
            }),
            body: requestPayload.toString(),
        });
        const responseBody = await this.parseJsonResponse(response, 'Stripe returned a non JSON recurring subscription response');
        if (!response.ok) {
            return new gateway_recurring_payment_dto_out_1.GatewayRecurringPaymentDtoOut(false, 'stripe', null, this.resolveStripePriceId(dtoIn), null, null, this.toNullableString(responseBody.status) ?? String(response.status), 'failed', 'gateway_recurring_provider_failed', this.resolveStripeErrorMessage(responseBody, response.status), this.sanitizePayload(this.urlSearchParamsToObject(requestPayload)), this.sanitizePayload(responseBody), {
                ok: false,
                provider: 'stripe',
                endpoint: '/checkout/sessions',
                httpStatus: response.status,
            }, null, null);
        }
        const checkoutSessionId = this.toNullableString(responseBody.id);
        const checkoutUrl = this.toNullableString(responseBody.url);
        const gatewaySubscriptionId = this.toNullableString(responseBody.subscription);
        const stripeStatus = this.toNullableString(responseBody.status) ?? 'open';
        const paymentStatus = this.toNullableString(responseBody.payment_status) ?? 'unpaid';
        const mappedStatus = this.mapStripeCheckoutStatus({
            status: stripeStatus,
            paymentStatus,
        });
        return new gateway_recurring_payment_dto_out_1.GatewayRecurringPaymentDtoOut(true, 'stripe', gatewaySubscriptionId, this.resolveStripePriceId(dtoIn), null, checkoutSessionId, stripeStatus, mappedStatus.status, mappedStatus.processStatus, mappedStatus.processMessage, this.sanitizePayload(this.urlSearchParamsToObject(requestPayload)), this.sanitizePayload(responseBody), {
            ok: true,
            provider: 'stripe',
            endpoint: '/checkout/sessions',
            httpStatus: response.status,
        }, checkoutUrl, checkoutUrl, null, null, null, null, null, null, null, null, dtoIn.paymentTransaction.expiresAt);
    }
    buildCheckoutSessionRequest(dtoIn) {
        const params = new URLSearchParams();
        const payer = this.asObject(dtoIn.providerPayload.payer);
        const checkoutSession = this.asObject(dtoIn.providerPayload.checkoutSession);
        const paymentMethodType = this.resolveStripePaymentMethodType(dtoIn.paymentTransaction.paymentMethod);
        if (paymentMethodType === null) {
            throw new Error(`Stripe recurring payment does not support paymentMethod: ${dtoIn.paymentTransaction.paymentMethod}`);
        }
        params.append('mode', 'subscription');
        params.append('client_reference_id', dtoIn.paymentTransaction._id);
        params.append('payment_method_types[0]', paymentMethodType);
        const customerEmail = this.toNullableString(payer.email) ??
            this.toNullableString(dtoIn.paymentTransaction.metadata?.payerEmail);
        if (customerEmail !== null) {
            params.append('customer_email', customerEmail);
        }
        const successUrl = this.toNullableString(checkoutSession.successUrl) ??
            this.resolveSuccessUrl(dtoIn) ??
            'https://siplug.com/payment/success?session_id={CHECKOUT_SESSION_ID}';
        const cancelUrl = this.toNullableString(checkoutSession.cancelUrl) ??
            this.resolveCancelUrl(dtoIn) ??
            'https://siplug.com/payment/cancel';
        params.append('success_url', this.ensureStripeSessionPlaceholder(successUrl));
        params.append('cancel_url', cancelUrl);
        const stripePriceId = this.resolveStripePriceId(dtoIn);
        if (stripePriceId !== null) {
            params.append('line_items[0][price]', stripePriceId);
            params.append('line_items[0][quantity]', '1');
        }
        else {
            params.append('line_items[0][price_data][currency]', dtoIn.paymentTransaction.currency.toLowerCase());
            params.append('line_items[0][price_data][unit_amount]', String(dtoIn.paymentTransaction.amount));
            params.append('line_items[0][price_data][recurring][interval]', this.mapStripeInterval(dtoIn.subscriptionPlan.billingInterval));
            params.append('line_items[0][price_data][recurring][interval_count]', String(dtoIn.subscriptionPlan.billingIntervalCount));
            params.append('line_items[0][price_data][product_data][name]', this.limitText(dtoIn.subscriptionPlan.name, 250));
            if (dtoIn.subscriptionPlan.description !== null) {
                params.append('line_items[0][price_data][product_data][description]', this.limitText(dtoIn.subscriptionPlan.description, 500));
            }
            params.append('line_items[0][quantity]', '1');
        }
        if (dtoIn.subscriptionPlan.trialDays !== null &&
            dtoIn.subscriptionPlan.trialDays > 0) {
            params.append('subscription_data[trial_period_days]', String(dtoIn.subscriptionPlan.trialDays));
        }
        const nativeSplit = this.buildNativeRecurringSplit(dtoIn);
        if (nativeSplit !== null) {
            params.append('subscription_data[transfer_data][destination]', nativeSplit.destinationAccountId);
            params.append('subscription_data[transfer_data][amount_percent]', nativeSplit.destinationAmountPercent);
        }
        params.append('metadata[checkoutSessionId]', this.toNullableString(checkoutSession._id) ?? '');
        params.append('metadata[paymentTransactionId]', dtoIn.paymentTransaction._id);
        params.append('metadata[subscriptionId]', dtoIn.subscription._id);
        params.append('metadata[subscriptionPlanId]', dtoIn.subscriptionPlan._id);
        params.append('metadata[subscriptionInvoiceId]', dtoIn.subscriptionInvoice._id);
        params.append('metadata[source]', 'ProcessRecurringPaymentUseCase');
        params.append('subscription_data[metadata][checkoutSessionId]', this.toNullableString(checkoutSession._id) ?? '');
        params.append('subscription_data[metadata][paymentTransactionId]', dtoIn.paymentTransaction._id);
        params.append('subscription_data[metadata][subscriptionId]', dtoIn.subscription._id);
        params.append('subscription_data[metadata][subscriptionPlanId]', dtoIn.subscriptionPlan._id);
        params.append('subscription_data[metadata][subscriptionInvoiceId]', dtoIn.subscriptionInvoice._id);
        params.append('subscription_data[metadata][externalReference]', dtoIn.paymentTransaction.externalReference ?? '');
        const idempotencyKey = dtoIn.idempotencyKey ?? dtoIn.paymentTransaction.idempotencyKey;
        if (idempotencyKey !== null) {
            params.append('metadata[idempotencyKey]', idempotencyKey);
            params.append('subscription_data[metadata][idempotencyKey]', idempotencyKey);
        }
        return params;
    }
    buildNativeRecurringSplit(dtoIn) {
        if (!dtoIn.paymentTransaction.hasSplit) {
            return null;
        }
        const paymentSplit = this.asObject(dtoIn.providerPayload.split);
        const recipients = this.asObjectsArray(paymentSplit.recipients);
        if (recipients.length !== 2) {
            throw new Error('Stripe native recurring split supports exactly one connected recipient and one platform recipient');
        }
        if (this.toNullableString(paymentSplit.calculationBase) !== null &&
            this.toNullableString(paymentSplit.calculationBase) !== 'gross_amount') {
            throw new Error('Stripe native recurring split requires a split rule calculated from gross_amount');
        }
        const platformRecipients = recipients.filter((recipient) => this.isPlatformRecipient(recipient));
        const connectedRecipients = recipients.filter((recipient) => !this.isPlatformRecipient(recipient));
        if (platformRecipients.length !== 1 || connectedRecipients.length !== 1) {
            throw new Error('Stripe native recurring split requires exactly one platform recipient and one connected recipient');
        }
        const platformRecipient = platformRecipients[0];
        const connectedRecipient = connectedRecipients[0];
        const destinationAccountId = this.resolveStripeConnectedAccountId(connectedRecipient);
        const platformAmount = this.toRequiredInteger(platformRecipient.amount, 'Stripe platform split amount');
        const destinationAmount = this.toRequiredInteger(connectedRecipient.amount, 'Stripe connected recipient split amount');
        if (platformAmount < 0 || destinationAmount <= 0) {
            throw new Error('Stripe native recurring split amounts are invalid');
        }
        if (platformAmount + destinationAmount !== dtoIn.paymentTransaction.amount) {
            throw new Error('Stripe native recurring split recipients must allocate the full gross subscription amount');
        }
        const destinationPercent = (destinationAmount / dtoIn.paymentTransaction.amount) * 100;
        return {
            destinationAccountId,
            destinationAmountPercent: this.formatStripePercentage(destinationPercent),
        };
    }
    isPlatformRecipient(recipient) {
        const config = this.asObject(recipient.config);
        const role = this.toNullableString(recipient.role)?.toLowerCase();
        const defaultRole = this.toNullableString(config.defaultRole)?.toLowerCase();
        return role === 'platform' || defaultRole === 'platform';
    }
    resolveStripeConnectedAccountId(recipient) {
        const config = this.asObject(recipient.config);
        const gatewayAccounts = this.asObject(config.gatewayAccounts);
        const stripeAccount = this.asObject(gatewayAccounts.stripe);
        const accountId = this.toNullableString(recipient.gatewayRecipientId) ??
            this.toNullableString(stripeAccount.accountId) ??
            this.toNullableString(config.stripeAccountId);
        if (accountId === null || !accountId.startsWith('acct_')) {
            throw new Error('Stripe connected account id is required for the recurring split recipient');
        }
        return accountId;
    }
    toRequiredInteger(value, name) {
        const parsed = Number(value);
        if (!Number.isInteger(parsed)) {
            throw new Error(`${name} must be an integer in cents`);
        }
        return parsed;
    }
    formatStripePercentage(value) {
        if (!Number.isFinite(value) || value <= 0 || value > 100) {
            throw new Error('Stripe destination amount percentage is invalid');
        }
        return String(Number(value.toFixed(2)));
    }
    resolveStripePaymentMethodType(paymentMethod) {
        if (paymentMethod === 'payment_link') {
            return 'card';
        }
        if (paymentMethod === 'credit_card') {
            return 'card';
        }
        if (paymentMethod === 'card') {
            return 'card';
        }
        if (paymentMethod === 'boleto') {
            return 'boleto';
        }
        return null;
    }
    buildHeaders(params) {
        const headers = {
            Accept: 'application/json',
            Authorization: `Bearer ${params.token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        if (params.idempotencyKey !== null && params.idempotencyKey.trim() !== '') {
            headers['Idempotency-Key'] = params.idempotencyKey;
        }
        return headers;
    }
    resolveStripePriceId(dtoIn) {
        const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
        const gatewayMappings = this.asObject(planConfig.gatewayMappings);
        const stripeMapping = this.asObject(gatewayMappings.stripe);
        return (this.toNullableString(stripeMapping.priceId) ??
            this.toNullableString(stripeMapping.gatewayPriceId) ??
            this.toNullableString(stripeMapping.gatewayPlanId) ??
            this.toNullableString(dtoIn.subscriptionPlan.gatewayPlanId));
    }
    mapStripeInterval(interval) {
        if (interval === 'day') {
            return 'day';
        }
        if (interval === 'week') {
            return 'week';
        }
        if (interval === 'month') {
            return 'month';
        }
        if (interval === 'year') {
            return 'year';
        }
        throw new Error(`unsupported Stripe recurring interval: ${interval}`);
    }
    mapStripeCheckoutStatus(params) {
        const status = params.status.toLowerCase().trim();
        const paymentStatus = params.paymentStatus.toLowerCase().trim();
        if (status === 'complete' || paymentStatus === 'paid') {
            return {
                status: 'authorized',
                processStatus: 'gateway_recurring_subscription_authorized',
                processMessage: 'Stripe Checkout subscription completed and waiting webhook confirmation',
            };
        }
        if (status === 'expired') {
            return {
                status: 'expired',
                processStatus: 'gateway_recurring_checkout_expired',
                processMessage: 'Stripe Checkout subscription session expired',
            };
        }
        return {
            status: 'pending',
            processStatus: 'gateway_recurring_checkout_created',
            processMessage: 'Stripe Checkout subscription session created and waiting buyer approval',
        };
    }
    resolveProviderToken(dtoIn) {
        const token = this.toNullableString(dtoIn.apiCredential.token) ??
            this.toNullableString(dtoIn.apiCredential.connectionData?.token);
        if (token === null) {
            throw new Error('Stripe provider token is required');
        }
        return token;
    }
    resolveBaseUrl(dtoIn) {
        const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
        const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);
        const configuredBaseUrl = this.toNullableString(apiCredentialConfig.baseUrl) ??
            this.toNullableString(apiCredentialConfig.base_url) ??
            this.toNullableString(gatewayConfig.baseUrl) ??
            this.toNullableString(gatewayConfig.base_url) ??
            'https://api.stripe.com/v1';
        return this.normalizeStripeBaseUrl(configuredBaseUrl);
    }
    normalizeStripeBaseUrl(baseUrl) {
        const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
        if (cleanBaseUrl.endsWith('/v1')) {
            return cleanBaseUrl;
        }
        return `${cleanBaseUrl}/v1`;
    }
    resolveSuccessUrl(dtoIn) {
        const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
        const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);
        const checkoutSessionConfig = this.asObject(dtoIn.config.checkoutSessionConfig);
        return (this.toNullableString(checkoutSessionConfig.successUrl) ??
            this.toNullableString(apiCredentialConfig.successUrl) ??
            this.toNullableString(apiCredentialConfig.success_url) ??
            this.toNullableString(gatewayConfig.successUrl) ??
            this.toNullableString(gatewayConfig.success_url));
    }
    resolveCancelUrl(dtoIn) {
        const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
        const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);
        const checkoutSessionConfig = this.asObject(dtoIn.config.checkoutSessionConfig);
        return (this.toNullableString(checkoutSessionConfig.cancelUrl) ??
            this.toNullableString(apiCredentialConfig.cancelUrl) ??
            this.toNullableString(apiCredentialConfig.cancel_url) ??
            this.toNullableString(gatewayConfig.cancelUrl) ??
            this.toNullableString(gatewayConfig.cancel_url));
    }
    ensureStripeSessionPlaceholder(url) {
        if (url.includes('{CHECKOUT_SESSION_ID}')) {
            return url;
        }
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}session_id={CHECKOUT_SESSION_ID}`;
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
    resolveStripeErrorMessage(responseBody, statusCode) {
        const error = this.asObject(responseBody.error);
        const message = this.toNullableString(error.message) ??
            this.toNullableString(responseBody.message) ??
            this.toNullableString(responseBody.error);
        return (message ??
            `Stripe recurring subscription request failed with status ${statusCode}`);
    }
    urlSearchParamsToObject(params) {
        const output = {};
        for (const [key, value] of params.entries()) {
            output[key] = value;
        }
        return output;
    }
    sanitizePayload(payload) {
        if (payload === null) {
            return null;
        }
        const sanitized = this.sanitizeUnknownValue(payload);
        if (!sanitized || typeof sanitized !== 'object' || Array.isArray(sanitized)) {
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
    asObjectsArray(value) {
        if (!Array.isArray(value)) {
            return [];
        }
        return value.filter((item) => Boolean(item) && typeof item === 'object' && !Array.isArray(item));
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    limitText(value, limit) {
        if (value.length <= limit) {
            return value;
        }
        return value.slice(0, limit);
    }
};
exports.StripeRecurringPaymentProvider = StripeRecurringPaymentProvider;
exports.StripeRecurringPaymentProvider = StripeRecurringPaymentProvider = __decorate([
    (0, common_1.Injectable)()
], StripeRecurringPaymentProvider);
//# sourceMappingURL=stripe-recurring-payment.provider.js.map