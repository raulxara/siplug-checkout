"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveStripeWebhookModule = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const payment_webhook_gateways_module_1 = require("../../modules/payment-webhook-gateways/payment-webhook-gateways.module");
const payment_webhook_events_module_1 = require("../../modules/payment-webhook-events/payment-webhook-events.module");
const process_payment_webhook_event_module_1 = require("../process-payment-webhook-event/process-payment-webhook-event.module");
const receive_stripe_webhook_controller_1 = require("./receive-stripe-webhook.controller");
const receive_stripe_webhook_use_case_1 = require("./receive-stripe-webhook.use-case");
let ReceiveStripeWebhookModule = class ReceiveStripeWebhookModule {
};
exports.ReceiveStripeWebhookModule = ReceiveStripeWebhookModule;
exports.ReceiveStripeWebhookModule = ReceiveStripeWebhookModule = __decorate([
    (0, common_1.Module)({
        imports: [
            use_case_support_module_1.UseCaseSupportModule,
            api_credentials_module_1.ApiCredentialsModule,
            payment_webhook_gateways_module_1.PaymentWebhookGatewaysModule,
            payment_webhook_events_module_1.PaymentWebhookEventsModule,
            process_payment_webhook_event_module_1.ProcessPaymentWebhookEventModule,
        ],
        controllers: [receive_stripe_webhook_controller_1.ReceiveStripeWebhookController],
        providers: [
            decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
            receive_stripe_webhook_use_case_1.ReceiveStripeWebhookUseCase,
        ],
        exports: [receive_stripe_webhook_use_case_1.ReceiveStripeWebhookUseCase],
    })
], ReceiveStripeWebhookModule);
//# sourceMappingURL=receive-stripe-webhook.module.js.map