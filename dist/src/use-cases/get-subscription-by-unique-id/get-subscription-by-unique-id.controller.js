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
exports.GetSubscriptionByUniqueIdController = void 0;
const common_1 = require("@nestjs/common");
const get_subscription_by_unique_id_dto_in_1 = require("./dtos/get-subscription-by-unique-id.dto-in");
const get_subscription_by_unique_id_request_1 = require("./http/get-subscription-by-unique-id.request");
const get_subscription_by_unique_id_use_case_1 = require("./get-subscription-by-unique-id.use-case");
let GetSubscriptionByUniqueIdController = class GetSubscriptionByUniqueIdController {
    getSubscriptionByUniqueIdUseCase;
    constructor(getSubscriptionByUniqueIdUseCase) {
        this.getSubscriptionByUniqueIdUseCase = getSubscriptionByUniqueIdUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.getSubscriptionByUniqueIdUseCase.exec(new get_subscription_by_unique_id_dto_in_1.GetSubscriptionByUniqueIdDtoIn({
            token: this.resolveToken(authorization, request.token),
            subscriptionId: request.subscriptionId ?? request._id,
        }));
        return {
            status: 'success',
            message: 'subscription found successfully',
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
exports.GetSubscriptionByUniqueIdController = GetSubscriptionByUniqueIdController;
__decorate([
    (0, common_1.Post)('get-by-unique-id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_subscription_by_unique_id_request_1.GetSubscriptionByUniqueIdRequest, String]),
    __metadata("design:returntype", Promise)
], GetSubscriptionByUniqueIdController.prototype, "handle", null);
exports.GetSubscriptionByUniqueIdController = GetSubscriptionByUniqueIdController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [get_subscription_by_unique_id_use_case_1.GetSubscriptionByUniqueIdUseCase])
], GetSubscriptionByUniqueIdController);
//# sourceMappingURL=get-subscription-by-unique-id.controller.js.map