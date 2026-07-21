"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchPaymentTransactionToGatewayModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const clients_module_1 = require("../../modules/clients/clients.module");
const gateway_orchestration_module_1 = require("../../modules/gateway-orchestration/gateway-orchestration.module");
const gateways_module_1 = require("../../modules/gateways/gateways.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const security_module_1 = require("../../modules/security/security.module");
const dispatch_payment_transaction_to_gateway_controller_1 = require("./dispatch-payment-transaction-to-gateway.controller");
const dispatch_payment_transaction_to_gateway_use_case_1 = require("./dispatch-payment-transaction-to-gateway.use-case");
let DispatchPaymentTransactionToGatewayModule = class DispatchPaymentTransactionToGatewayModule {
};
exports.DispatchPaymentTransactionToGatewayModule = DispatchPaymentTransactionToGatewayModule;
exports.DispatchPaymentTransactionToGatewayModule = DispatchPaymentTransactionToGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            payment_transactions_module_1.PaymentTransactionsModule,
            offices_module_1.OfficesModule,
            clients_module_1.ClientsModule,
            gateways_module_1.GatewaysModule,
            api_credentials_module_1.ApiCredentialsModule,
            gateway_orchestration_module_1.GatewayOrchestrationModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [dispatch_payment_transaction_to_gateway_controller_1.DispatchPaymentTransactionToGatewayController],
        providers: [dispatch_payment_transaction_to_gateway_use_case_1.DispatchPaymentTransactionToGatewayUseCase],
        exports: [dispatch_payment_transaction_to_gateway_use_case_1.DispatchPaymentTransactionToGatewayUseCase],
    })
], DispatchPaymentTransactionToGatewayModule);
//# sourceMappingURL=dispatch-payment-transaction-to-gateway.module.js.map