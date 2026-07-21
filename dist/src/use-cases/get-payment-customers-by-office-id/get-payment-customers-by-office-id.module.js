"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentCustomersByOfficeIdModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const payment_customers_module_1 = require("../../modules/payment-customers/payment-customers.module");
const security_module_1 = require("../../modules/security/security.module");
const get_payment_customers_by_office_id_controller_1 = require("./get-payment-customers-by-office-id.controller");
const get_payment_customers_by_office_id_use_case_1 = require("./get-payment-customers-by-office-id.use-case");
let GetPaymentCustomersByOfficeIdModule = class GetPaymentCustomersByOfficeIdModule {
};
exports.GetPaymentCustomersByOfficeIdModule = GetPaymentCustomersByOfficeIdModule;
exports.GetPaymentCustomersByOfficeIdModule = GetPaymentCustomersByOfficeIdModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offices_module_1.OfficesModule,
            payment_customers_module_1.PaymentCustomersModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [get_payment_customers_by_office_id_controller_1.GetPaymentCustomersByOfficeIdController],
        providers: [get_payment_customers_by_office_id_use_case_1.GetPaymentCustomersByOfficeIdUseCase],
        exports: [get_payment_customers_by_office_id_use_case_1.GetPaymentCustomersByOfficeIdUseCase],
    })
], GetPaymentCustomersByOfficeIdModule);
//# sourceMappingURL=get-payment-customers-by-office-id.module.js.map