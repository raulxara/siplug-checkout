"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionInvoiceUseCase = void 0;
const common_1 = require("@nestjs/common");
const find_subscription_invoice_by_unique_id_dto_in_1 = require("../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/dtos/find-subscription-invoice-by-unique-id.dto-in");
const find_subscription_invoice_by_unique_id_service_1 = require("../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service");
const update_subscription_invoice_dto_in_1 = require("../../modules/subscription-invoices/services/update-subscription-invoice/dtos/update-subscription-invoice.dto-in");
const update_subscription_invoice_service_1 = require("../../modules/subscription-invoices/services/update-subscription-invoice/update-subscription-invoice.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const update_subscription_invoice_dto_out_1 = require("./dtos/update-subscription-invoice.dto-out");
let UpdateSubscriptionInvoiceUseCase = class UpdateSubscriptionInvoiceUseCase {
    findSubscriptionInvoiceByUniqueIdService;
    updateSubscriptionInvoiceService;
    resolveActorAuthorizationService;
    constructor(findSubscriptionInvoiceByUniqueIdService, updateSubscriptionInvoiceService, resolveActorAuthorizationService) {
        this.findSubscriptionInvoiceByUniqueIdService = findSubscriptionInvoiceByUniqueIdService;
        this.updateSubscriptionInvoiceService = updateSubscriptionInvoiceService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'subscription_invoices',
            requiredAction: 'updateSubscriptionInvoice',
        });
        await this.findSubscriptionInvoiceByUniqueIdService.exec(new find_subscription_invoice_by_unique_id_dto_in_1.FindSubscriptionInvoiceByUniqueIdDtoIn(dtoIn.subscriptionInvoiceId));
        const updatedSubscriptionInvoiceDtoOut = await this.updateSubscriptionInvoiceService.exec(new update_subscription_invoice_dto_in_1.UpdateSubscriptionInvoiceDtoIn(dtoIn.subscriptionInvoiceId, dtoIn.paymentTransactionId, dtoIn.gatewayInvoiceId, dtoIn.lastAttemptAt, dtoIn.attemptNumber, dtoIn.paidAt, dtoIn.metadata, dtoIn.config, dtoIn.status, 'UpdateSubscriptionInvoiceUseCase'));
        return new update_subscription_invoice_dto_out_1.UpdateSubscriptionInvoiceDtoOut(updatedSubscriptionInvoiceDtoOut.subscriptionInvoice);
    }
};
exports.UpdateSubscriptionInvoiceUseCase = UpdateSubscriptionInvoiceUseCase;
exports.UpdateSubscriptionInvoiceUseCase = UpdateSubscriptionInvoiceUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_subscription_invoice_by_unique_id_service_1.FindSubscriptionInvoiceByUniqueIdService,
        update_subscription_invoice_service_1.UpdateSubscriptionInvoiceService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], UpdateSubscriptionInvoiceUseCase);
//# sourceMappingURL=update-subscription-invoice.use-case.js.map