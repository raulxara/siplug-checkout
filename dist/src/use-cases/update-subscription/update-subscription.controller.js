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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const update_subscription_dto_in_1 = require("./dtos/update-subscription.dto-in");
const update_subscription_request_1 = require("./http/update-subscription.request");
const update_subscription_use_case_1 = require("./update-subscription.use-case");
let UpdateSubscriptionController = class UpdateSubscriptionController {
    updateSubscriptionUseCase;
    constructor(updateSubscriptionUseCase) {
        this.updateSubscriptionUseCase = updateSubscriptionUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.updateSubscriptionUseCase.exec(new update_subscription_dto_in_1.UpdateSubscriptionDtoIn({
            token: this.resolveToken(authorization, request.token),
            subscriptionId: request.subscriptionId ?? request._id,
            gatewaySubscriptionId: request.gatewaySubscriptionId,
            currentCycle: request.currentCycle,
            nextBillingAt: request.nextBillingAt,
            startedAt: request.startedAt,
            canceledAt: request.canceledAt,
            endedAt: request.endedAt,
            metadata: request.metadata,
            config: request.config,
            status: request.status,
        }));
        return {
            status: 'success',
            message: 'subscription updated successfully',
            data: {
                subscription: dtoOut.subscription,
            },
        };
    }
    resolveToken(authorization, fallbackToken) {
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.replace('Bearer ', '').trim();
        }
        return String(fallbackToken ?? '').trim();
    }
};
exports.UpdateSubscriptionController = UpdateSubscriptionController;
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_subscription_request_1.UpdateSubscriptionRequest, String]),
    __metadata("design:returntype", Promise)
], UpdateSubscriptionController.prototype, "handle", null);
exports.UpdateSubscriptionController = UpdateSubscriptionController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [update_subscription_use_case_1.UpdateSubscriptionUseCase])
], UpdateSubscriptionController);
//# sourceMappingURL=update-subscription.controller.js.map