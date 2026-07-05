"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagSeguroGatewayPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const gateway_payment_dto_out_1 = require("../../dtos/gateway-payment.dto-out");
let PagSeguroGatewayPaymentProvider = class PagSeguroGatewayPaymentProvider {
    getProviderName() {
        return 'pagseguro';
    }
    supports(gatewayProvider) {
        const normalizedProvider = this.normalize(gatewayProvider);
        return ['pagseguro', 'pag_bank', 'pagbank', 'pag-seguro', 'pag_bank_checkout']
            .map((alias) => this.normalize(alias))
            .includes(normalizedProvider);
    }
    async processPayment(dtoIn) {
        try {
            if (dtoIn.paymentTransaction.paymentMethod === 'payment_link') {
                return this.processHostedCheckout(dtoIn);
            }
            if (dtoIn.paymentTransaction.paymentMethod === 'pix' ||
                dtoIn.paymentTransaction.paymentMethod === 'boleto' ||
                dtoIn.paymentTransaction.paymentMethod === 'credit_card') {
                return this.processTransparentOrder(dtoIn);
            }
            return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                success: false,
                provider: this.getProviderName(),
                gatewayTransactionId: null,
                gatewayStatus: null,
                status: 'failed',
                processStatus: 'gateway_payment_method_not_implemented',
                processMessage: `PagSeguro provider does not support payment method ${dtoIn.paymentTransaction.paymentMethod}`,
                providerRequest: {
                    paymentTransactionId: dtoIn.paymentTransaction._id,
                    paymentMethod: dtoIn.paymentTransaction.paymentMethod,
                },
                providerResponse: {
                    message: 'payment method not implemented for PagSeguro adapter',
                },
                gatewayResponse: null,
                failedAt: this.nowAsSqlDateTime(),
                expiresAt: dtoIn.paymentTransaction.expiresAt,
            });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on PagSeguro payment provider';
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
    async processTransparentOrder(dtoIn) {
        const accessToken = this.resolveAccessToken(dtoIn);
        const baseUrl = this.resolveBaseUrl(dtoIn);
        const requestPayload = this.buildOrderRequestPayload(dtoIn);
        const response = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        });
        const responseBody = (await response.json().catch(() => ({
            message: 'PagSeguro returned a non JSON response',
        })));
        if (!response.ok) {
            return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                success: false,
                provider: this.getProviderName(),
                gatewayTransactionId: this.extractPagSeguroOrderGatewayTransactionId(responseBody) ??
                    requestPayload.reference_id,
                gatewayStatus: this.extractPagSeguroOrderGatewayStatus(responseBody) ??
                    String(response.status),
                status: 'failed',
                processStatus: 'gateway_dispatch_failed',
                processMessage: this.extractPagSeguroOrderErrorMessage(responseBody) ??
                    `PagSeguro order request failed with status ${response.status}`,
                providerRequest: requestPayload,
                providerResponse: responseBody,
                gatewayResponse: {
                    ok: false,
                    httpStatus: response.status,
                    endpoint: '/orders',
                },
                failedAt: this.nowAsSqlDateTime(),
                expiresAt: dtoIn.paymentTransaction.expiresAt,
            });
        }
        return this.mapSuccessfulPagSeguroOrderResponse({
            dtoIn,
            requestPayload,
            responseBody,
            httpStatus: response.status,
        });
    }
    buildOrderRequestPayload(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const providerPayload = dtoIn.providerPayload ?? {};
        const payerPayload = this.asObject(providerPayload.payer);
        const referenceId = dtoIn.paymentTransaction.externalReference ??
            dtoIn.paymentTransaction.idempotencyKey ??
            dtoIn.paymentTransaction._id;
        const payload = {
            reference_id: referenceId,
            items: this.buildItems(dtoIn),
        };
        const customer = this.buildCustomer(payerPayload);
        if (customer !== null) {
            payload.customer = customer;
        }
        const notificationUrl = this.toNullableString(transactionConfig.notificationUrl) ??
            this.toNullableString(transactionConfig.notification_url) ??
            this.toNullableString(gatewayConfig.notificationUrl) ??
            this.toNullableString(gatewayConfig.notification_url) ??
            this.toNullableString(apiCredentialConfig.notificationUrl) ??
            this.toNullableString(apiCredentialConfig.notification_url);
        if (notificationUrl !== null) {
            payload.notification_urls = [notificationUrl];
        }
        if (dtoIn.paymentTransaction.paymentMethod === 'pix') {
            payload.qr_codes = [
                {
                    amount: {
                        value: dtoIn.paymentTransaction.amount,
                    },
                },
            ];
            return payload;
        }
        if (dtoIn.paymentTransaction.paymentMethod === 'boleto') {
            payload.charges = [
                this.buildBoletoCharge({
                    dtoIn,
                    referenceId,
                    payerPayload,
                }),
            ];
            return payload;
        }
        if (dtoIn.paymentTransaction.paymentMethod === 'credit_card') {
            payload.charges = [
                this.buildCreditCardCharge({
                    dtoIn,
                    referenceId,
                    payerPayload,
                }),
            ];
            return payload;
        }
        throw new Error(`PagSeguro transparent order does not support payment method ${dtoIn.paymentTransaction.paymentMethod}`);
    }
    buildCreditCardCharge(params) {
        const providerPayload = params.dtoIn.providerPayload ?? {};
        const paymentData = this.asObject(providerPayload.paymentData);
        const encryptedCard = this.toNullableString(paymentData.encryptedCard) ??
            this.toNullableString(paymentData.encrypted_card);
        if (encryptedCard === null) {
            throw new Error('paymentData.encryptedCard is required for PagSeguro credit card');
        }
        const holderName = this.toNullableString(params.payerPayload.name) ?? 'Cliente';
        const holderTaxId = this.toNullableString(params.payerPayload.documentValue) ??
            this.toNullableString(params.payerPayload.taxId) ??
            this.toNullableString(params.payerPayload.tax_id);
        if (holderTaxId === null) {
            throw new Error('payer.documentValue is required for PagSeguro credit card');
        }
        const installments = params.dtoIn.paymentTransaction.installments ?? 1;
        return {
            reference_id: params.referenceId,
            description: params.dtoIn.paymentTransaction.externalReference ??
                `Pagamento ${params.dtoIn.paymentTransaction._id}`,
            amount: {
                value: params.dtoIn.paymentTransaction.amount,
                currency: params.dtoIn.paymentTransaction.currency ?? 'BRL',
            },
            payment_method: {
                type: 'CREDIT_CARD',
                installments,
                capture: true,
                card: {
                    encrypted: encryptedCard,
                },
                holder: {
                    name: holderName,
                    tax_id: holderTaxId.replace(/\D/g, ''),
                },
            },
        };
    }
    buildBoletoCharge(params) {
        const dueDate = this.resolveDateOnly(params.dtoIn) ??
            this.formatDateOnlyFromNow(3);
        const holderName = this.toNullableString(params.payerPayload.name) ?? 'Cliente';
        const holderTaxId = this.toNullableString(params.payerPayload.documentValue) ??
            this.toNullableString(params.payerPayload.taxId) ??
            this.toNullableString(params.payerPayload.tax_id);
        if (holderTaxId === null) {
            throw new Error('payer.documentValue is required for PagSeguro boleto');
        }
        const holderAddress = this.buildBoletoHolderAddress(params.payerPayload);
        return {
            reference_id: params.referenceId,
            description: params.dtoIn.paymentTransaction.externalReference ??
                `Pagamento ${params.dtoIn.paymentTransaction._id}`,
            amount: {
                value: params.dtoIn.paymentTransaction.amount,
                currency: params.dtoIn.paymentTransaction.currency ?? 'BRL',
            },
            payment_method: {
                type: 'BOLETO',
                boleto: {
                    due_date: dueDate,
                    instruction_lines: {
                        line_1: 'Pagamento processado pela SiPlug',
                        line_2: 'Não receber após o vencimento',
                    },
                    holder: {
                        name: holderName,
                        tax_id: holderTaxId.replace(/\D/g, ''),
                        email: this.toNullableString(params.payerPayload.email),
                        address: holderAddress,
                    },
                },
            },
        };
    }
    buildBoletoHolderAddress(payerPayload) {
        const addressPayload = this.asObject(payerPayload.address);
        const street = this.toNullableString(addressPayload.street) ??
            this.toNullableString(addressPayload.streetName) ??
            this.toNullableString(addressPayload.street_name);
        const number = this.toNullableString(addressPayload.number) ??
            this.toNullableString(addressPayload.streetNumber) ??
            this.toNullableString(addressPayload.street_number);
        const locality = this.toNullableString(addressPayload.locality) ??
            this.toNullableString(addressPayload.neighborhood) ??
            this.toNullableString(addressPayload.district);
        const city = this.toNullableString(addressPayload.city) ??
            this.toNullableString(addressPayload.localidade);
        const region = this.toNullableString(addressPayload.region) ??
            this.toNullableString(addressPayload.regionCode) ??
            this.toNullableString(addressPayload.region_code) ??
            this.toNullableString(addressPayload.federalUnit) ??
            this.toNullableString(addressPayload.federal_unit) ??
            this.toNullableString(addressPayload.state);
        const postalCode = this.toNullableString(addressPayload.postalCode) ??
            this.toNullableString(addressPayload.postal_code) ??
            this.toNullableString(addressPayload.zipCode) ??
            this.toNullableString(addressPayload.zip_code) ??
            this.toNullableString(addressPayload.cep);
        const complement = this.toNullableString(addressPayload.complement);
        if (street === null) {
            throw new Error('payer.address.streetName is required for PagSeguro boleto');
        }
        if (number === null) {
            throw new Error('payer.address.streetNumber is required for PagSeguro boleto');
        }
        if (locality === null) {
            throw new Error('payer.address.neighborhood is required for PagSeguro boleto');
        }
        if (city === null) {
            throw new Error('payer.address.city is required for PagSeguro boleto');
        }
        if (region === null) {
            throw new Error('payer.address.federalUnit is required for PagSeguro boleto');
        }
        if (postalCode === null) {
            throw new Error('payer.address.zipCode is required for PagSeguro boleto');
        }
        const cleanRegion = region.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
        const address = {
            street: this.cleanPagSeguroAddressText(street),
            number: this.cleanPagSeguroAddressText(number),
            locality: this.cleanPagSeguroAddressText(locality),
            city: this.cleanPagSeguroAddressText(city),
            region: cleanRegion,
            region_code: cleanRegion,
            country: 'BRA',
            postal_code: postalCode.replace(/\D/g, ''),
        };
        if (complement !== null) {
            address.complement = this.cleanPagSeguroAddressText(complement);
        }
        return address;
    }
    cleanPagSeguroAddressText(value) {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    buildCheckoutRequestPayload(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const providerPayload = dtoIn.providerPayload ?? {};
        const payerPayload = this.asObject(providerPayload.payer);
        const referenceId = dtoIn.paymentTransaction.externalReference ??
            dtoIn.paymentTransaction.idempotencyKey ??
            dtoIn.paymentTransaction._id;
        const payload = {
            reference_id: referenceId,
            customer_modifiable: true,
            items: this.buildItems(dtoIn),
        };
        const customer = this.buildCustomer(payerPayload);
        if (customer !== null) {
            payload.customer = customer;
        }
        const redirectUrl = this.toNullableString(transactionConfig.redirectUrl) ??
            this.toNullableString(transactionConfig.redirect_url) ??
            this.toNullableString(gatewayConfig.redirectUrl) ??
            this.toNullableString(gatewayConfig.redirect_url) ??
            this.toNullableString(apiCredentialConfig.redirectUrl) ??
            this.toNullableString(apiCredentialConfig.redirect_url);
        if (redirectUrl !== null) {
            payload.redirect_url = redirectUrl;
            payload.return_url = redirectUrl;
        }
        const notificationUrl = this.resolvePagSeguroCheckoutNotificationUrl({
            transactionConfig,
            gatewayConfig,
            apiCredentialConfig,
            fallbackKeys: ['notificationUrl', 'notification_url'],
        });
        if (notificationUrl !== null) {
            payload.notification_urls = [notificationUrl];
        }
        const paymentNotificationUrl = this.resolvePagSeguroCheckoutNotificationUrl({
            transactionConfig,
            gatewayConfig,
            apiCredentialConfig,
            fallbackKeys: [
                'paymentNotificationUrl',
                'payment_notification_url',
                'notificationUrl',
                'notification_url',
            ],
        });
        if (paymentNotificationUrl !== null) {
            payload.payment_notification_urls = [paymentNotificationUrl];
        }
        const expirationDate = this.toNullableString(transactionConfig.expirationDate) ??
            this.toNullableString(transactionConfig.expiration_date) ??
            this.toNullableString(gatewayConfig.expirationDate) ??
            this.toNullableString(gatewayConfig.expiration_date) ??
            this.toNullableString(apiCredentialConfig.expirationDate) ??
            this.toNullableString(apiCredentialConfig.expiration_date);
        if (expirationDate !== null) {
            payload.expiration_date = expirationDate;
        }
        const paymentMethods = this.resolvePaymentMethods(dtoIn);
        if (paymentMethods.length > 0) {
            payload.payment_methods = paymentMethods.map((method) => ({
                type: method,
            }));
        }
        return payload;
    }
    async processHostedCheckout(dtoIn) {
        try {
            if (dtoIn.paymentTransaction.paymentMethod !== 'payment_link') {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: null,
                    gatewayStatus: null,
                    status: 'failed',
                    processStatus: 'gateway_payment_method_not_implemented',
                    processMessage: `PagSeguro provider does not support payment method ${dtoIn.paymentTransaction.paymentMethod} in this adapter`,
                    providerRequest: {
                        paymentTransactionId: dtoIn.paymentTransaction._id,
                        paymentMethod: dtoIn.paymentTransaction.paymentMethod,
                    },
                    providerResponse: {
                        message: 'payment method not implemented for PagSeguro adapter',
                    },
                    gatewayResponse: null,
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            const accessToken = this.resolveAccessToken(dtoIn);
            const baseUrl = this.resolveBaseUrl(dtoIn);
            const requestPayload = this.buildCheckoutRequestPayload(dtoIn);
            const response = await fetch(`${baseUrl}/checkouts`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestPayload),
            });
            const responseBody = (await response.json().catch(() => ({
                message: 'PagSeguro returned a non JSON response',
            })));
            if (!response.ok) {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: this.toNullableString(responseBody.id) ??
                        requestPayload.reference_id,
                    gatewayStatus: this.toNullableString(responseBody.status) ?? String(response.status),
                    status: 'failed',
                    processStatus: 'gateway_dispatch_failed',
                    processMessage: this.extractPagSeguroErrorMessage(responseBody) ??
                        `PagSeguro checkout request failed with status ${response.status}`,
                    providerRequest: requestPayload,
                    providerResponse: responseBody,
                    gatewayResponse: {
                        ok: false,
                        httpStatus: response.status,
                        endpoint: '/checkouts',
                    },
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            const checkoutUrl = this.extractCheckoutUrl(responseBody);
            if (checkoutUrl === null) {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: this.toNullableString(responseBody.id) ??
                        requestPayload.reference_id,
                    gatewayStatus: 'missing_checkout_url',
                    status: 'failed',
                    processStatus: 'gateway_dispatch_failed',
                    processMessage: 'PagSeguro did not return checkout url',
                    providerRequest: requestPayload,
                    providerResponse: responseBody,
                    gatewayResponse: {
                        ok: true,
                        httpStatus: response.status,
                        endpoint: '/checkouts',
                        missingCheckoutUrl: true,
                    },
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            const gatewayTransactionId = this.toNullableString(responseBody.id) ?? requestPayload.reference_id;
            return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                success: true,
                provider: this.getProviderName(),
                gatewayTransactionId,
                gatewayStatus: this.toNullableString(responseBody.status) ?? 'created',
                status: 'pending',
                processStatus: 'gateway_pending',
                processMessage: 'PagSeguro checkout link created successfully',
                providerRequest: requestPayload,
                providerResponse: responseBody,
                gatewayResponse: {
                    ok: true,
                    httpStatus: response.status,
                    endpoint: '/checkouts',
                    checkoutId: responseBody.id ?? null,
                    referenceId: responseBody.reference_id ?? requestPayload.reference_id,
                    checkoutUrl,
                },
                qrCode: null,
                qrCodeBase64: null,
                boletoUrl: null,
                checkoutUrl,
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
                : 'error on PagSeguro payment provider';
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
    buildItems(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const rawItems = providerPayload.items;
        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            return [
                {
                    reference_id: dtoIn.paymentTransaction._id,
                    name: dtoIn.paymentTransaction.externalReference ??
                        `Pagamento ${dtoIn.paymentTransaction._id}`,
                    quantity: 1,
                    unit_amount: dtoIn.paymentTransaction.amount,
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
                this.toPositiveInteger(item.totalAmount) ??
                this.toPositiveInteger(item.total_amount) ??
                dtoIn.paymentTransaction.amount;
            return {
                reference_id: this.toNullableString(item.itemRef) ??
                    this.toNullableString(item.item_ref) ??
                    this.toNullableString(item._id) ??
                    dtoIn.paymentTransaction._id,
                name: this.toNullableString(item.name) ??
                    this.toNullableString(item.description) ??
                    `Item ${dtoIn.paymentTransaction._id}`,
                quantity,
                unit_amount: unitAmount,
            };
        });
    }
    resolvePagSeguroCheckoutNotificationUrl(params) {
        const specificCandidates = [
            this.toNullableString(params.transactionConfig.checkoutNotificationUrl),
            this.toNullableString(params.transactionConfig.checkout_notification_url),
            this.toNullableString(params.transactionConfig.hostedCheckoutNotificationUrl),
            this.toNullableString(params.transactionConfig.hosted_checkout_notification_url),
            this.toNullableString(params.gatewayConfig.checkoutNotificationUrl),
            this.toNullableString(params.gatewayConfig.checkout_notification_url),
            this.toNullableString(params.gatewayConfig.hostedCheckoutNotificationUrl),
            this.toNullableString(params.gatewayConfig.hosted_checkout_notification_url),
            this.toNullableString(params.apiCredentialConfig.checkoutNotificationUrl),
            this.toNullableString(params.apiCredentialConfig.checkout_notification_url),
            this.toNullableString(params.apiCredentialConfig.hostedCheckoutNotificationUrl),
            this.toNullableString(params.apiCredentialConfig.hosted_checkout_notification_url),
        ];
        const fallbackCandidates = params.fallbackKeys.flatMap((key) => [
            this.toNullableString(params.transactionConfig[key]),
            this.toNullableString(params.gatewayConfig[key]),
            this.toNullableString(params.apiCredentialConfig[key]),
        ]);
        const url = specificCandidates.find((candidate) => candidate !== null) ??
            fallbackCandidates.find((candidate) => candidate !== null) ??
            null;
        return this.normalizePagSeguroCheckoutNotificationUrl(url);
    }
    normalizePagSeguroCheckoutNotificationUrl(url) {
        if (url === null) {
            return null;
        }
        const normalizedUrl = url.trim();
        if (normalizedUrl === '') {
            return null;
        }
        if (normalizedUrl.length > 100) {
            return null;
        }
        return normalizedUrl;
    }
    buildCustomer(payerPayload) {
        const name = this.toNullableString(payerPayload.name) ??
            [
                this.toNullableString(payerPayload.firstName),
                this.toNullableString(payerPayload.lastName),
            ]
                .filter((item) => item !== null)
                .join(' ')
                .trim();
        const email = this.toNullableString(payerPayload.email);
        const documentValue = this.toNullableString(payerPayload.documentValue) ??
            this.toNullableString(payerPayload.taxId) ??
            this.toNullableString(payerPayload.tax_id);
        const customer = {};
        if (name !== '') {
            customer.name = name;
        }
        if (email !== null) {
            customer.email = email;
        }
        if (documentValue !== null) {
            customer.tax_id = documentValue.replace(/\D/g, '');
        }
        const phone = this.buildPhone(payerPayload);
        if (phone !== null) {
            customer.phones = [phone];
        }
        return Object.keys(customer).length > 0 ? customer : null;
    }
    buildPhone(payerPayload) {
        const rawPhone = this.toNullableString(payerPayload.phoneNumber) ??
            this.toNullableString(payerPayload.phone_number) ??
            this.toNullableString(payerPayload.phone);
        if (rawPhone === null) {
            return null;
        }
        const digits = rawPhone.replace(/\D/g, '');
        if (digits.length < 10) {
            return null;
        }
        const withoutCountry = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
        return {
            country: '55',
            area: withoutCountry.slice(0, 2),
            number: withoutCountry.slice(2),
            type: 'MOBILE',
        };
    }
    resolvePaymentMethods(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const allowed = this.asStringArray(transactionConfig.pagSeguroPaymentMethods) ??
            this.asStringArray(transactionConfig.pagseguroPaymentMethods) ??
            this.asStringArray(transactionConfig.allowedPaymentMethods) ??
            this.asStringArray(apiCredentialConfig.pagSeguroPaymentMethods) ??
            this.asStringArray(apiCredentialConfig.pagseguroPaymentMethods);
        if (allowed !== null) {
            return allowed;
        }
        return [];
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
            throw new Error('PagSeguro token is required in api credential connection data');
        }
        return token;
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
        return baseUrl ?? 'https://sandbox.api.pagseguro.com';
    }
    mapSuccessfulPagSeguroOrderResponse(params) {
        const charge = this.extractFirstCharge(params.responseBody);
        const qrCode = this.extractFirstQrCode(params.responseBody);
        const gatewayTransactionId = this.toNullableString(charge?.id) ??
            this.toNullableString(params.responseBody.id) ??
            params.requestPayload.reference_id;
        const gatewayStatus = this.toNullableString(charge?.status) ??
            this.toNullableString(params.responseBody.status) ??
            'created';
        const internalStatus = this.mapPagSeguroStatusToInternalStatus(gatewayStatus);
        const processStatus = this.mapPagSeguroStatusToProcessStatus(gatewayStatus);
        const pixText = this.toNullableString(qrCode?.text) ??
            null;
        const qrCodeUrl = this.extractLinkFromLinks(qrCode?.links, [
            'QRCODE',
            'QR_CODE',
            'PNG',
        ]);
        const boletoUrl = this.extractLinkFromLinks(charge?.links, [
            'BOLETO',
            'PAY',
            'PDF',
        ]);
        return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
            success: true,
            provider: this.getProviderName(),
            gatewayTransactionId,
            gatewayStatus,
            status: internalStatus,
            processStatus,
            processMessage: `PagSeguro payment returned status ${gatewayStatus}`,
            providerRequest: params.requestPayload,
            providerResponse: params.responseBody,
            gatewayResponse: {
                ok: true,
                httpStatus: params.httpStatus,
                endpoint: '/orders',
                orderId: params.responseBody.id ?? null,
                chargeId: charge?.id ?? null,
                referenceId: params.responseBody.reference_id ?? params.requestPayload.reference_id,
                paymentMethod: params.dtoIn.paymentTransaction.paymentMethod,
            },
            qrCode: pixText,
            qrCodeBase64: null,
            boletoUrl,
            checkoutUrl: params.dtoIn.paymentTransaction.paymentMethod === 'pix'
                ? qrCodeUrl
                : boletoUrl,
            paidAt: internalStatus === 'paid' ? this.nowAsSqlDateTime() : null,
            authorizedAt: internalStatus === 'authorized' ? this.nowAsSqlDateTime() : null,
            canceledAt: internalStatus === 'canceled' ? this.nowAsSqlDateTime() : null,
            failedAt: internalStatus === 'failed' ? this.nowAsSqlDateTime() : null,
            refundedAt: internalStatus === 'refunded' ? this.nowAsSqlDateTime() : null,
            expiresAt: params.dtoIn.paymentTransaction.expiresAt,
        });
    }
    extractFirstCharge(responseBody) {
        if (!Array.isArray(responseBody.charges) || responseBody.charges.length === 0) {
            return null;
        }
        return responseBody.charges[0] ?? null;
    }
    extractFirstQrCode(responseBody) {
        if (!Array.isArray(responseBody.qr_codes) || responseBody.qr_codes.length === 0) {
            return null;
        }
        return responseBody.qr_codes[0] ?? null;
    }
    extractPagSeguroOrderGatewayTransactionId(responseBody) {
        const charge = this.extractFirstCharge(responseBody);
        return (this.toNullableString(charge?.id) ??
            this.toNullableString(responseBody.id));
    }
    extractPagSeguroOrderGatewayStatus(responseBody) {
        const charge = this.extractFirstCharge(responseBody);
        return (this.toNullableString(charge?.status) ??
            this.toNullableString(responseBody.status));
    }
    extractPagSeguroOrderErrorMessage(responseBody) {
        if (Array.isArray(responseBody.error_messages) &&
            responseBody.error_messages.length > 0) {
            const firstError = responseBody.error_messages[0];
            return (this.toNullableString(firstError.description) ??
                this.toNullableString(firstError.code));
        }
        return this.toNullableString(responseBody.message);
    }
    extractLinkFromLinks(links, preferredRels) {
        if (!Array.isArray(links)) {
            return null;
        }
        const normalizedPreferredRels = preferredRels.map((rel) => this.normalize(rel));
        const preferredLink = links
            .map((link) => this.asObject(link))
            .find((link) => {
            const rel = this.normalize(String(link.rel ?? ''));
            const media = this.normalize(String(link.media ?? ''));
            const type = this.normalize(String(link.type ?? ''));
            return normalizedPreferredRels.some((preferredRel) => rel.includes(preferredRel) ||
                media.includes(preferredRel) ||
                type.includes(preferredRel));
        });
        return (this.toNullableString(preferredLink?.href) ??
            links
                .map((link) => this.toNullableString(this.asObject(link).href))
                .find((href) => href !== null) ??
            null);
    }
    mapPagSeguroStatusToInternalStatus(gatewayStatus) {
        const status = this.normalize(gatewayStatus);
        if (['paid', 'approved', 'captured'].includes(status)) {
            return 'paid';
        }
        if (['authorized'].includes(status)) {
            return 'authorized';
        }
        if ([
            'created',
            'active',
            'waiting',
            'waiting_payment',
            'pending',
            'in_analysis',
            'processing',
        ].includes(status)) {
            return 'pending';
        }
        if (['declined', 'denied', 'failed'].includes(status)) {
            return 'failed';
        }
        if (['canceled', 'cancelled', 'expired'].includes(status)) {
            return 'canceled';
        }
        if (['refunded'].includes(status)) {
            return 'refunded';
        }
        return 'processing';
    }
    mapPagSeguroStatusToProcessStatus(gatewayStatus) {
        const status = this.normalize(gatewayStatus);
        if (['paid', 'approved', 'captured'].includes(status)) {
            return 'gateway_approved';
        }
        if (['authorized'].includes(status)) {
            return 'gateway_authorized';
        }
        if ([
            'created',
            'active',
            'waiting',
            'waiting_payment',
            'pending',
            'in_analysis',
            'processing',
        ].includes(status)) {
            return 'gateway_pending';
        }
        if (['declined', 'denied', 'failed'].includes(status)) {
            return 'gateway_rejected';
        }
        if (['canceled', 'cancelled', 'expired'].includes(status)) {
            return 'gateway_cancelled';
        }
        if (['refunded'].includes(status)) {
            return 'gateway_refunded';
        }
        return 'gateway_dispatched';
    }
    resolveDateOnly(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const value = this.toNullableString(transactionConfig.dueDate) ??
            this.toNullableString(transactionConfig.due_date) ??
            this.toNullableString(transactionConfig.dateOfExpiration) ??
            this.toNullableString(transactionConfig.date_of_expiration) ??
            this.toNullableString(gatewayConfig.dueDate) ??
            this.toNullableString(gatewayConfig.due_date) ??
            this.toNullableString(apiCredentialConfig.dueDate) ??
            this.toNullableString(apiCredentialConfig.due_date);
        if (value === null) {
            return null;
        }
        return value.slice(0, 10);
    }
    formatDateOnlyFromNow(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        const year = date.getFullYear();
        const month = this.pad(date.getMonth() + 1);
        const day = this.pad(date.getDate());
        return `${year}-${month}-${day}`;
    }
    extractCheckoutUrl(responseBody) {
        const links = Array.isArray(responseBody.links) ? responseBody.links : [];
        const payLink = links.find((link) => this.normalize(String(link.rel ?? '')) === 'pay');
        return (this.toNullableString(payLink?.href) ??
            links
                .map((link) => this.toNullableString(link.href))
                .find((href) => href !== null) ??
            null);
    }
    extractPagSeguroErrorMessage(responseBody) {
        if (Array.isArray(responseBody.error_messages) &&
            responseBody.error_messages.length > 0) {
            const firstError = responseBody.error_messages[0];
            return (this.toNullableString(firstError.description) ??
                this.toNullableString(firstError.code));
        }
        return this.toNullableString(responseBody.message);
    }
    asStringArray(value) {
        if (!Array.isArray(value)) {
            return null;
        }
        const items = value
            .map((item) => this.toNullableString(item))
            .filter((item) => item !== null);
        return items.length > 0 ? items : null;
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
exports.PagSeguroGatewayPaymentProvider = PagSeguroGatewayPaymentProvider;
exports.PagSeguroGatewayPaymentProvider = PagSeguroGatewayPaymentProvider = __decorate([
    (0, common_1.Injectable)()
], PagSeguroGatewayPaymentProvider);
//# sourceMappingURL=pagseguro-gateway-payment.provider.js.map