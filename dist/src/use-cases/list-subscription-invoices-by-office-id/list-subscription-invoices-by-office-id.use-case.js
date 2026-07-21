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
exports.ListSubscriptionInvoicesByOfficeIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const get_all_subscription_invoices_by_office_id_dto_in_1 = require("../../modules/subscription-invoices/services/get-all-subscription-invoices-by-office-id/dtos/get-all-subscription-invoices-by-office-id.dto-in");
const get_all_subscription_invoices_by_office_id_service_1 = require("../../modules/subscription-invoices/services/get-all-subscription-invoices-by-office-id/get-all-subscription-invoices-by-office-id.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const list_subscription_invoices_by_office_id_dto_out_1 = require("./dtos/list-subscription-invoices-by-office-id.dto-out");
let ListSubscriptionInvoicesByOfficeIdUseCase = class ListSubscriptionInvoicesByOfficeIdUseCase {
    getAllSubscriptionInvoicesByOfficeIdService;
    resolveActorAuthorizationService;
    constructor(getAllSubscriptionInvoicesByOfficeIdService, resolveActorAuthorizationService) {
        this.getAllSubscriptionInvoicesByOfficeIdService = getAllSubscriptionInvoicesByOfficeIdService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'subscription_invoices',
            requiredAction: 'listSubscriptionInvoicesByOfficeId',
        });
        const subscriptionInvoicesDtoOut = await this.getAllSubscriptionInvoicesByOfficeIdService.exec(new get_all_subscription_invoices_by_office_id_dto_in_1.GetAllSubscriptionInvoicesByOfficeIdDtoIn(dtoIn.officeId));
        return new list_subscription_invoices_by_office_id_dto_out_1.ListSubscriptionInvoicesByOfficeIdDtoOut(subscriptionInvoicesDtoOut.subscriptionInvoices);
    }
};
exports.ListSubscriptionInvoicesByOfficeIdUseCase = ListSubscriptionInvoicesByOfficeIdUseCase;
exports.ListSubscriptionInvoicesByOfficeIdUseCase = ListSubscriptionInvoicesByOfficeIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_all_subscription_invoices_by_office_id_service_1.GetAllSubscriptionInvoicesByOfficeIdService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], ListSubscriptionInvoicesByOfficeIdUseCase);
//# sourceMappingURL=list-subscription-invoices-by-office-id.use-case.js.map