"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalGatewayPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const gateway_payment_dto_out_1 = require("../../dtos/gateway-payment.dto-out");
let PayPalGatewayPaymentProvider = class PayPalGatewayPaymentProvider {
    getProviderName() {
        return 'paypal';
    }
    supports(gatewayProvider) {
        const normalizedProvider = this.normalize(gatewayProvider);
        return ['paypal', 'pay_pal', 'paypal_checkout', 'pay-pal']
            .map((alias) => this.normalize(alias))
            .includes(normalizedProvider);
    }
    async processPayment(dtoIn) {
        try {
            if (!['payment_link', 'credit_card'].includes(dtoIn.paymentTransaction.paymentMethod)) {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: null,
                    gatewayStatus: null,
                    status: 'failed',
                    processStatus: 'gateway_payment_method_not_implemented',
                    processMessage: `PayPal provider does not support payment method ${dtoIn.paymentTransaction.paymentMethod} in this adapter`,
                    providerRequest: {
                        paymentTransactionId: dtoIn.paymentTransaction._id,
                        paymentMethod: dtoIn.paymentTransaction.paymentMethod,
                    },
                    providerResponse: {
                        message: 'payment method not implemented for PayPal adapter',
                    },
                    gatewayResponse: null,
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            const accessToken = await this.createAccessToken(dtoIn);
            const baseUrl = this.resolveBaseUrl(dtoIn);
            const requestPayload = this.buildOrderRequestPayload(dtoIn);
            const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'PayPal-Request-Id': this.resolveIdempotencyKey(dtoIn),
                    Prefer: 'return=representation',
                },
                body: JSON.stringify(requestPayload),
            });
            const responseBody = (await response.json().catch(() => ({
                message: 'PayPal returned a non JSON response',
            })));
            if (!response.ok) {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: this.toNullableString(responseBody.id) ??
                        dtoIn.paymentTransaction.externalReference ??
                        dtoIn.paymentTransaction._id,
                    gatewayStatus: this.toNullableString(responseBody.status) ??
                        String(response.status),
                    status: 'failed',
                    processStatus: 'gateway_dispatch_failed',
                    processMessage: this.extractPayPalErrorMessage(responseBody) ??
                        `PayPal order request failed with status ${response.status}`,
                    providerRequest: requestPayload,
                    providerResponse: responseBody,
                    gatewayResponse: {
                        ok: false,
                        httpStatus: response.status,
                        endpoint: '/v2/checkout/orders',
                    },
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            const approvalUrl = this.extractApprovalUrl(responseBody);
            if (approvalUrl === null) {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: this.toNullableString(responseBody.id) ??
                        dtoIn.paymentTransaction.externalReference ??
                        dtoIn.paymentTransaction._id,
                    gatewayStatus: 'missing_approval_url',
                    status: 'failed',
                    processStatus: 'gateway_dispatch_failed',
                    processMessage: 'PayPal did not return approval url',
                    providerRequest: requestPayload,
                    providerResponse: responseBody,
                    gatewayResponse: {
                        ok: true,
                        httpStatus: response.status,
                        endpoint: '/v2/checkout/orders',
                        missingApprovalUrl: true,
                    },
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            const gatewayStatus = this.toNullableString(responseBody.status) ?? 'CREATED';
            return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                success: true,
                provider: this.getProviderName(),
                gatewayTransactionId: this.toNullableString(responseBody.id) ??
                    requestPayload.purchase_units[0].reference_id,
                gatewayStatus,
                status: this.mapPayPalStatusToInternalStatus(gatewayStatus),
                processStatus: this.mapPayPalStatusToProcessStatus(gatewayStatus),
                processMessage: `PayPal order returned status ${gatewayStatus}`,
                providerRequest: requestPayload,
                providerResponse: responseBody,
                gatewayResponse: {
                    ok: true,
                    httpStatus: response.status,
                    endpoint: '/v2/checkout/orders',
                    orderId: responseBody.id ?? null,
                    approvalUrl,
                },
                qrCode: null,
                qrCodeBase64: null,
                boletoUrl: null,
                checkoutUrl: approvalUrl,
                paidAt: null,
                authorizedAt: null,
                canceledAt: null,
                failedAt: null,
                refundedAt: null,
                expiresAt: dtoIn.paymentTransaction.expiresAt,
            });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on PayPal payment provider';
            return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                success: false,
                provider: this.getProviderName(),
                gatewayTransactionId: null,
                gatewayStatus: null,
                status: 'failed',
                processStatus: 'gateway_dispatch_exception',
                processMessage: message,
                providerRequest: {
                    paymentTransactionId: dtoIn.paymentTransaction._id,
                    idempotencyKey: dtoIn.idempotencyKey,
                    providerPayload: dtoIn.providerPayload,
                },
                providerResponse: {
                    message,
                },
                gatewayResponse: null,
                failedAt: this.nowAsSqlDateTime(),
                expiresAt: dtoIn.paymentTransaction.expiresAt,
            });
        }
    }
    async createAccessToken(dtoIn) {
        const baseUrl = this.resolveBaseUrl(dtoIn);
        const clientId = this.resolveClientId(dtoIn);
        const clientSecret = this.resolveClientSecret(dtoIn);
        const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Accept-Language': 'en_US',
                Authorization: `Basic ${basicToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });
        const responseBody = (await response.json().catch(() => ({
            error_description: 'PayPal returned a non JSON OAuth response',
        })));
        if (!response.ok) {
            throw new Error(this.toNullableString(responseBody.error_description) ??
                this.toNullableString(responseBody.error) ??
                `PayPal OAuth request failed with status ${response.status}`);
        }
        const accessToken = this.toNullableString(responseBody.access_token);
        if (accessToken === null) {
            throw new Error('PayPal access token was not returned');
        }
        return accessToken;
    }
    buildOrderRequestPayload(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const referenceId = dtoIn.paymentTransaction.externalReference ??
            dtoIn.paymentTransaction.idempotencyKey ??
            dtoIn.paymentTransaction._id;
        const currencyCode = String(dtoIn.paymentTransaction.currency ?? 'BRL').toUpperCase();
        const items = this.buildItems(dtoIn, currencyCode);
        const amountValue = this.formatAmountFromCents(dtoIn.paymentTransaction.amount);
        const returnUrl = this.toNullableString(transactionConfig.returnUrl) ??
            this.toNullableString(transactionConfig.return_url) ??
            this.toNullableString(transactionConfig.successUrl) ??
            this.toNullableString(transactionConfig.success_url) ??
            this.toNullableString(gatewayConfig.returnUrl) ??
            this.toNullableString(gatewayConfig.return_url) ??
            this.toNullableString(gatewayConfig.successUrl) ??
            this.toNullableString(gatewayConfig.success_url) ??
            this.toNullableString(apiCredentialConfig.returnUrl) ??
            this.toNullableString(apiCredentialConfig.return_url) ??
            this.toNullableString(apiCredentialConfig.successUrl) ??
            this.toNullableString(apiCredentialConfig.success_url);
        if (returnUrl === null) {
            throw new Error('PayPal returnUrl is required in api credential config');
        }
        const cancelUrl = this.toNullableString(transactionConfig.cancelUrl) ??
            this.toNullableString(transactionConfig.cancel_url) ??
            this.toNullableString(gatewayConfig.cancelUrl) ??
            this.toNullableString(gatewayConfig.cancel_url) ??
            this.toNullableString(apiCredentialConfig.cancelUrl) ??
            this.toNullableString(apiCredentialConfig.cancel_url);
        if (cancelUrl === null) {
            throw new Error('PayPal cancelUrl is required in api credential config');
        }
        const brandName = this.toNullableString(apiCredentialConfig.brandName) ??
            this.toNullableString(apiCredentialConfig.brand_name) ??
            'SiPlug';
        const locale = this.toNullableString(apiCredentialConfig.locale) ??
            this.toNullableString(gatewayConfig.locale) ??
            'pt-BR';
        return {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: referenceId,
                    custom_id: dtoIn.paymentTransaction._id,
                    invoice_id: referenceId.slice(0, 127),
                    description: dtoIn.paymentTransaction.externalReference ??
                        `Pagamento ${dtoIn.paymentTransaction._id}`,
                    amount: {
                        currency_code: currencyCode,
                        value: amountValue,
                        breakdown: {
                            item_total: {
                                currency_code: currencyCode,
                                value: amountValue,
                            },
                        },
                    },
                    items,
                },
            ],
            payment_source: {
                paypal: {
                    experience_context: {
                        payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                        brand_name: brandName,
                        locale,
                        landing_page: 'NO_PREFERENCE',
                        shipping_preference: 'NO_SHIPPING',
                        user_action: 'PAY_NOW',
                        return_url: returnUrl,
                        cancel_url: cancelUrl,
                    },
                },
            },
        };
    }
    buildItems(dtoIn, currencyCode) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const rawItems = providerPayload.items;
        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            return [
                {
                    name: dtoIn.paymentTransaction.externalReference ??
                        `Pagamento ${dtoIn.paymentTransaction._id}`,
                    quantity: '1',
                    unit_amount: {
                        currency_code: currencyCode,
                        value: this.formatAmountFromCents(dtoIn.paymentTransaction.amount),
                    },
                    category: 'DIGITAL_GOODS',
                },
            ];
        }
        return rawItems
            .map((item) => this.asObject(item))
            .filter((item) => Object.keys(item).length > 0)
            .map((item) => {
            const quantity = this.toPositiveInteger(item.quantity) ?? 1;
            const unitAmount = this.toPositiveInteger(item.unitAmount) ??
                this.toPositiveInteger(item.unit_amount) ??
                this.toPositiveInteger(item.price) ??
                dtoIn.paymentTransaction.amount;
            return {
                name: this.toNullableString(item.name) ??
                    this.toNullableString(item.description) ??
                    `Item ${dtoIn.paymentTransaction._id}`,
                quantity: String(quantity),
                unit_amount: {
                    currency_code: currencyCode,
                    value: this.formatAmountFromCents(unitAmount),
                },
                description: this.toNullableString(item.description) ?? undefined,
                sku: this.toNullableString(item.itemRef) ??
                    this.toNullableString(item.item_ref) ??
                    undefined,
                category: 'DIGITAL_GOODS',
            };
        });
    }
    resolveClientId(dtoIn) {
        const config = dtoIn.config ?? {};
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const connectionData = dtoIn.apiCredential?.connectionData ?? {};
        const credentialConfig = dtoIn.apiCredential?.config ?? {};
        const clientId = this.toNullableString(apiCredentialConfig.clientId) ??
            this.toNullableString(apiCredentialConfig.client_id) ??
            this.toNullableString(credentialConfig.clientId) ??
            this.toNullableString(credentialConfig.client_id) ??
            this.toNullableString(connectionData.clientId) ??
            this.toNullableString(connectionData.client_id);
        if (clientId === null) {
            throw new Error('PayPal clientId is required in api credential config');
        }
        return clientId;
    }
    resolveClientSecret(dtoIn) {
        const connectionData = dtoIn.apiCredential?.connectionData ?? {};
        const credentialConfig = dtoIn.apiCredential?.config ?? {};
        const secret = this.toNullableString(dtoIn.apiCredential?.token) ??
            this.toNullableString(connectionData.token) ??
            this.toNullableString(connectionData.clientSecret) ??
            this.toNullableString(connectionData.client_secret) ??
            this.toNullableString(credentialConfig.clientSecret) ??
            this.toNullableString(credentialConfig.client_secret);
        if (secret === null) {
            throw new Error('PayPal client secret is required in provider token');
        }
        return secret;
    }
    resolveBaseUrl(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const baseUrl = this.toNullableString(transactionConfig.baseUrl) ??
            this.toNullableString(transactionConfig.base_url) ??
            this.toNullableString(gatewayConfig.baseUrl) ??
            this.toNullableString(gatewayConfig.base_url) ??
            this.toNullableString(apiCredentialConfig.baseUrl) ??
            this.toNullableString(apiCredentialConfig.base_url);
        return baseUrl ?? 'https://api-m.sandbox.paypal.com';
    }
    resolveIdempotencyKey(dtoIn) {
        return (dtoIn.idempotencyKey ??
            dtoIn.paymentTransaction.idempotencyKey ??
            dtoIn.paymentTransaction._id);
    }
    extractApprovalUrl(responseBody) {
        const links = Array.isArray(responseBody.links) ? responseBody.links : [];
        const payerActionLink = links.find((link) => {
            return this.normalize(String(link.rel ?? '')) === 'payer_action';
        });
        const approveLink = links.find((link) => {
            return this.normalize(String(link.rel ?? '')) === 'approve';
        });
        const checkoutNowLink = links.find((link) => {
            const href = this.toNullableString(link.href);
            return href !== null && href.includes('/checkoutnow?token=');
        });
        return (this.toNullableString(payerActionLink?.href) ??
            this.toNullableString(approveLink?.href) ??
            this.toNullableString(checkoutNowLink?.href) ??
            null);
    }
    extractPayPalErrorMessage(responseBody) {
        if (Array.isArray(responseBody.details) &&
            responseBody.details.length > 0) {
            const firstDetail = responseBody.details[0];
            return (this.toNullableString(firstDetail.description) ??
                this.toNullableString(firstDetail.issue) ??
                this.toNullableString(firstDetail.field));
        }
        return (this.toNullableString(responseBody.message) ??
            this.toNullableString(responseBody.name));
    }
    mapPayPalStatusToInternalStatus(gatewayStatus) {
        const status = this.normalize(gatewayStatus);
        if (status === 'completed') {
            return 'paid';
        }
        if (status === 'approved' ||
            status === 'created' ||
            status === 'payer_action_required') {
            return 'pending';
        }
        if (status === 'voided') {
            return 'canceled';
        }
        return 'pending';
    }
    mapPayPalStatusToProcessStatus(gatewayStatus) {
        const status = this.normalize(gatewayStatus);
        if (status === 'completed') {
            return 'gateway_approved';
        }
        if (status === 'approved') {
            return 'gateway_approved_pending_capture';
        }
        if (status === 'created' || status === 'payer_action_required') {
            return 'gateway_pending';
        }
        if (status === 'voided') {
            return 'gateway_cancelled';
        }
        return 'gateway_pending';
    }
    formatAmountFromCents(value) {
        return (value / 100).toFixed(2);
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
        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean') {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toPositiveInteger(value) {
        if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
            return value;
        }
        if (typeof value === 'string' && value.trim() !== '') {
            const parsed = Number(value);
            if (Number.isInteger(parsed) && parsed > 0) {
                return parsed;
            }
        }
        return null;
    }
    nowAsSqlDateTime() {
        return this.formatDateToSqlDateTime(new Date());
    }
    formatDateToSqlDateTime(date) {
        const year = date.getFullYear();
        const month = this.pad(date.getMonth() + 1);
        const day = this.pad(date.getDate());
        const hours = this.pad(date.getHours());
        const minutes = this.pad(date.getMinutes());
        const seconds = this.pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    pad(value) {
        return String(value).padStart(2, '0');
    }
    normalize(value) {
        return value
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\./g, '')
            .replace(/-/g, '_')
            .replace(/\s+/g, '_');
    }
};
exports.PayPalGatewayPaymentProvider = PayPalGatewayPaymentProvider;
exports.PayPalGatewayPaymentProvider = PayPalGatewayPaymentProvider = __decorate([
    (0, common_1.Injectable)()
], PayPalGatewayPaymentProvider);
//# sourceMappingURL=paypal-gateway-payment.provider.js.map