"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookGatewaysModule = void 0;
const common_1 = require("@nestjs/common");
const normalize_stripe_webhook_service_1 = require("./stripe/services/normalize-stripe-webhook/normalize-stripe-webhook.service");
const validate_stripe_webhook_service_1 = require("./stripe/services/validate-stripe-webhook/validate-stripe-webhook.service");
const get_mercado_pago_payment_service_1 = require("./mercado-pago/services/get-mercado-pago-payment/get-mercado-pago-payment.service");
const normalize_mercado_pago_webhook_service_1 = require("./mercado-pago/services/normalize-mercado-pago-webhook/normalize-mercado-pago-webhook.service");
const validate_mercado_pago_webhook_service_1 = require("./mercado-pago/services/validate-mercado-pago-webhook/validate-mercado-pago-webhook.service");
const normalize_pagseguro_webhook_service_1 = require("./pagseguro/services/normalize-pagseguro-webhook/normalize-pagseguro-webhook.service");
const validate_pagseguro_webhook_service_1 = require("./pagseguro/services/validate-pagseguro-webhook/validate-pagseguro-webhook.service");
const normalize_picpay_webhook_service_1 = require("./picpay/services/normalize-picpay-webhook/normalize-picpay-webhook.service");
const validate_picpay_webhook_service_1 = require("./picpay/services/validate-picpay-webhook/validate-picpay-webhook.service");
let PaymentWebhookGatewaysModule = class PaymentWebhookGatewaysModule {
};
exports.PaymentWebhookGatewaysModule = PaymentWebhookGatewaysModule;
exports.PaymentWebhookGatewaysModule = PaymentWebhookGatewaysModule = __decorate([
    (0, common_1.Module)({
        providers: [
            validate_stripe_webhook_service_1.ValidateStripeWebhookService,
            normalize_stripe_webhook_service_1.NormalizeStripeWebhookService,
            validate_mercado_pago_webhook_service_1.ValidateMercadoPagoWebhookService,
            get_mercado_pago_payment_service_1.GetMercadoPagoPaymentService,
            normalize_mercado_pago_webhook_service_1.NormalizeMercadoPagoWebhookService,
            normalize_pagseguro_webhook_service_1.NormalizePagSeguroWebhookService,
            validate_pagseguro_webhook_service_1.ValidatePagSeguroWebhookService,
            normalize_picpay_webhook_service_1.NormalizePicPayWebhookService,
            validate_picpay_webhook_service_1.ValidatePicPayWebhookService,
        ],
        exports: [
            validate_stripe_webhook_service_1.ValidateStripeWebhookService,
            normalize_stripe_webhook_service_1.NormalizeStripeWebhookService,
            validate_mercado_pago_webhook_service_1.ValidateMercadoPagoWebhookService,
            get_mercado_pago_payment_service_1.GetMercadoPagoPaymentService,
            normalize_mercado_pago_webhook_service_1.NormalizeMercadoPagoWebhookService,
            normalize_pagseguro_webhook_service_1.NormalizePagSeguroWebhookService,
            validate_pagseguro_webhook_service_1.ValidatePagSeguroWebhookService,
            normalize_picpay_webhook_service_1.NormalizePicPayWebhookService,
            validate_picpay_webhook_service_1.ValidatePicPayWebhookService,
        ],
    })
], PaymentWebhookGatewaysModule);
//# sourceMappingURL=payment-webhook-gateways.module.js.map