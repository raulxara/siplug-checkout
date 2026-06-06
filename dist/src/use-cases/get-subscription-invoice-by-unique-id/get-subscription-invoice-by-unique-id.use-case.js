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
exports.GetSubscriptionInvoiceByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const find_subscription_invoice_by_unique_id_dto_in_1 = require("../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/dtos/find-subscription-invoice-by-unique-id.dto-in");
const find_subscription_invoice_by_unique_id_service_1 = require("../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_subscription_invoice_by_unique_id_dto_out_1 = require("./dtos/get-subscription-invoice-by-unique-id.dto-out");
let GetSubscriptionInvoiceByUniqueIdUseCase = class GetSubscriptionInvoiceByUniqueIdUseCase {
    findSubscriptionInvoiceByUniqueIdService;
    resolveActorAuthorizationService;
    constructor(findSubscriptionInvoiceByUniqueIdService, resolveActorAuthorizationService) {
        this.findSubscriptionInvoiceByUniqueIdService = findSubscriptionInvoiceByUniqueIdService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'subscription_invoices',
            requiredAction: 'getSubscriptionInvoiceByUniqueId',
        });
        const subscriptionInvoiceDtoOut = await this.findSubscriptionInvoiceByUniqueIdService.exec(new find_subscription_invoice_by_unique_id_dto_in_1.FindSubscriptionInvoiceByUniqueIdDtoIn(dtoIn.subscriptionInvoiceId));
        return new get_subscription_invoice_by_unique_id_dto_out_1.GetSubscriptionInvoiceByUniqueIdDtoOut(subscriptionInvoiceDtoOut.subscriptionInvoice);
    }
};
exports.GetSubscriptionInvoiceByUniqueIdUseCase = GetSubscriptionInvoiceByUniqueIdUseCase;
exports.GetSubscriptionInvoiceByUniqueIdUseCase = GetSubscriptionInvoiceByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_subscription_invoice_by_unique_id_service_1.FindSubscriptionInvoiceByUniqueIdService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], GetSubscriptionInvoiceByUniqueIdUseCase);
//# sourceMappingURL=get-subscription-invoice-by-unique-id.use-case.js.map