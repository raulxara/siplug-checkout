"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSubscriptionInvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const security_module_1 = require("../../modules/security/security.module");
const subscription_cycles_module_1 = require("../../modules/subscription-cycles/subscription-cycles.module");
const subscription_invoices_module_1 = require("../../modules/subscription-invoices/subscription-invoices.module");
const subscription_plans_module_1 = require("../../modules/subscription-plans/subscription-plans.module");
const subscriptions_module_1 = require("../../modules/subscriptions/subscriptions.module");
const generate_subscription_invoice_controller_1 = require("./generate-subscription-invoice.controller");
const generate_subscription_invoice_use_case_1 = require("./generate-subscription-invoice.use-case");
let GenerateSubscriptionInvoiceModule = class GenerateSubscriptionInvoiceModule {
};
exports.GenerateSubscriptionInvoiceModule = GenerateSubscriptionInvoiceModule;
exports.GenerateSubscriptionInvoiceModule = GenerateSubscriptionInvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            subscriptions_module_1.SubscriptionsModule,
            subscription_plans_module_1.SubscriptionPlansModule,
            subscription_cycles_module_1.SubscriptionCyclesModule,
            subscription_invoices_module_1.SubscriptionInvoicesModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [generate_subscription_invoice_controller_1.GenerateSubscriptionInvoiceController],
        providers: [generate_subscription_invoice_use_case_1.GenerateSubscriptionInvoiceUseCase],
        exports: [generate_subscription_invoice_use_case_1.GenerateSubscriptionInvoiceUseCase],
    })
], GenerateSubscriptionInvoiceModule);
//# sourceMappingURL=generate-subscription-invoice.module.js.map