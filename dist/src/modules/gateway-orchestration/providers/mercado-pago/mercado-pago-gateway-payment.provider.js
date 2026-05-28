"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoGatewayPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const gateway_payment_dto_out_1 = require("../../dtos/gateway-payment.dto-out");
let MercadoPagoGatewayPaymentProvider = class MercadoPagoGatewayPaymentProvider {
    getProviderName() {
        return 'mercado_pago';
    }
    supports(gatewayProvider) {
        const normalizedProvider = this.normalize(gatewayProvider);
        return ['mercado_pago', 'mercadopago', 'mercado-pago']
            .map((alias) => this.normalize(alias))
            .includes(normalizedProvider);
    }
    async processPayment(dtoIn) {
        try {
            const accessToken = this.resolveAccessToken(dtoIn);
            const idempotencyKey = this.resolveIdempotencyKey(dtoIn);
            let requestPayload;
            if (dtoIn.paymentTransaction.paymentMethod === 'pix') {
                requestPayload = this.buildPixPaymentRequestPayload(dtoIn);
            }
            else if (dtoIn.paymentTransaction.paymentMethod === 'credit_card') {
                requestPayload = this.buildCreditCardPaymentRequestPayload(dtoIn);
            }
            else {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: null,
                    gatewayStatus: null,
                    status: 'failed',
                    processStatus: 'gateway_payment_method_not_implemented',
                    processMessage: `Mercado Pago provider does not support payment method ${dtoIn.paymentTransaction.paymentMethod}`,
                    providerRequest: {
                        paymentTransactionId: dtoIn.paymentTransaction._id,
                        paymentMethod: dtoIn.paymentTransaction.paymentMethod,
                    },
                    providerResponse: {
                        message: 'payment method not implemented for Mercado Pago adapter',
                    },
                    gatewayResponse: null,
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            const response = await fetch('https://api.mercadopago.com/v1/payments', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Idempotency-Key': idempotencyKey,
                },
                body: JSON.stringify(requestPayload),
            });
            const responseBody = (await response.json().catch(() => ({
                message: 'Mercado Pago returned a non JSON response',
            })));
            if (!response.ok) {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: this.toNullableString(responseBody.id),
                    gatewayStatus: this.toNullableString(responseBody.status) ?? String(response.status),
                    status: 'failed',
                    processStatus: 'gateway_dispatch_failed',
                    processMessage: this.extractMercadoPagoErrorMessage(responseBody) ??
                        `Mercado Pago Payments request failed with status ${response.status}`,
                    providerRequest: requestPayload,
                    providerResponse: responseBody,
                    gatewayResponse: {
                        httpStatus: response.status,
                        ok: response.ok,
                        endpoint: '/v1/payments',
                    },
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            return this.mapSuccessfulPixPaymentResponse({
                dtoIn,
                requestPayload,
                responseBody,
                httpStatus: response.status,
            });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on Mercado Pago payment provider';
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
    buildPixPaymentRequestPayload(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const checkoutSession = this.asObject(providerPayload.checkoutSession);
        const payerPayload = this.asObject(providerPayload.payer);
        const payer = this.buildPayer(payerPayload);
        const description = this.toNullableString(checkoutSession.description) ??
            `Pagamento ${dtoIn.paymentTransaction._id}`;
        const payload = {
            transaction_amount: this.convertCentsToAmount(dtoIn.paymentTransaction.amount),
            description,
            payment_method_id: 'pix',
            payer,
            external_reference: dtoIn.paymentTransaction.externalReference ??
                dtoIn.paymentTransaction._id,
            metadata: {
                paymentTransactionId: dtoIn.paymentTransaction._id,
                checkoutSessionId: dtoIn.paymentTransaction.checkoutSessionId,
                officeId: dtoIn.paymentTransaction.officeId,
                clientId: dtoIn.paymentTransaction.clientId,
            },
        };
        const notificationUrl = this.resolveNotificationUrl(dtoIn);
        if (notificationUrl !== null) {
            payload.notification_url = notificationUrl;
        }
        const dateOfExpiration = this.resolveDateOfExpiration(dtoIn);
        if (dateOfExpiration !== null) {
            payload.date_of_expiration = dateOfExpiration;
        }
        return payload;
    }
    buildCreditCardPaymentRequestPayload(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const checkoutSession = this.asObject(providerPayload.checkoutSession);
        const payerPayload = this.asObject(providerPayload.payer);
        const paymentData = this.asObject(providerPayload.paymentData);
        const cardToken = this.toNullableString(paymentData.cardToken);
        const paymentMethodId = this.toNullableString(paymentData.paymentMethodId);
        const issuerId = this.toNullableString(paymentData.issuerId);
        if (cardToken === null) {
            throw new Error('paymentData.cardToken is required for Mercado Pago credit card');
        }
        if (paymentMethodId === null) {
            throw new Error('paymentData.paymentMethodId is required for Mercado Pago credit card');
        }
        const payer = this.buildPayer(payerPayload);
        const description = this.toNullableString(checkoutSession.description) ??
            `Pagamento ${dtoIn.paymentTransaction._id}`;
        const payload = {
            token: cardToken,
            transaction_amount: this.convertCentsToAmount(dtoIn.paymentTransaction.amount),
            installments: dtoIn.paymentTransaction.installments ?? 1,
            payment_method_id: paymentMethodId,
            description,
            payer,
            external_reference: dtoIn.paymentTransaction.externalReference ??
                dtoIn.paymentTransaction._id,
            metadata: {
                paymentTransactionId: dtoIn.paymentTransaction._id,
                checkoutSessionId: dtoIn.paymentTransaction.checkoutSessionId,
                officeId: dtoIn.paymentTransaction.officeId,
                clientId: dtoIn.paymentTransaction.clientId,
            },
        };
        if (issuerId !== null) {
            payload.issuer_id = issuerId;
        }
        const notificationUrl = this.resolveNotificationUrl(dtoIn);
        if (notificationUrl !== null) {
            payload.notification_url = notificationUrl;
        }
        return payload;
    }
    buildPayer(payerPayload) {
        const email = this.toNullableString(payerPayload.email);
        if (email === null) {
            throw new Error('payer.email is required for Mercado Pago PIX');
        }
        const name = this.toNullableString(payerPayload.name);
        const firstName = this.toNullableString(payerPayload.firstName);
        const lastName = this.toNullableString(payerPayload.lastName);
        const documentType = this.toNullableString(payerPayload.documentType);
        const documentValue = this.toNullableString(payerPayload.documentValue);
        const payer = {
            email,
        };
        if (firstName !== null) {
            payer.first_name = firstName;
        }
        if (lastName !== null) {
            payer.last_name = lastName;
        }
        if (firstName === null && name !== null) {
            const nameParts = name.trim().split(/\s+/);
            payer.first_name = nameParts.shift() ?? name;
            if (nameParts.length > 0) {
                payer.last_name = nameParts.join(' ');
            }
        }
        if (documentType !== null && documentValue !== null) {
            payer.identification = {
                type: documentType.toUpperCase(),
                number: documentValue.replace(/\D/g, ''),
            };
        }
        const address = this.buildAddress(payerPayload);
        if (address !== null) {
            payer.address = address;
        }
        return payer;
    }
    buildAddress(payerPayload) {
        const addressPayload = this.asObject(payerPayload.address);
        const zipCode = this.toNullableString(addressPayload.zipCode) ??
            this.toNullableString(addressPayload.zip_code);
        const streetName = this.toNullableString(addressPayload.streetName) ??
            this.toNullableString(addressPayload.street_name);
        const streetNumber = this.toNullableString(addressPayload.streetNumber) ??
            this.toNullableString(addressPayload.street_number);
        const neighborhood = this.toNullableString(addressPayload.neighborhood);
        const city = this.toNullableString(addressPayload.city);
        const federalUnit = this.toNullableString(addressPayload.federalUnit) ??
            this.toNullableString(addressPayload.federal_unit);
        const address = {};
        if (zipCode !== null) {
            address.zip_code = zipCode.replace(/\D/g, '');
        }
        if (streetName !== null) {
            address.street_name = streetName;
        }
        if (streetNumber !== null) {
            address.street_number = streetNumber;
        }
        if (neighborhood !== null) {
            address.neighborhood = neighborhood;
        }
        if (city !== null) {
            address.city = city;
        }
        if (federalUnit !== null) {
            address.federal_unit = federalUnit;
        }
        return Object.keys(address).length > 0 ? address : null;
    }
    mapSuccessfulPixPaymentResponse(params) {
        const gatewayStatus = this.toNullableString(params.responseBody.status) ?? 'unknown';
        const gatewayStatusDetail = this.toNullableString(params.responseBody.status_detail);
        const internalStatus = this.mapMercadoPagoStatusToInternalStatus({
            status: gatewayStatus,
            statusDetail: gatewayStatusDetail,
        });
        const processStatus = this.mapMercadoPagoStatusToProcessStatus({
            status: gatewayStatus,
            statusDetail: gatewayStatusDetail,
        });
        const transactionData = params.responseBody.point_of_interaction?.transaction_data;
        return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
            success: true,
            provider: this.getProviderName(),
            gatewayTransactionId: this.toNullableString(params.responseBody.id),
            gatewayStatus,
            status: internalStatus,
            processStatus,
            processMessage: `Mercado Pago payment returned status ${gatewayStatus}${gatewayStatusDetail !== null ? `/${gatewayStatusDetail}` : ''}`,
            providerRequest: params.requestPayload,
            providerResponse: params.responseBody,
            gatewayResponse: {
                httpStatus: params.httpStatus,
                ok: true,
                endpoint: '/v1/payments',
                paymentId: params.responseBody.id ?? null,
                paymentStatus: params.responseBody.status ?? null,
                paymentStatusDetail: params.responseBody.status_detail ?? null,
            },
            qrCode: transactionData?.qr_code ?? null,
            qrCodeBase64: transactionData?.qr_code_base64 ?? null,
            boletoUrl: null,
            checkoutUrl: transactionData?.ticket_url ?? null,
            paidAt: internalStatus === 'paid' ? this.nowAsSqlDateTime() : null,
            authorizedAt: internalStatus === 'authorized' ? this.nowAsSqlDateTime() : null,
            canceledAt: internalStatus === 'canceled' ? this.nowAsSqlDateTime() : null,
            failedAt: internalStatus === 'failed' ? this.nowAsSqlDateTime() : null,
            refundedAt: internalStatus === 'refunded' ? this.nowAsSqlDateTime() : null,
            expiresAt: this.formatExternalDate(params.responseBody.date_of_expiration) ??
                params.dtoIn.paymentTransaction.expiresAt,
        });
    }
    resolveAccessToken(dtoIn) {
        const connectionData = dtoIn.apiCredential?.connectionData ?? {};
        const config = dtoIn.apiCredential?.config ?? {};
        const candidates = [
            dtoIn.apiCredential?.token,
            connectionData.token,
            connectionData.accessToken,
            connectionData.access_token,
            connectionData.providerToken,
            connectionData.provider_token,
            config.accessToken,
            config.access_token,
            config.providerToken,
            config.provider_token,
        ];
        const token = candidates.find((value) => typeof value === 'string' && value.trim() !== '');
        if (typeof token !== 'string') {
            throw new Error('Mercado Pago token is required in api credential connection data');
        }
        return token;
    }
    resolveIdempotencyKey(dtoIn) {
        const idempotencyKey = dtoIn.idempotencyKey ?? dtoIn.paymentTransaction.idempotencyKey;
        if (idempotencyKey !== null && idempotencyKey.trim() !== '') {
            return idempotencyKey;
        }
        return dtoIn.paymentTransaction._id;
    }
    resolveNotificationUrl(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        return (this.toNullableString(transactionConfig.notificationUrl) ??
            this.toNullableString(transactionConfig.notification_url) ??
            this.toNullableString(gatewayConfig.notificationUrl) ??
            this.toNullableString(gatewayConfig.notification_url) ??
            this.toNullableString(apiCredentialConfig.notificationUrl) ??
            this.toNullableString(apiCredentialConfig.notification_url));
    }
    resolveDateOfExpiration(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        return (this.toNullableString(transactionConfig.dateOfExpiration) ??
            this.toNullableString(transactionConfig.date_of_expiration) ??
            this.toNullableString(gatewayConfig.dateOfExpiration) ??
            this.toNullableString(gatewayConfig.date_of_expiration) ??
            this.toNullableString(apiCredentialConfig.dateOfExpiration) ??
            this.toNullableString(apiCredentialConfig.date_of_expiration));
    }
    mapMercadoPagoStatusToInternalStatus(params) {
        const status = params.status.toLowerCase().trim();
        const statusDetail = params.statusDetail?.toLowerCase().trim() ?? null;
        if (status === 'approved') {
            return 'paid';
        }
        if (status === 'authorized') {
            return 'authorized';
        }
        if (status === 'pending' ||
            status === 'in_process' ||
            statusDetail === 'pending_waiting_transfer') {
            return 'pending';
        }
        if (status === 'rejected' || status === 'failed') {
            return 'failed';
        }
        if (status === 'cancelled' || status === 'canceled') {
            return 'canceled';
        }
        if (status === 'refunded') {
            return 'refunded';
        }
        return 'processing';
    }
    mapMercadoPagoStatusToProcessStatus(params) {
        const status = params.status.toLowerCase().trim();
        const statusDetail = params.statusDetail?.toLowerCase().trim() ?? null;
        if (status === 'approved') {
            return 'gateway_approved';
        }
        if (status === 'authorized') {
            return 'gateway_authorized';
        }
        if (status === 'pending' ||
            status === 'in_process' ||
            statusDetail === 'pending_waiting_transfer') {
            return 'gateway_pending';
        }
        if (status === 'rejected' || status === 'failed') {
            return 'gateway_rejected';
        }
        if (status === 'cancelled' || status === 'canceled') {
            return 'gateway_cancelled';
        }
        if (status === 'refunded') {
            return 'gateway_refunded';
        }
        return 'gateway_dispatched';
    }
    extractMercadoPagoErrorMessage(responseBody) {
        const message = this.toNullableString(responseBody.message);
        if (message !== null) {
            return message;
        }
        const error = this.toNullableString(responseBody.error);
        if (error !== null) {
            return error;
        }
        const cause = responseBody.cause;
        if (Array.isArray(cause) && cause.length > 0) {
            const firstCause = cause[0];
            return (this.toNullableString(firstCause.description) ??
                this.toNullableString(firstCause.message) ??
                this.toNullableString(firstCause.code));
        }
        return null;
    }
    convertCentsToAmount(amountInCents) {
        return Number((amountInCents / 100).toFixed(2));
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
    formatExternalDate(value) {
        if (!value) {
            return null;
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return this.formatDateToSqlDateTime(date);
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
exports.MercadoPagoGatewayPaymentProvider = MercadoPagoGatewayPaymentProvider;
exports.MercadoPagoGatewayPaymentProvider = MercadoPagoGatewayPaymentProvider = __decorate([
    (0, common_1.Injectable)()
], MercadoPagoGatewayPaymentProvider);
//# sourceMappingURL=mercado-pago-gateway-payment.provider.js.map