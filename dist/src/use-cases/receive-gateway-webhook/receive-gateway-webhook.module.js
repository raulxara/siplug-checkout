"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveGatewayWebhookModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const checkout_sessions_module_1 = require("../../modules/checkout-sessions/checkout-sessions.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const receive_gateway_webhook_controller_1 = require("./receive-gateway-webhook.controller");
const receive_gateway_webhook_use_case_1 = require("./receive-gateway-webhook.use-case");
let ReceiveGatewayWebhookModule = class ReceiveGatewayWebhookModule {
};
exports.ReceiveGatewayWebhookModule = ReceiveGatewayWebhookModule;
exports.ReceiveGatewayWebhookModule = ReceiveGatewayWebhookModule = __decorate([
    (0, common_1.Module)({
        imports: [
            api_credentials_module_1.ApiCredentialsModule,
            checkout_sessions_module_1.CheckoutSessionsModule,
            payment_transactions_module_1.PaymentTransactionsModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [receive_gateway_webhook_controller_1.ReceiveGatewayWebhookController],
        providers: [receive_gateway_webhook_use_case_1.ReceiveGatewayWebhookUseCase],
        exports: [receive_gateway_webhook_use_case_1.ReceiveGatewayWebhookUseCase],
    })
], ReceiveGatewayWebhookModule);
//# sourceMappingURL=receive-gateway-webhook.module.js.map