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
            const credentialValidationFailure = this.validateMercadoPagoCredentialForTestScenario(dtoIn, accessToken);
            if (credentialValidationFailure !== null) {
                return credentialValidationFailure;
            }
            if (dtoIn.paymentTransaction.paymentMethod === 'payment_link') {
                return await this.processPaymentLink({
                    dtoIn,
                    accessToken,
                    idempotencyKey,
                });
            }
            let requestPayload;
            if (dtoIn.paymentTransaction.paymentMethod === 'pix') {
                requestPayload = this.buildPixPaymentRequestPayload(dtoIn);
            }
            else if (dtoIn.paymentTransaction.paymentMethod === 'credit_card') {
                requestPayload = this.buildCreditCardPaymentRequestPayload(dtoIn);
            }
            else if (dtoIn.paymentTransaction.paymentMethod === 'boleto') {
                requestPayload = this.buildBoletoPaymentRequestPayload(dtoIn);
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
                const retryable = this.isRetryableGatewayFailure(response.status);
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: this.toNullableString(responseBody.id),
                    gatewayStatus: this.toNullableString(responseBody.status) ??
                        String(response.status),
                    status: retryable ? 'pending' : 'failed',
                    processStatus: retryable
                        ? 'gateway_unavailable_retryable'
                        : 'gateway_dispatch_failed',
                    processMessage: this.extractMercadoPagoErrorMessage(responseBody) ??
                        `Mercado Pago Payments request failed with status ${response.status}`,
                    providerRequest: requestPayload,
                    providerResponse: responseBody,
                    gatewayResponse: {
                        httpStatus: response.status,
                        ok: response.ok,
                        endpoint: '/v1/payments',
                    },
                    failedAt: retryable ? null : this.nowAsSqlDateTime(),
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
    async processPaymentLink(params) {
        const requestPayload = this.buildPaymentLinkPreferenceRequestPayload(params.dtoIn);
        const headers = {
            accept: 'application/json',
            Authorization: `Bearer ${params.accessToken}`,
            'Content-Type': 'application/json',
        };
        if (params.idempotencyKey.trim() !== '') {
            headers['X-Idempotency-Key'] = params.idempotencyKey;
        }
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers,
            body: JSON.stringify(requestPayload),
        });
        const responseBody = (await response.json().catch(() => ({
            message: 'Mercado Pago returned a non JSON preference response',
        })));
        if (!response.ok) {
            return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                success: false,
                provider: this.getProviderName(),
                gatewayTransactionId: this.toNullableString(responseBody.id),
                gatewayStatus: this.toNullableString(responseBody.status) ?? String(response.status),
                status: 'failed',
                processStatus: 'gateway_payment_link_creation_failed',
                processMessage: this.extractMercadoPagoErrorMessage(responseBody) ??
                    `Mercado Pago preference request failed with status ${response.status}`,
                providerRequest: requestPayload,
                providerResponse: responseBody,
                gatewayResponse: {
                    httpStatus: response.status,
                    ok: response.ok,
                    endpoint: '/checkout/preferences',
                },
                failedAt: this.nowAsSqlDateTime(),
                expiresAt: params.dtoIn.paymentTransaction.expiresAt,
            });
        }
        return this.mapSuccessfulPaymentLinkPreferenceResponse({
            dtoIn: params.dtoIn,
            requestPayload: requestPayload,
            responseBody,
            httpStatus: response.status,
        });
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
        this.applyMercadoPagoNativeSplitToPaymentPayload({
            dtoIn,
            payload: payload,
        });
        return payload;
    }
    buildCreditCardPaymentRequestPayload(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const checkoutSession = this.asObject(providerPayload.checkoutSession);
        const payerPayload = this.asObject(providerPayload.payer);
        const paymentData = this.asObject(providerPayload.paymentData);
        const cardToken = this.toNullableString(paymentData.cardToken) ??
            this.toNullableString(paymentData.card_token) ??
            this.toNullableString(paymentData.cardTokenId) ??
            this.toNullableString(paymentData.card_token_id) ??
            this.toNullableString(paymentData.token);
        const paymentMethodId = this.toNullableString(paymentData.paymentMethodId) ??
            this.toNullableString(paymentData.payment_method_id);
        const issuerId = this.toNullableString(paymentData.issuerId) ??
            this.toNullableString(paymentData.issuer_id);
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
        this.applyMercadoPagoNativeSplitToPaymentPayload({
            dtoIn,
            payload,
        });
        return payload;
    }
    buildBoletoPaymentRequestPayload(dtoIn) {
        const boletoMinimumAmountInCents = 500;
        if (dtoIn.paymentTransaction.amount < boletoMinimumAmountInCents) {
            throw new Error('Mercado Pago boleto requires amount greater than or equal to R$ 5,00');
        }
        const providerPayload = dtoIn.providerPayload ?? {};
        const checkoutSession = this.asObject(providerPayload.checkoutSession);
        const payerPayload = this.asObject(providerPayload.payer);
        const payer = this.buildPayer(payerPayload);
        const description = this.toNullableString(checkoutSession.description) ??
            `Pagamento ${dtoIn.paymentTransaction._id}`;
        const payload = {
            transaction_amount: this.convertCentsToAmount(dtoIn.paymentTransaction.amount),
            description,
            payment_method_id: 'bolbradesco',
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
        this.applyMercadoPagoNativeSplitToPaymentPayload({
            dtoIn,
            payload,
        });
        return payload;
    }
    buildPaymentLinkPreferenceRequestPayload(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const checkoutSession = this.asObject(providerPayload.checkoutSession);
        const payerPayload = this.asObject(providerPayload.payer);
        const itemsPayload = Array.isArray(providerPayload.items)
            ? providerPayload.items
            : [];
        const items = itemsPayload.length > 0
            ? itemsPayload.map((item, index) => {
                const itemObject = this.asObject(item);
                const quantity = this.resolvePositiveNumber(itemObject.quantity, 1);
                const unitAmountInCents = this.resolvePositiveNumber(itemObject.unitAmount, 0) ||
                    this.resolvePositiveNumber(itemObject.unit_amount, 0) ||
                    this.resolvePositiveNumber(itemObject.totalAmount, 0) /
                        quantity ||
                    dtoIn.paymentTransaction.amount;
                return {
                    id: this.toNullableString(itemObject._id) ??
                        this.toNullableString(itemObject.id) ??
                        this.toNullableString(itemObject.itemRef) ??
                        this.toNullableString(itemObject.item_ref) ??
                        `item-${index + 1}`,
                    title: this.toNullableString(itemObject.name) ??
                        this.toNullableString(itemObject.title) ??
                        `Item ${index + 1}`,
                    description: this.toNullableString(itemObject.description) ?? undefined,
                    quantity,
                    unit_price: this.convertCentsToAmount(unitAmountInCents),
                    currency_id: dtoIn.paymentTransaction.currency,
                };
            })
            : [
                {
                    id: dtoIn.paymentTransaction._id,
                    title: this.toNullableString(checkoutSession.description) ??
                        `Pagamento ${dtoIn.paymentTransaction._id}`,
                    quantity: 1,
                    unit_price: this.convertCentsToAmount(dtoIn.paymentTransaction.amount),
                    currency_id: dtoIn.paymentTransaction.currency,
                },
            ];
        const payer = this.buildPreferencePayer(payerPayload);
        const payload = {
            items,
            external_reference: dtoIn.paymentTransaction.externalReference ??
                dtoIn.paymentTransaction._id,
            metadata: {
                paymentTransactionId: dtoIn.paymentTransaction._id,
                checkoutSessionId: dtoIn.paymentTransaction.checkoutSessionId,
                officeId: dtoIn.paymentTransaction.officeId,
                clientId: dtoIn.paymentTransaction.clientId,
            },
        };
        if (payer !== null) {
            payload.payer = payer;
        }
        const notificationUrl = this.resolveNotificationUrl(dtoIn);
        if (notificationUrl !== null) {
            payload.notification_url = notificationUrl;
        }
        const successUrl = this.toNullableString(checkoutSession.successUrl) ??
            this.toNullableString(checkoutSession.success_url);
        const cancelUrl = this.toNullableString(checkoutSession.cancelUrl) ??
            this.toNullableString(checkoutSession.cancel_url);
        if (successUrl !== null || cancelUrl !== null) {
            payload.back_urls = {};
            if (successUrl !== null) {
                payload.back_urls.success = successUrl;
                payload.back_urls.pending = successUrl;
            }
            if (cancelUrl !== null) {
                payload.back_urls.failure = cancelUrl;
            }
        }
        if (successUrl !== null) {
            payload.auto_return = 'approved';
        }
        this.applyMercadoPagoNativeSplitToPreferencePayload({
            dtoIn,
            payload,
        });
        return payload;
    }
    applyMercadoPagoNativeSplitToPaymentPayload(params) {
        const splitData = this.resolveMercadoPagoNativeSplitData(params.dtoIn);
        if (!splitData.enabled) {
            return;
        }
        const applicationFeeAmountInCents = splitData.applicationFeeAmountInCents ??
            splitData.marketplaceFeeAmountInCents;
        if (applicationFeeAmountInCents === null ||
            applicationFeeAmountInCents <= 0) {
            throw new Error('Mercado Pago native split requires applicationFeeAmountInCents for /v1/payments');
        }
        this.assertMercadoPagoFeeAmountIsValid({
            feeAmountInCents: applicationFeeAmountInCents,
            transactionAmountInCents: params.dtoIn.paymentTransaction.amount,
            field: 'application_fee',
        });
        params.payload.application_fee = this.convertCentsToAmount(applicationFeeAmountInCents);
        const metadata = this.asObject(params.payload.metadata);
        params.payload.metadata = {
            ...metadata,
            splitRequired: true,
            splitMode: 'mercado_pago_native_1_1',
            paymentSplitId: splitData.paymentSplitId,
            applicationFeeAmountInCents,
            applicationFeeAmount: this.convertCentsToAmount(applicationFeeAmountInCents),
        };
    }
    applyMercadoPagoNativeSplitToPreferencePayload(params) {
        const splitData = this.resolveMercadoPagoNativeSplitData(params.dtoIn);
        if (!splitData.enabled) {
            return;
        }
        const marketplaceFeeAmountInCents = splitData.marketplaceFeeAmountInCents ??
            splitData.applicationFeeAmountInCents;
        if (marketplaceFeeAmountInCents === null ||
            marketplaceFeeAmountInCents <= 0) {
            throw new Error('Mercado Pago native split requires marketplaceFeeAmountInCents for /checkout/preferences');
        }
        this.assertMercadoPagoFeeAmountIsValid({
            feeAmountInCents: marketplaceFeeAmountInCents,
            transactionAmountInCents: params.dtoIn.paymentTransaction.amount,
            field: 'marketplace_fee',
        });
        params.payload.marketplace_fee = this.convertCentsToAmount(marketplaceFeeAmountInCents);
        const metadata = this.asObject(params.payload.metadata);
        params.payload.metadata = {
            ...metadata,
            splitRequired: true,
            splitMode: 'mercado_pago_native_1_1',
            paymentSplitId: splitData.paymentSplitId,
            marketplaceFeeAmountInCents,
            marketplaceFeeAmount: this.convertCentsToAmount(marketplaceFeeAmountInCents),
        };
    }
    resolveMercadoPagoNativeSplitData(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const providerSplit = this.asObject(providerPayload.mercadoPagoSplit) ??
            this.asObject(providerPayload.mercado_pago_split) ??
            this.asObject(providerPayload.gatewaySplit) ??
            this.asObject(providerPayload.gateway_split) ??
            this.asObject(providerPayload.split);
        const transactionSplit = this.asObject(transactionConfig.mercadoPagoSplit) ??
            this.asObject(transactionConfig.mercado_pago_split) ??
            this.asObject(transactionConfig.gatewaySplit) ??
            this.asObject(transactionConfig.gateway_split) ??
            this.asObject(transactionConfig.split);
        const gatewaySplit = this.asObject(gatewayConfig.mercadoPagoSplit) ??
            this.asObject(gatewayConfig.mercado_pago_split) ??
            this.asObject(gatewayConfig.gatewaySplit) ??
            this.asObject(gatewayConfig.gateway_split) ??
            this.asObject(gatewayConfig.split);
        const credentialSplit = this.asObject(apiCredentialConfig.mercadoPagoSplit) ??
            this.asObject(apiCredentialConfig.mercado_pago_split) ??
            this.asObject(apiCredentialConfig.gatewaySplit) ??
            this.asObject(apiCredentialConfig.gateway_split) ??
            this.asObject(apiCredentialConfig.split);
        const splitObjects = [
            providerSplit,
            transactionSplit,
            gatewaySplit,
            credentialSplit,
        ];
        const enabled = dtoIn.paymentTransaction.hasSplit === true ||
            dtoIn.paymentTransaction.splitRequired === true ||
            splitObjects.some((item) => this.extractBoolean(item, 'enabled') === true) ||
            splitObjects.some((item) => this.extractBoolean(item, 'required') === true);
        if (!enabled) {
            return {
                enabled: false,
                marketplaceId: null,
                paymentSplitId: null,
                marketplaceFeeAmountInCents: null,
                applicationFeeAmountInCents: null,
            };
        }
        return {
            enabled: true,
            marketplaceId: this.firstStringFromObjects(splitObjects, [
                'marketplaceId',
                'marketplace_id',
                'marketplace',
            ]),
            paymentSplitId: this.firstStringFromObjects(splitObjects, [
                'paymentSplitId',
                'payment_split_id',
            ]) ??
                this.extractString(transactionSplit, 'paymentSplitId') ??
                this.extractString(transactionSplit, 'payment_split_id'),
            marketplaceFeeAmountInCents: this.firstIntegerFromObjects(splitObjects, [
                'marketplaceFeeAmountInCents',
                'marketplace_fee_amount_in_cents',
                'marketplaceFeeAmount',
                'marketplace_fee_amount',
                'platformCommissionAmount',
                'platform_commission_amount',
                'commissionAmount',
                'commission_amount',
                'platformAmount',
                'platform_amount',
            ]),
            applicationFeeAmountInCents: this.firstIntegerFromObjects(splitObjects, [
                'applicationFeeAmountInCents',
                'application_fee_amount_in_cents',
                'applicationFeeAmount',
                'application_fee_amount',
                'platformCommissionAmount',
                'platform_commission_amount',
                'commissionAmount',
                'commission_amount',
                'platformAmount',
                'platform_amount',
            ]),
        };
    }
    assertMercadoPagoFeeAmountIsValid(params) {
        if (!Number.isInteger(params.feeAmountInCents) ||
            params.feeAmountInCents <= 0) {
            throw new Error(`${params.field} must be an integer greater than zero`);
        }
        if (params.feeAmountInCents >= params.transactionAmountInCents) {
            throw new Error(`${params.field} must be lower than transaction amount`);
        }
    }
    firstStringFromObjects(objects, keys) {
        for (const object of objects) {
            for (const key of keys) {
                const value = this.extractString(object, key);
                if (value !== null) {
                    return value;
                }
            }
        }
        return null;
    }
    firstIntegerFromObjects(objects, keys) {
        for (const object of objects) {
            for (const key of keys) {
                const value = object[key];
                if (value === undefined || value === null) {
                    continue;
                }
                const numberValue = Number(value);
                if (Number.isInteger(numberValue) && numberValue > 0) {
                    return numberValue;
                }
            }
        }
        return null;
    }
    extractBoolean(object, key) {
        const value = object[key];
        if (value === true || value === false) {
            return value;
        }
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
                return true;
            }
            if (normalized === 'false' || normalized === '0' || normalized === 'no') {
                return false;
            }
        }
        if (typeof value === 'number') {
            if (value === 1) {
                return true;
            }
            if (value === 0) {
                return false;
            }
        }
        return null;
    }
    extractString(object, key) {
        const value = object[key];
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
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
    buildPreferencePayer(payerPayload) {
        const email = this.toNullableString(payerPayload.email);
        const name = this.toNullableString(payerPayload.name);
        const firstName = this.toNullableString(payerPayload.firstName);
        const lastName = this.toNullableString(payerPayload.lastName);
        const documentType = this.toNullableString(payerPayload.documentType);
        const documentValue = this.toNullableString(payerPayload.documentValue);
        const payer = {};
        if (email !== null) {
            payer.email = email;
        }
        if (firstName !== null) {
            payer.name = firstName;
        }
        if (lastName !== null) {
            payer.surname = lastName;
        }
        if (firstName === null && name !== null) {
            const nameParts = name.trim().split(/\s+/);
            payer.name = nameParts.shift() ?? name;
            if (nameParts.length > 0) {
                payer.surname = nameParts.join(' ');
            }
        }
        if (documentType !== null && documentValue !== null) {
            payer.identification = {
                type: documentType.toUpperCase(),
                number: documentValue.replace(/\D/g, ''),
            };
        }
        return Object.keys(payer).length > 0 ? payer : null;
    }
    isRetryableGatewayFailure(httpStatus) {
        return (httpStatus === 408 ||
            httpStatus === 409 ||
            httpStatus === 425 ||
            httpStatus === 429 ||
            httpStatus >= 500);
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
        const transactionDetails = params.responseBody.transaction_details;
        const boletoUrl = this.toNullableString(transactionDetails?.external_resource_url) ?? null;
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
            boletoUrl,
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
    mapSuccessfulPaymentLinkPreferenceResponse(params) {
        const preferenceId = this.toNullableString(params.responseBody.id);
        const checkoutUrl = this.resolvePreferenceCheckoutUrl({
            dtoIn: params.dtoIn,
            responseBody: params.responseBody,
        });
        return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
            success: true,
            provider: this.getProviderName(),
            gatewayTransactionId: preferenceId,
            gatewayStatus: 'pending',
            status: 'pending',
            processStatus: 'gateway_payment_link_created',
            processMessage: 'Mercado Pago payment link created successfully',
            providerRequest: params.requestPayload,
            providerResponse: params.responseBody,
            gatewayResponse: {
                httpStatus: params.httpStatus,
                ok: true,
                endpoint: '/checkout/preferences',
                preferenceId,
            },
            checkoutUrl,
            paidAt: null,
            authorizedAt: null,
            canceledAt: null,
            failedAt: null,
            refundedAt: null,
            expiresAt: params.dtoIn.paymentTransaction.expiresAt,
        });
    }
    resolveAccessToken(dtoIn) {
        const connectionData = dtoIn.apiCredential?.connectionData ?? {};
        const credentialConfig = dtoIn.apiCredential?.config ?? {};
        const config = dtoIn.config ?? {};
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const shouldPreferTestToken = this.isSandboxEnvironment(dtoIn) ||
            this.isMercadoPagoTestPayer(dtoIn) ||
            this.isMercadoPagoTestCardPayload(dtoIn);
        const testCandidates = [
            connectionData.testAccessToken,
            connectionData.test_access_token,
            connectionData.sandboxAccessToken,
            connectionData.sandbox_access_token,
            credentialConfig.testAccessToken,
            credentialConfig.test_access_token,
            credentialConfig.sandboxAccessToken,
            credentialConfig.sandbox_access_token,
            apiCredentialConfig.testAccessToken,
            apiCredentialConfig.test_access_token,
            apiCredentialConfig.sandboxAccessToken,
            apiCredentialConfig.sandbox_access_token,
        ];
        const defaultCandidates = [
            dtoIn.apiCredential?.token,
            connectionData.token,
            connectionData.accessToken,
            connectionData.access_token,
            connectionData.providerToken,
            connectionData.provider_token,
            credentialConfig.accessToken,
            credentialConfig.access_token,
            credentialConfig.providerToken,
            credentialConfig.provider_token,
            apiCredentialConfig.accessToken,
            apiCredentialConfig.access_token,
            apiCredentialConfig.providerToken,
            apiCredentialConfig.provider_token,
        ];
        const candidates = shouldPreferTestToken
            ? [...testCandidates, ...defaultCandidates]
            : [...defaultCandidates, ...testCandidates];
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
        const configuredDate = this.toNullableString(transactionConfig.dateOfExpiration) ??
            this.toNullableString(transactionConfig.date_of_expiration) ??
            this.toNullableString(gatewayConfig.dateOfExpiration) ??
            this.toNullableString(gatewayConfig.date_of_expiration) ??
            this.toNullableString(apiCredentialConfig.dateOfExpiration) ??
            this.toNullableString(apiCredentialConfig.date_of_expiration);
        const normalizedConfiguredDate = this.normalizeMercadoPagoDateOfExpiration(configuredDate);
        if (normalizedConfiguredDate !== null) {
            return normalizedConfiguredDate;
        }
        if (dtoIn.paymentTransaction.paymentMethod === 'pix' ||
            dtoIn.paymentTransaction.paymentMethod === 'boleto') {
            return this.buildFutureMercadoPagoExpirationDate(3);
        }
        return null;
    }
    normalizeMercadoPagoDateOfExpiration(value) {
        if (value === null) {
            return null;
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        const minimumDate = new Date();
        minimumDate.setDate(minimumDate.getDate() + 1);
        if (date.getTime() <= minimumDate.getTime()) {
            return null;
        }
        return value;
    }
    buildFutureMercadoPagoExpirationDate(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        date.setHours(23, 59, 59, 0);
        const year = date.getFullYear();
        const month = this.pad(date.getMonth() + 1);
        const day = this.pad(date.getDate());
        return `${year}-${month}-${day}T23:59:59.000-03:00`;
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
    validateMercadoPagoCredentialForTestScenario(dtoIn, accessToken) {
        const paymentMethod = dtoIn.paymentTransaction.paymentMethod;
        if (paymentMethod === 'payment_link') {
            return null;
        }
        const isTestScenario = this.isSandboxEnvironment(dtoIn) ||
            this.isMercadoPagoTestPayer(dtoIn) ||
            this.isMercadoPagoTestCardPayload(dtoIn);
        if (!isTestScenario) {
            return null;
        }
        if (!this.isMercadoPagoLiveAccessToken(accessToken)) {
            return null;
        }
        return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
            success: false,
            provider: this.getProviderName(),
            gatewayTransactionId: null,
            gatewayStatus: 'local_validation_failed',
            status: 'failed',
            processStatus: 'gateway_credential_invalid_for_test',
            processMessage: 'Mercado Pago TEST access token is required for sandbox/test PIX, boleto and credit_card payments',
            providerRequest: {
                paymentTransactionId: dtoIn.paymentTransaction._id,
                paymentMethod,
                externalReference: dtoIn.paymentTransaction.externalReference,
                environment: this.resolveMercadoPagoEnvironment(dtoIn),
            },
            providerResponse: {
                message: 'Current access token looks like a production/live credential, but this is a Mercado Pago test scenario. Use a TEST access token generated for the seller test account and generate cardToken with the matching TEST public key.',
            },
            gatewayResponse: {
                ok: false,
                endpoint: 'local-validation',
                provider: 'mercado_pago',
                reason: 'live_credentials_used_in_test_scenario',
            },
            failedAt: this.nowAsSqlDateTime(),
            expiresAt: dtoIn.paymentTransaction.expiresAt,
        });
    }
    isMercadoPagoLiveAccessToken(accessToken) {
        const normalized = accessToken.trim();
        return (normalized.startsWith('APP_USR-') || normalized.startsWith('APP_USR'));
    }
    isMercadoPagoTestPayer(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const payer = this.asObject(providerPayload.payer);
        const email = this.toNullableString(payer.email);
        return email !== null && email.toLowerCase().includes('@testuser.com');
    }
    isMercadoPagoTestCardPayload(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const paymentData = this.asObject(providerPayload.paymentData);
        const cardToken = this.toNullableString(paymentData.cardToken) ??
            this.toNullableString(paymentData.card_token) ??
            this.toNullableString(paymentData.token);
        return (cardToken !== null &&
            dtoIn.paymentTransaction.paymentMethod === 'credit_card');
    }
    resolveMercadoPagoEnvironment(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        return (this.toNullableString(transactionConfig.environment) ??
            this.toNullableString(transactionConfig.env) ??
            this.toNullableString(gatewayConfig.environment) ??
            this.toNullableString(gatewayConfig.env) ??
            this.toNullableString(apiCredentialConfig.environment) ??
            this.toNullableString(apiCredentialConfig.env) ??
            'local')
            .toLowerCase()
            .trim();
    }
    isSandboxEnvironment(dtoIn) {
        const environment = this.resolveMercadoPagoEnvironment(dtoIn);
        return [
            'local',
            'dev',
            'development',
            'sandbox',
            'test',
            'testing',
        ].includes(environment);
    }
    resolvePreferenceCheckoutUrl(params) {
        const initPoint = this.toNullableString(params.responseBody.init_point);
        const sandboxInitPoint = this.toNullableString(params.responseBody.sandbox_init_point);
        if (this.isSandboxEnvironment(params.dtoIn)) {
            return sandboxInitPoint ?? initPoint;
        }
        return initPoint ?? sandboxInitPoint;
    }
    convertCentsToAmount(amountInCents) {
        return Number((amountInCents / 100).toFixed(2));
    }
    resolvePositiveNumber(value, fallback) {
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue) || numberValue <= 0) {
            return fallback;
        }
        return numberValue;
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