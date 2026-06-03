"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCustomersModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const payment_customers_repository_1 = require("./repositories/payment-customers.repository");
const create_payment_customer_service_1 = require("./services/create-payment-customer/create-payment-customer.service");
const find_payment_customer_by_unique_id_service_1 = require("./services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service");
const get_all_payment_customers_by_office_id_service_1 = require("./services/get-all-payment-customers-by-office-id/get-all-payment-customers-by-office-id.service");
const get_all_payment_customers_service_1 = require("./services/get-all-payment-customers/get-all-payment-customers.service");
const update_payment_customer_service_1 = require("./services/update-payment-customer/update-payment-customer.service");
const payment_customers_tokens_1 = require("./tokens/payment-customers.tokens");
let PaymentCustomersModule = class PaymentCustomersModule {
};
exports.PaymentCustomersModule = PaymentCustomersModule;
exports.PaymentCustomersModule = PaymentCustomersModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: payment_customers_tokens_1.PAYMENT_CUSTOMERS_REPOSITORY,
                useClass: payment_customers_repository_1.PaymentCustomersRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_payment_customer_service_1.CreatePaymentCustomerService,
            update_payment_customer_service_1.UpdatePaymentCustomerService,
            find_payment_customer_by_unique_id_service_1.FindPaymentCustomerByUniqueIdService,
            get_all_payment_customers_service_1.GetAllPaymentCustomersService,
            get_all_payment_customers_by_office_id_service_1.GetAllPaymentCustomersByOfficeIdService,
        ],
        exports: [
            payment_customers_tokens_1.PAYMENT_CUSTOMERS_REPOSITORY,
            create_payment_customer_service_1.CreatePaymentCustomerService,
            update_payment_customer_service_1.UpdatePaymentCustomerService,
            find_payment_customer_by_unique_id_service_1.FindPaymentCustomerByUniqueIdService,
            get_all_payment_customers_service_1.GetAllPaymentCustomersService,
            get_all_payment_customers_by_office_id_service_1.GetAllPaymentCustomersByOfficeIdService,
        ],
    })
], PaymentCustomersModule);
//# sourceMappingURL=payment-customers.module.js.map