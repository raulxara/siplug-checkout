"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfinityPayGatewayPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const gateway_payment_dto_out_1 = require("../../dtos/gateway-payment.dto-out");
let InfinityPayGatewayPaymentProvider = class InfinityPayGatewayPaymentProvider {
    getProviderName() {
        return 'infinity_pay';
    }
    supports(gatewayProvider) {
        const normalizedProvider = this.normalize(gatewayProvider);
        return [
            'infinitepay',
            'infinite_pay',
            'infinite-pay',
            'infinitypay',
            'infinity_pay',
            'infinity-pay',
        ]
            .map((alias) => this.normalize(alias))
            .includes(normalizedProvider);
    }
    async processPayment(dtoIn) {
        try {
            const requestPayload = this.buildPaymentLinkRequestPayload(dtoIn);
            const response = await fetch('https://api.checkout.infinitepay.io/links', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestPayload),
            });
            const responseBody = (await response.json().catch(() => ({
                message: 'InfinitePay returned a non JSON response',
            })));
            if (!response.ok) {
                return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                    success: false,
                    provider: this.getProviderName(),
                    gatewayTransactionId: requestPayload.order_nsu ?? null,
                    gatewayStatus: String(response.status),
                    status: 'failed',
                    processStatus: 'gateway_dispatch_failed',
                    processMessage: this.extractInfinitePayErrorMessage(responseBody) ??
                        `InfinitePay link request failed with status ${response.status}`,
                    providerRequest: requestPayload,
                    providerResponse: responseBody,
                    gatewayResponse: {
                        ok: false,
                        httpStatus: response.status,
                        endpoint: '/links',
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
                    gatewayTransactionId: requestPayload.order_nsu ?? null,
                    gatewayStatus: 'missing_checkout_url',
                    status: 'failed',
                    processStatus: 'gateway_dispatch_failed',
                    processMessage: 'InfinitePay did not return checkout url',
                    providerRequest: requestPayload,
                    providerResponse: responseBody,
                    gatewayResponse: {
                        ok: true,
                        httpStatus: response.status,
                        endpoint: '/links',
                        missingCheckoutUrl: true,
                    },
                    failedAt: this.nowAsSqlDateTime(),
                    expiresAt: dtoIn.paymentTransaction.expiresAt,
                });
            }
            const gatewayTransactionId = this.toNullableString(responseBody.order_nsu) ??
                requestPayload.order_nsu ??
                this.toNullableString(responseBody.slug) ??
                this.toNullableString(responseBody.invoice_slug) ??
                dtoIn.paymentTransaction._id;
            return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                success: true,
                provider: this.getProviderName(),
                gatewayTransactionId,
                gatewayStatus: 'created',
                status: 'pending',
                processStatus: 'gateway_pending',
                processMessage: 'InfinitePay checkout link created successfully',
                providerRequest: requestPayload,
                providerResponse: responseBody,
                gatewayResponse: {
                    ok: true,
                    httpStatus: response.status,
                    endpoint: '/links',
                    checkoutUrl,
                    orderNsu: requestPayload.order_nsu ?? null,
                    slug: this.toNullableString(responseBody.slug) ??
                        this.toNullableString(responseBody.invoice_slug),
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
                : 'error on InfinitePay payment provider';
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
    buildPaymentLinkRequestPayload(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const payerPayload = this.asObject(providerPayload.payer);
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        const handle = this.toNullableString(transactionConfig.handle) ??
            this.toNullableString(gatewayConfig.handle) ??
            this.toNullableString(apiCredentialConfig.handle) ??
            this.toNullableString(apiCredentialConfig.infiniteTag) ??
            this.toNullableString(apiCredentialConfig.infinite_tag);
        if (handle === null) {
            throw new Error('InfinitePay handle is required in api credential config');
        }
        const items = this.buildItems(dtoIn);
        if (items.length === 0) {
            throw new Error('InfinitePay requires at least one item');
        }
        const orderNsu = dtoIn.paymentTransaction.externalReference ??
            dtoIn.paymentTransaction.idempotencyKey ??
            dtoIn.paymentTransaction._id;
        const payload = {
            handle,
            items,
            order_nsu: orderNsu,
        };
        const redirectUrl = this.toNullableString(transactionConfig.redirectUrl) ??
            this.toNullableString(transactionConfig.redirect_url) ??
            this.toNullableString(gatewayConfig.redirectUrl) ??
            this.toNullableString(gatewayConfig.redirect_url) ??
            this.toNullableString(apiCredentialConfig.redirectUrl) ??
            this.toNullableString(apiCredentialConfig.redirect_url);
        if (redirectUrl !== null) {
            payload.redirect_url = redirectUrl;
        }
        const webhookUrl = this.toNullableString(transactionConfig.webhookUrl) ??
            this.toNullableString(transactionConfig.webhook_url) ??
            this.toNullableString(gatewayConfig.webhookUrl) ??
            this.toNullableString(gatewayConfig.webhook_url) ??
            this.toNullableString(apiCredentialConfig.webhookUrl) ??
            this.toNullableString(apiCredentialConfig.webhook_url);
        if (webhookUrl !== null) {
            payload.webhook_url = webhookUrl;
        }
        const customer = this.buildCustomer(payerPayload);
        if (customer !== null) {
            payload.customer = customer;
        }
        const address = this.buildAddress(payerPayload);
        if (address !== null) {
            payload.address = address;
        }
        return payload;
    }
    buildItems(dtoIn) {
        const providerPayload = dtoIn.providerPayload ?? {};
        const rawItems = providerPayload.items;
        if (!Array.isArray(rawItems)) {
            return [
                {
                    quantity: 1,
                    price: dtoIn.paymentTransaction.amount,
                    description: dtoIn.paymentTransaction.externalReference ??
                        `Pagamento ${dtoIn.paymentTransaction._id}`,
                },
            ];
        }
        return rawItems
            .map((item) => this.asObject(item))
            .filter((item) => Object.keys(item).length > 0)
            .map((item) => {
            const quantity = this.toPositiveInteger(item.quantity) ?? 1;
            const price = this.toPositiveInteger(item.unitAmount) ??
                this.toPositiveInteger(item.unit_amount) ??
                this.toPositiveInteger(item.price) ??
                this.toPositiveInteger(item.totalAmount) ??
                this.toPositiveInteger(item.total_amount) ??
                dtoIn.paymentTransaction.amount;
            const description = this.toNullableString(item.name) ??
                this.toNullableString(item.description) ??
                `Item ${dtoIn.paymentTransaction._id}`;
            return {
                quantity,
                price,
                description,
            };
        });
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
        const phoneNumber = this.toNullableString(payerPayload.phoneNumber) ??
            this.toNullableString(payerPayload.phone_number) ??
            this.toNullableString(payerPayload.phone);
        const customer = {};
        if (name !== '') {
            customer.name = name;
        }
        if (email !== null) {
            customer.email = email;
        }
        if (phoneNumber !== null) {
            customer.phone_number = phoneNumber;
        }
        return Object.keys(customer).length > 0 ? customer : null;
    }
    buildAddress(payerPayload) {
        const addressPayload = this.asObject(payerPayload.address);
        const cep = this.toNullableString(addressPayload.cep) ??
            this.toNullableString(addressPayload.zipCode) ??
            this.toNullableString(addressPayload.zip_code);
        const street = this.toNullableString(addressPayload.street) ??
            this.toNullableString(addressPayload.streetName) ??
            this.toNullableString(addressPayload.street_name);
        const neighborhood = this.toNullableString(addressPayload.neighborhood);
        const number = this.toNullableString(addressPayload.number) ??
            this.toNullableString(addressPayload.streetNumber) ??
            this.toNullableString(addressPayload.street_number);
        const complement = this.toNullableString(addressPayload.complement);
        const address = {};
        if (cep !== null) {
            address.cep = cep.replace(/\D/g, '');
        }
        if (street !== null) {
            address.street = street;
        }
        if (neighborhood !== null) {
            address.neighborhood = neighborhood;
        }
        if (number !== null) {
            address.number = number;
        }
        if (complement !== null) {
            address.complement = complement;
        }
        return Object.keys(address).length > 0 ? address : null;
    }
    extractCheckoutUrl(responseBody) {
        const data = this.asObject(responseBody.data);
        return (this.toNullableString(responseBody.url) ??
            this.toNullableString(responseBody.link) ??
            this.toNullableString(responseBody.checkout_url) ??
            this.toNullableString(responseBody.payment_url) ??
            this.toNullableString(data.url) ??
            this.toNullableString(data.link) ??
            this.toNullableString(data.checkout_url) ??
            this.toNullableString(data.payment_url));
    }
    extractInfinitePayErrorMessage(responseBody) {
        return (this.toNullableString(responseBody.message) ??
            this.toNullableString(responseBody.error));
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
exports.InfinityPayGatewayPaymentProvider = InfinityPayGatewayPaymentProvider;
exports.InfinityPayGatewayPaymentProvider = InfinityPayGatewayPaymentProvider = __decorate([
    (0, common_1.Injectable)()
], InfinityPayGatewayPaymentProvider);
//# sourceMappingURL=infinity-pay-gateway-payment.provider.js.map