"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentSplitsByPaymentTransactionIdModule = void 0;
const common_1 = require("@nestjs/common");
const payment_split_recipients_module_1 = require("../../modules/payment-split-recipients/payment-split-recipients.module");
const payment_splits_module_1 = require("../../modules/payment-splits/payment-splits.module");
const security_module_1 = require("../../modules/security/security.module");
const list_payment_splits_by_payment_transaction_id_controller_1 = require("./list-payment-splits-by-payment-transaction-id.controller");
const list_payment_splits_by_payment_transaction_id_use_case_1 = require("./list-payment-splits-by-payment-transaction-id.use-case");
let ListPaymentSplitsByPaymentTransactionIdModule = class ListPaymentSplitsByPaymentTransactionIdModule {
};
exports.ListPaymentSplitsByPaymentTransactionIdModule = ListPaymentSplitsByPaymentTransactionIdModule;
exports.ListPaymentSplitsByPaymentTransactionIdModule = ListPaymentSplitsByPaymentTransactionIdModule = __decorate([
    (0, common_1.Module)({
        imports: [security_module_1.SecurityModule, payment_splits_module_1.PaymentSplitsModule, payment_split_recipients_module_1.PaymentSplitRecipientsModule],
        controllers: [list_payment_splits_by_payment_transaction_id_controller_1.ListPaymentSplitsByPaymentTransactionIdController],
        providers: [list_payment_splits_by_payment_transaction_id_use_case_1.ListPaymentSplitsByPaymentTransactionIdUseCase],
        exports: [list_payment_splits_by_payment_transaction_id_use_case_1.ListPaymentSplitsByPaymentTransactionIdUseCase],
    })
], ListPaymentSplitsByPaymentTransactionIdModule);
//# sourceMappingURL=list-payment-splits-by-payment-transaction-id.module.js.map