"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentTransactionsByOfficeIdModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const payment_transactions_module_1 = require("../../modules/payment-transactions/payment-transactions.module");
const security_module_1 = require("../../modules/security/security.module");
const list_payment_transactions_by_office_id_controller_1 = require("./list-payment-transactions-by-office-id.controller");
const list_payment_transactions_by_office_id_use_case_1 = require("./list-payment-transactions-by-office-id.use-case");
let ListPaymentTransactionsByOfficeIdModule = class ListPaymentTransactionsByOfficeIdModule {
};
exports.ListPaymentTransactionsByOfficeIdModule = ListPaymentTransactionsByOfficeIdModule;
exports.ListPaymentTransactionsByOfficeIdModule = ListPaymentTransactionsByOfficeIdModule = __decorate([
    (0, common_1.Module)({
        imports: [payment_transactions_module_1.PaymentTransactionsModule, security_module_1.SecurityModule, use_case_support_module_1.UseCaseSupportModule],
        controllers: [list_payment_transactions_by_office_id_controller_1.ListPaymentTransactionsByOfficeIdController],
        providers: [list_payment_transactions_by_office_id_use_case_1.ListPaymentTransactionsByOfficeIdUseCase],
        exports: [list_payment_transactions_by_office_id_use_case_1.ListPaymentTransactionsByOfficeIdUseCase],
    })
], ListPaymentTransactionsByOfficeIdModule);
//# sourceMappingURL=list-payment-transactions-by-office-id.module.js.map