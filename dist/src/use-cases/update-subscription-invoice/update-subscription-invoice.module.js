"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionInvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const subscription_invoices_module_1 = require("../../modules/subscription-invoices/subscription-invoices.module");
const update_subscription_invoice_controller_1 = require("./update-subscription-invoice.controller");
const update_subscription_invoice_use_case_1 = require("./update-subscription-invoice.use-case");
let UpdateSubscriptionInvoiceModule = class UpdateSubscriptionInvoiceModule {
};
exports.UpdateSubscriptionInvoiceModule = UpdateSubscriptionInvoiceModule;
exports.UpdateSubscriptionInvoiceModule = UpdateSubscriptionInvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [subscription_invoices_module_1.SubscriptionInvoicesModule, security_module_1.SecurityModule],
        controllers: [update_subscription_invoice_controller_1.UpdateSubscriptionInvoiceController],
        providers: [update_subscription_invoice_use_case_1.UpdateSubscriptionInvoiceUseCase],
        exports: [update_subscription_invoice_use_case_1.UpdateSubscriptionInvoiceUseCase],
    })
], UpdateSubscriptionInvoiceModule);
//# sourceMappingURL=update-subscription-invoice.module.js.map