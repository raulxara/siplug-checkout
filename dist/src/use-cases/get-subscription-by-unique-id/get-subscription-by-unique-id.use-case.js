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
exports.GetSubscriptionByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const find_subscription_by_unique_id_dto_in_1 = require("../../modules/subscriptions/services/find-subscription-by-unique-id/dtos/find-subscription-by-unique-id.dto-in");
const find_subscription_by_unique_id_service_1 = require("../../modules/subscriptions/services/find-subscription-by-unique-id/find-subscription-by-unique-id.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_subscription_by_unique_id_dto_out_1 = require("./dtos/get-subscription-by-unique-id.dto-out");
let GetSubscriptionByUniqueIdUseCase = class GetSubscriptionByUniqueIdUseCase {
    findSubscriptionByUniqueIdService;
    resolveActorAuthorizationService;
    constructor(findSubscriptionByUniqueIdService, resolveActorAuthorizationService) {
        this.findSubscriptionByUniqueIdService = findSubscriptionByUniqueIdService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'subscriptions',
            requiredAction: 'getSubscriptionByUniqueId',
        });
        const subscriptionDtoOut = await this.findSubscriptionByUniqueIdService.exec(new find_subscription_by_unique_id_dto_in_1.FindSubscriptionByUniqueIdDtoIn(dtoIn.subscriptionId));
        return new get_subscription_by_unique_id_dto_out_1.GetSubscriptionByUniqueIdDtoOut(subscriptionDtoOut.subscription);
    }
};
exports.GetSubscriptionByUniqueIdUseCase = GetSubscriptionByUniqueIdUseCase;
exports.GetSubscriptionByUniqueIdUseCase = GetSubscriptionByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_subscription_by_unique_id_service_1.FindSubscriptionByUniqueIdService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], GetSubscriptionByUniqueIdUseCase);
//# sourceMappingURL=get-subscription-by-unique-id.use-case.js.map