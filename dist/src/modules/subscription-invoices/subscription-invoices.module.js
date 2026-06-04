"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionInvoicesModule = void 0;
const common_1 = require("@nestjs/common");
const subscription_invoices_repository_1 = require("./repositories/subscription-invoices.repository");
const create_subscription_invoice_service_1 = require("./services/create-subscription-invoice/create-subscription-invoice.service");
const find_subscription_invoice_by_unique_id_service_1 = require("./services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service");
const update_subscription_invoice_service_1 = require("./services/update-subscription-invoice/update-subscription-invoice.service");
const subscription_invoices_tokens_1 = require("./tokens/subscription-invoices.tokens");
let SubscriptionInvoicesModule = class SubscriptionInvoicesModule {
};
exports.SubscriptionInvoicesModule = SubscriptionInvoicesModule;
exports.SubscriptionInvoicesModule = SubscriptionInvoicesModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: subscription_invoices_tokens_1.SUBSCRIPTION_INVOICES_REPOSITORY,
                useClass: subscription_invoices_repository_1.SubscriptionInvoicesRepository,
            },
            create_subscription_invoice_service_1.CreateSubscriptionInvoiceService,
            find_subscription_invoice_by_unique_id_service_1.FindSubscriptionInvoiceByUniqueIdService,
            update_subscription_invoice_service_1.UpdateSubscriptionInvoiceService,
        ],
        exports: [
            subscription_invoices_tokens_1.SUBSCRIPTION_INVOICES_REPOSITORY,
            create_subscription_invoice_service_1.CreateSubscriptionInvoiceService,
            find_subscription_invoice_by_unique_id_service_1.FindSubscriptionInvoiceByUniqueIdService,
            update_subscription_invoice_service_1.UpdateSubscriptionInvoiceService,
        ],
    })
], SubscriptionInvoicesModule);
//# sourceMappingURL=subscription-invoices.module.js.map