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
exports.ResolveGatewayPaymentProviderService = void 0;
const common_1 = require("@nestjs/common");
const infinity_pay_gateway_payment_provider_1 = require("../../providers/infinity-pay/infinity-pay-gateway-payment.provider");
const mercado_pago_gateway_payment_provider_1 = require("../../providers/mercado-pago/mercado-pago-gateway-payment.provider");
const pagseguro_gateway_payment_provider_1 = require("../../providers/pagseguro/pagseguro-gateway-payment.provider");
const paypal_gateway_payment_provider_1 = require("../../providers/paypal/paypal-gateway-payment.provider");
const stripe_gateway_payment_provider_1 = require("../../providers/stripe/stripe-gateway-payment.provider");
const picpay_gateway_payment_provider_1 = require("../../providers/picpay/picpay-gateway-payment.provider");
let ResolveGatewayPaymentProviderService = class ResolveGatewayPaymentProviderService {
    mercadoPagoGatewayPaymentProvider;
    stripeGatewayPaymentProvider;
    pagSeguroGatewayPaymentProvider;
    paypalGatewayPaymentProvider;
    infinityPayGatewayPaymentProvider;
    picPayGatewayPaymentProvider;
    constructor(mercadoPagoGatewayPaymentProvider, stripeGatewayPaymentProvider, pagSeguroGatewayPaymentProvider, paypalGatewayPaymentProvider, infinityPayGatewayPaymentProvider, picPayGatewayPaymentProvider) {
        this.mercadoPagoGatewayPaymentProvider = mercadoPagoGatewayPaymentProvider;
        this.stripeGatewayPaymentProvider = stripeGatewayPaymentProvider;
        this.pagSeguroGatewayPaymentProvider = pagSeguroGatewayPaymentProvider;
        this.paypalGatewayPaymentProvider = paypalGatewayPaymentProvider;
        this.infinityPayGatewayPaymentProvider = infinityPayGatewayPaymentProvider;
        this.picPayGatewayPaymentProvider = picPayGatewayPaymentProvider;
    }
    exec(gatewayProvider) {
        const providers = [
            this.mercadoPagoGatewayPaymentProvider,
            this.stripeGatewayPaymentProvider,
            this.pagSeguroGatewayPaymentProvider,
            this.paypalGatewayPaymentProvider,
            this.infinityPayGatewayPaymentProvider,
            this.picPayGatewayPaymentProvider,
        ];
        const provider = providers.find((item) => item.supports(gatewayProvider));
        if (!provider) {
            throw new Error(`gateway provider not supported: ${gatewayProvider}`);
        }
        return provider;
    }
};
exports.ResolveGatewayPaymentProviderService = ResolveGatewayPaymentProviderService;
exports.ResolveGatewayPaymentProviderService = ResolveGatewayPaymentProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mercado_pago_gateway_payment_provider_1.MercadoPagoGatewayPaymentProvider,
        stripe_gateway_payment_provider_1.StripeGatewayPaymentProvider,
        pagseguro_gateway_payment_provider_1.PagSeguroGatewayPaymentProvider,
        paypal_gateway_payment_provider_1.PayPalGatewayPaymentProvider,
        infinity_pay_gateway_payment_provider_1.InfinityPayGatewayPaymentProvider,
        picpay_gateway_payment_provider_1.PicPayGatewayPaymentProvider])
], ResolveGatewayPaymentProviderService);
//# sourceMappingURL=resolve-gateway-payment-provider.service.js.map