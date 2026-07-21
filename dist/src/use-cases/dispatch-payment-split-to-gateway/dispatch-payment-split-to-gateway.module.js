"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchPaymentSplitToGatewayModule = void 0;
const common_1 = require("@nestjs/common");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const gateway_split_transfers_module_1 = require("../../modules/gateway-split-transfers/gateway-split-transfers.module");
const payment_split_recipients_module_1 = require("../../modules/payment-split-recipients/payment-split-recipients.module");
const payment_splits_module_1 = require("../../modules/payment-splits/payment-splits.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const dispatch_payment_split_to_gateway_use_case_1 = require("./dispatch-payment-split-to-gateway.use-case");
let DispatchPaymentSplitToGatewayModule = class DispatchPaymentSplitToGatewayModule {
};
exports.DispatchPaymentSplitToGatewayModule = DispatchPaymentSplitToGatewayModule;
exports.DispatchPaymentSplitToGatewayModule = DispatchPaymentSplitToGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            use_case_support_module_1.UseCaseSupportModule,
            api_credentials_module_1.ApiCredentialsModule,
            payment_splits_module_1.PaymentSplitsModule,
            payment_split_recipients_module_1.PaymentSplitRecipientsModule,
            payment_transactions_module_1.PaymentTransactionsModule,
            gateway_split_transfers_module_1.GatewaySplitTransfersModule,
        ],
        providers: [dispatch_payment_split_to_gateway_use_case_1.DispatchPaymentSplitToGatewayUseCase],
        exports: [dispatch_payment_split_to_gateway_use_case_1.DispatchPaymentSplitToGatewayUseCase],
    })
], DispatchPaymentSplitToGatewayModule);
//# sourceMappingURL=dispatch-payment-split-to-gateway.module.js.map