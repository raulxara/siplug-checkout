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
exports.ListSubscriptionInvoicesUseCase = void 0;
const common_1 = require("@nestjs/common");
const get_all_subscription_invoices_service_1 = require("../../modules/subscription-invoices/services/get-all-subscription-invoices/get-all-subscription-invoices.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const list_subscription_invoices_dto_out_1 = require("./dtos/list-subscription-invoices.dto-out");
let ListSubscriptionInvoicesUseCase = class ListSubscriptionInvoicesUseCase {
    getAllSubscriptionInvoicesService;
    resolveActorAuthorizationService;
    constructor(getAllSubscriptionInvoicesService, resolveActorAuthorizationService) {
        this.getAllSubscriptionInvoicesService = getAllSubscriptionInvoicesService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'subscription_invoices',
            requiredAction: 'listSubscriptionInvoices',
        });
        const subscriptionInvoicesDtoOut = await this.getAllSubscriptionInvoicesService.exec();
        return new list_subscription_invoices_dto_out_1.ListSubscriptionInvoicesDtoOut(subscriptionInvoicesDtoOut.subscriptionInvoices);
    }
};
exports.ListSubscriptionInvoicesUseCase = ListSubscriptionInvoicesUseCase;
exports.ListSubscriptionInvoicesUseCase = ListSubscriptionInvoicesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_all_subscription_invoices_service_1.GetAllSubscriptionInvoicesService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], ListSubscriptionInvoicesUseCase);
//# sourceMappingURL=list-subscription-invoices.use-case.js.map