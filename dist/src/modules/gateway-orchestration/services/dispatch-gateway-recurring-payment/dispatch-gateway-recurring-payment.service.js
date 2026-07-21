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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchGatewayRecurringPaymentService = void 0;
const common_1 = require("@nestjs/common");
const gateway_recurring_payment_dto_out_1 = require("../../dtos/gateway-recurring-payment.dto-out");
const mercado_pago_recurring_payment_provider_1 = require("../../providers/mercado-pago/mercado-pago-recurring-payment.provider");
const stripe_recurring_payment_provider_1 = require("../../providers/stripe/stripe-recurring-payment.provider");
const paypal_recurring_payment_provider_1 = require("../../providers/paypal/paypal-recurring-payment.provider");
const pagseguro_recurring_payment_provider_1 = require("../../providers/pagseguro/pagseguro-recurring-payment.provider");
const picpay_recurring_payment_provider_1 = require("../../providers/picpay/picpay-recurring-payment.provider");
let DispatchGatewayRecurringPaymentService = class DispatchGatewayRecurringPaymentService {
    mercadoPagoRecurringPaymentProvider;
    stripeRecurringPaymentProvider;
    payPalRecurringPaymentProvider;
    pagSeguroRecurringPaymentProvider;
    picPayRecurringPaymentProvider;
    constructor(mercadoPagoRecurringPaymentProvider, stripeRecurringPaymentProvider, payPalRecurringPaymentProvider, pagSeguroRecurringPaymentProvider, picPayRecurringPaymentProvider) {
        this.mercadoPagoRecurringPaymentProvider = mercadoPagoRecurringPaymentProvider;
        this.stripeRecurringPaymentProvider = stripeRecurringPaymentProvider;
        this.payPalRecurringPaymentProvider = payPalRecurringPaymentProvider;
        this.pagSeguroRecurringPaymentProvider = pagSeguroRecurringPaymentProvider;
        this.picPayRecurringPaymentProvider = picPayRecurringPaymentProvider;
    }
    async exec(dtoIn) {
        const provider = this.normalizeProvider(dtoIn.gatewayProvider);
        if (provider === 'mercadopago' || provider === 'mercado_pago') {
            return await this.mercadoPagoRecurringPaymentProvider.createSubscription(dtoIn);
        }
        if (provider === 'stripe') {
            return await this.stripeRecurringPaymentProvider.createSubscription(dtoIn);
        }
        if (provider === 'paypal') {
            return await this.payPalRecurringPaymentProvider.createSubscription(dtoIn);
        }
        if (provider === 'pagseguro' || provider === 'pagbank') {
            return await this.pagSeguroRecurringPaymentProvider.createSubscription(dtoIn);
        }
        if (provider === 'picpay') {
            return await this.picPayRecurringPaymentProvider.createSubscription(dtoIn);
        }
        if (provider === 'infinitypay' || provider === 'infinitepay') {
            return this.buildPendingProviderImplementation(dtoIn, 'infinitypay');
        }
        return new gateway_recurring_payment_dto_out_1.GatewayRecurringPaymentDtoOut(false, dtoIn.gatewayProvider, null, null, null, null, 'provider_not_supported', 'failed', 'gateway_recurring_provider_not_supported', `recurring payment provider not supported: ${dtoIn.gatewayProvider}`, this.sanitizePayload(dtoIn.providerPayload), null, {
            provider: dtoIn.gatewayProvider,
            reason: 'gateway_recurring_provider_not_supported',
        });
    }
    buildPendingProviderImplementation(dtoIn, normalizedProvider) {
        return new gateway_recurring_payment_dto_out_1.GatewayRecurringPaymentDtoOut(false, normalizedProvider, null, this.extractGatewayPlanId(dtoIn, normalizedProvider), null, null, 'recurring_provider_pending_implementation', 'pending', 'gateway_recurring_provider_pending_implementation', `recurring provider ${normalizedProvider} contract created. Provider API integration pending.`, this.sanitizePayload(dtoIn.providerPayload), {
            provider: normalizedProvider,
            subscriptionPlanId: dtoIn.subscriptionPlan._id,
            subscriptionId: dtoIn.subscription._id,
            subscriptionInvoiceId: dtoIn.subscriptionInvoice._id,
            paymentTransactionId: dtoIn.paymentTransaction._id,
        }, {
            ok: false,
            provider: normalizedProvider,
            reason: 'gateway_recurring_provider_pending_implementation',
        }, null, null);
    }
    extractGatewayPlanId(dtoIn, provider) {
        const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
        const gatewayMappings = this.asObject(planConfig.gatewayMappings);
        const providerMapping = this.asObject(gatewayMappings[provider]);
        return (this.toNullableString(providerMapping.gatewayPlanId) ??
            this.toNullableString(providerMapping.planId) ??
            this.toNullableString(providerMapping.priceId) ??
            dtoIn.subscriptionPlan.gatewayPlanId);
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
    normalizeProvider(provider) {
        return provider
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/-/g, '_')
            .replace(/\s+/g, '_');
    }
};
exports.DispatchGatewayRecurringPaymentService = DispatchGatewayRecurringPaymentService;
exports.DispatchGatewayRecurringPaymentService = DispatchGatewayRecurringPaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mercado_pago_recurring_payment_provider_1.MercadoPagoRecurringPaymentProvider,
        stripe_recurring_payment_provider_1.StripeRecurringPaymentProvider,
        paypal_recurring_payment_provider_1.PayPalRecurringPaymentProvider,
        pagseguro_recurring_payment_provider_1.PagSeguroRecurringPaymentProvider,
        picpay_recurring_payment_provider_1.PicPayRecurringPaymentProvider])
], DispatchGatewayRecurringPaymentService);
//# sourceMappingURL=dispatch-gateway-recurring-payment.service.js.map