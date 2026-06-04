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
const infinity_pay_gateway_payment_provider_1 = require("./providers/infinity-pay/infinity-pay-gateway-payment.provider");
const mercado_pago_gateway_payment_provider_1 = require("./providers/mercado-pago/mercado-pago-gateway-payment.provider");
const pagseguro_gateway_payment_provider_1 = require("./providers/pagseguro/pagseguro-gateway-payment.provider");
const paypal_gateway_payment_provider_1 = require("./providers/paypal/paypal-gateway-payment.provider");
const stripe_gateway_payment_provider_1 = require("./providers/stripe/stripe-gateway-payment.provider");
const dispatch_gateway_payment_service_1 = require("./services/dispatch-gateway-payment/dispatch-gateway-payment.service");
const fetch_mercado_pago_payment_service_1 = require("./services/fetch-mercado-pago-payment/fetch-mercado-pago-payment.service");
const resolve_gateway_payment_provider_service_1 = require("./services/resolve-gateway-payment-provider/resolve-gateway-payment-provider.service");
const api_credentials_module_1 = require("../api-credentials/api-credentials.module");
const gateways_module_1 = require("../gateways/gateways.module");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const resolve_payment_gateway_credential_service_1 = require("./services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service");
const picpay_gateway_payment_provider_1 = require("./providers/picpay/picpay-gateway-payment.provider");
const sync_gateway_payment_status_service_1 = require("./services/sync-gateway-payment-status/sync-gateway-payment-status.service");
const dispatch_gateway_recurring_payment_service_1 = require("./services/dispatch-gateway-recurring-payment/dispatch-gateway-recurring-payment.service");
const mercado_pago_recurring_payment_provider_1 = require("./providers/mercado-pago/mercado-pago-recurring-payment.provider");
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
            paypal_gateway_payment_provider_1.PayPalGatewayPaymentProvider,
            infinity_pay_gateway_payment_provider_1.InfinityPayGatewayPaymentProvider,
            picpay_gateway_payment_provider_1.PicPayGatewayPaymentProvider,
            resolve_gateway_payment_provider_service_1.ResolveGatewayPaymentProviderService,
            dispatch_gateway_payment_service_1.DispatchGatewayPaymentService,
            fetch_mercado_pago_payment_service_1.FetchMercadoPagoPaymentService,
            resolve_payment_gateway_credential_service_1.ResolvePaymentGatewayCredentialService,
            decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
            sync_gateway_payment_status_service_1.SyncGatewayPaymentStatusService,
            dispatch_gateway_recurring_payment_service_1.DispatchGatewayRecurringPaymentService,
            mercado_pago_recurring_payment_provider_1.MercadoPagoRecurringPaymentProvider,
        ],
        exports: [
            resolve_gateway_payment_provider_service_1.ResolveGatewayPaymentProviderService,
            dispatch_gateway_payment_service_1.DispatchGatewayPaymentService,
            fetch_mercado_pago_payment_service_1.FetchMercadoPagoPaymentService,
            resolve_payment_gateway_credential_service_1.ResolvePaymentGatewayCredentialService,
            sync_gateway_payment_status_service_1.SyncGatewayPaymentStatusService,
            dispatch_gateway_recurring_payment_service_1.DispatchGatewayRecurringPaymentService,
            mercado_pago_recurring_payment_provider_1.MercadoPagoRecurringPaymentProvider,
        ],
    })
], GatewayOrchestrationModule);
//# sourceMappingURL=gateway-orchestration.module.js.map