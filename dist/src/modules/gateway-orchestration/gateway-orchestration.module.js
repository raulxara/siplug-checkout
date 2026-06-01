"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayOrchestrationModule = void 0;
const common_1 = require("@nestjs/common");
const cielo_gateway_payment_provider_1 = require("./providers/cielo/cielo-gateway-payment.provider");
const efi_bank_gateway_payment_provider_1 = require("./providers/efi-bank/efi-bank-gateway-payment.provider");
const getnet_gateway_payment_provider_1 = require("./providers/getnet/getnet-gateway-payment.provider");
const infinity_pay_gateway_payment_provider_1 = require("./providers/infinity-pay/infinity-pay-gateway-payment.provider");
const iugu_gateway_payment_provider_1 = require("./providers/iugu/iugu-gateway-payment.provider");
const mercado_pago_gateway_payment_provider_1 = require("./providers/mercado-pago/mercado-pago-gateway-payment.provider");
const pagarme_gateway_payment_provider_1 = require("./providers/pagarme/pagarme-gateway-payment.provider");
const pagseguro_gateway_payment_provider_1 = require("./providers/pagseguro/pagseguro-gateway-payment.provider");
const paypal_gateway_payment_provider_1 = require("./providers/paypal/paypal-gateway-payment.provider");
const stripe_gateway_payment_provider_1 = require("./providers/stripe/stripe-gateway-payment.provider");
const vindi_gateway_payment_provider_1 = require("./providers/vindi/vindi-gateway-payment.provider");
const dispatch_gateway_payment_service_1 = require("./services/dispatch-gateway-payment/dispatch-gateway-payment.service");
const fetch_mercado_pago_payment_service_1 = require("./services/fetch-mercado-pago-payment/fetch-mercado-pago-payment.service");
const resolve_gateway_payment_provider_service_1 = require("./services/resolve-gateway-payment-provider/resolve-gateway-payment-provider.service");
const api_credentials_module_1 = require("../api-credentials/api-credentials.module");
const gateways_module_1 = require("../gateways/gateways.module");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const resolve_payment_gateway_credential_service_1 = require("./services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service");
const picpay_gateway_payment_provider_1 = require("./providers/picpay/picpay-gateway-payment.provider");
let GatewayOrchestrationModule = class GatewayOrchestrationModule {
};
exports.GatewayOrchestrationModule = GatewayOrchestrationModule;
exports.GatewayOrchestrationModule = GatewayOrchestrationModule = __decorate([
    (0, common_1.Module)({
        imports: [api_credentials_module_1.ApiCredentialsModule, gateways_module_1.GatewaysModule],
        providers: [
            mercado_pago_gateway_payment_provider_1.MercadoPagoGatewayPaymentProvider,
            stripe_gateway_payment_provider_1.StripeGatewayPaymentProvider,
            pagseguro_gateway_payment_provider_1.PagSeguroGatewayPaymentProvider,
            vindi_gateway_payment_provider_1.VindiGatewayPaymentProvider,
            pagarme_gateway_payment_provider_1.PagarmeGatewayPaymentProvider,
            paypal_gateway_payment_provider_1.PayPalGatewayPaymentProvider,
            cielo_gateway_payment_provider_1.CieloGatewayPaymentProvider,
            getnet_gateway_payment_provider_1.GetnetGatewayPaymentProvider,
            iugu_gateway_payment_provider_1.IuguGatewayPaymentProvider,
            efi_bank_gateway_payment_provider_1.EfiBankGatewayPaymentProvider,
            infinity_pay_gateway_payment_provider_1.InfinityPayGatewayPaymentProvider,
            picpay_gateway_payment_provider_1.PicPayGatewayPaymentProvider,
            resolve_gateway_payment_provider_service_1.ResolveGatewayPaymentProviderService,
            dispatch_gateway_payment_service_1.DispatchGatewayPaymentService,
            fetch_mercado_pago_payment_service_1.FetchMercadoPagoPaymentService,
            resolve_payment_gateway_credential_service_1.ResolvePaymentGatewayCredentialService,
            decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        ],
        exports: [
            resolve_gateway_payment_provider_service_1.ResolveGatewayPaymentProviderService,
            dispatch_gateway_payment_service_1.DispatchGatewayPaymentService,
            fetch_mercado_pago_payment_service_1.FetchMercadoPagoPaymentService,
            resolve_payment_gateway_credential_service_1.ResolvePaymentGatewayCredentialService,
        ],
    })
], GatewayOrchestrationModule);
//# sourceMappingURL=gateway-orchestration.module.js.map