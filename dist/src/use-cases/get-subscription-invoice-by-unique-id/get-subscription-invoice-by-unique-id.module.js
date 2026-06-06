"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubscriptionInvoiceByUniqueIdModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const subscription_invoices_module_1 = require("../../modules/subscription-invoices/subscription-invoices.module");
const get_subscription_invoice_by_unique_id_controller_1 = require("./get-subscription-invoice-by-unique-id.controller");
const get_subscription_invoice_by_unique_id_use_case_1 = require("./get-subscription-invoice-by-unique-id.use-case");
let GetSubscriptionInvoiceByUniqueIdModule = class GetSubscriptionInvoiceByUniqueIdModule {
};
exports.GetSubscriptionInvoiceByUniqueIdModule = GetSubscriptionInvoiceByUniqueIdModule;
exports.GetSubscriptionInvoiceByUniqueIdModule = GetSubscriptionInvoiceByUniqueIdModule = __decorate([
    (0, common_1.Module)({
        imports: [subscription_invoices_module_1.SubscriptionInvoicesModule, security_module_1.SecurityModule],
        controllers: [get_subscription_invoice_by_unique_id_controller_1.GetSubscriptionInvoiceByUniqueIdController],
        providers: [get_subscription_invoice_by_unique_id_use_case_1.GetSubscriptionInvoiceByUniqueIdUseCase],
        exports: [get_subscription_invoice_by_unique_id_use_case_1.GetSubscriptionInvoiceByUniqueIdUseCase],
    })
], GetSubscriptionInvoiceByUniqueIdModule);
//# sourceMappingURL=get-subscription-invoice-by-unique-id.module.js.map