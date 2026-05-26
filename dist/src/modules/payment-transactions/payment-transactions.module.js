"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const payment_transactions_repository_1 = require("./repositories/payment-transactions.repository");
const create_payment_transaction_service_1 = require("./services/create-payment-transaction/create-payment-transaction.service");
const find_payment_transaction_by_unique_id_service_1 = require("./services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const get_all_payment_transactions_by_checkout_session_id_service_1 = require("./services/get-all-payment-transactions-by-checkout-session-id/get-all-payment-transactions-by-checkout-session-id.service");
const get_all_payment_transactions_by_office_id_service_1 = require("./services/get-all-payment-transactions-by-office-id/get-all-payment-transactions-by-office-id.service");
const update_payment_transaction_service_1 = require("./services/update-payment-transaction/update-payment-transaction.service");
const payment_transactions_tokens_1 = require("./tokens/payment-transactions.tokens");
let PaymentTransactionsModule = class PaymentTransactionsModule {
};
exports.PaymentTransactionsModule = PaymentTransactionsModule;
exports.PaymentTransactionsModule = PaymentTransactionsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: payment_transactions_tokens_1.PAYMENT_TRANSACTIONS_REPOSITORY,
                useClass: payment_transactions_repository_1.PaymentTransactionsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_payment_transaction_service_1.CreatePaymentTransactionService,
            update_payment_transaction_service_1.UpdatePaymentTransactionService,
            find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
            get_all_payment_transactions_by_office_id_service_1.GetAllPaymentTransactionsByOfficeIdService,
            get_all_payment_transactions_by_checkout_session_id_service_1.GetAllPaymentTransactionsByCheckoutSessionIdService,
        ],
        exports: [
            payment_transactions_tokens_1.PAYMENT_TRANSACTIONS_REPOSITORY,
            create_payment_transaction_service_1.CreatePaymentTransactionService,
            update_payment_transaction_service_1.UpdatePaymentTransactionService,
            find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
            get_all_payment_transactions_by_office_id_service_1.GetAllPaymentTransactionsByOfficeIdService,
            get_all_payment_transactions_by_checkout_session_id_service_1.GetAllPaymentTransactionsByCheckoutSessionIdService,
        ],
    })
], PaymentTransactionsModule);
//# sourceMappingURL=payment-transactions.module.js.map