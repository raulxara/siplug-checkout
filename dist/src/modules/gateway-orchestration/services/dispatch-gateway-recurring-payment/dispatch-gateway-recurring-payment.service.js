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
let DispatchGatewayRecurringPaymentService = class DispatchGatewayRecurringPaymentService {
    mercadoPagoRecurringPaymentProvider;
    constructor(mercadoPagoRecurringPaymentProvider) {
        this.mercadoPagoRecurringPaymentProvider = mercadoPagoRecurringPaymentProvider;
    }
    async exec(dtoIn) {
        const provider = this.normalizeProvider(dtoIn.gatewayProvider);
        if (provider === 'mercadopago' || provider === 'mercado_pago') {
            return await this.mercadoPagoRecurringPaymentProvider.createSubscription(dtoIn);
        }
        if (provider === 'stripe') {
            return this.buildPendingProviderImplementation(dtoIn, 'stripe');
        }
        if (provider === 'paypal') {
            return this.buildPendingProviderImplementation(dtoIn, 'paypal');
        }
        if (provider === 'pagseguro' || provider === 'pagbank') {
            return this.buildPendingProviderImplementation(dtoIn, 'pagseguro');
        }
        if (provider === 'picpay') {
            return this.buildPendingProviderImplementation(dtoIn, 'picpay');
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
    __metadata("design:paramtypes", [mercado_pago_recurring_payment_provider_1.MercadoPagoRecurringPaymentProvider])
], DispatchGatewayRecurringPaymentService);
//# sourceMappingURL=dispatch-gateway-recurring-payment.service.js.map