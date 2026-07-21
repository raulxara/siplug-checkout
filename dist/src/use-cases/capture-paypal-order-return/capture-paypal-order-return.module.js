"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapturePayPalOrderReturnModule = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const payment_webhook_events_module_1 = require("../../modules/payment-webhook-events/payment-webhook-events.module");
const process_payment_webhook_event_module_1 = require("../process-payment-webhook-event/process-payment-webhook-event.module");
const capture_paypal_order_return_controller_1 = require("./capture-paypal-order-return.controller");
const capture_paypal_order_return_use_case_1 = require("./capture-paypal-order-return.use-case");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
let CapturePayPalOrderReturnModule = class CapturePayPalOrderReturnModule {
};
exports.CapturePayPalOrderReturnModule = CapturePayPalOrderReturnModule;
exports.CapturePayPalOrderReturnModule = CapturePayPalOrderReturnModule = __decorate([
    (0, common_1.Module)({
        imports: [
            use_case_support_module_1.UseCaseSupportModule,
            api_credentials_module_1.ApiCredentialsModule,
            payment_webhook_events_module_1.PaymentWebhookEventsModule,
            process_payment_webhook_event_module_1.ProcessPaymentWebhookEventModule,
            payment_transactions_module_1.PaymentTransactionsModule,
        ],
        controllers: [capture_paypal_order_return_controller_1.CapturePayPalOrderReturnController],
        providers: [
            decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
            capture_paypal_order_return_use_case_1.CapturePayPalOrderReturnUseCase,
        ],
        exports: [capture_paypal_order_return_use_case_1.CapturePayPalOrderReturnUseCase],
    })
], CapturePayPalOrderReturnModule);
//# sourceMappingURL=capture-paypal-order-return.module.js.map