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
exports.ListSubscriptionPlansController = void 0;
const common_1 = require("@nestjs/common");
const list_subscription_plans_dto_in_1 = require("./dtos/list-subscription-plans.dto-in");
const list_subscription_plans_request_1 = require("./http/list-subscription-plans.request");
const list_subscription_plans_use_case_1 = require("./list-subscription-plans.use-case");
let ListSubscriptionPlansController = class ListSubscriptionPlansController {
    listSubscriptionPlansUseCase;
    constructor(listSubscriptionPlansUseCase) {
        this.listSubscriptionPlansUseCase = listSubscriptionPlansUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.listSubscriptionPlansUseCase.exec(new list_subscription_plans_dto_in_1.ListSubscriptionPlansDtoIn({
            token: this.resolveToken(authorization, request.token),
        }));
        return {
            status: 'success',
            message: 'subscription plans listed successfully',
            data: {
                subscriptionPlans: dtoOut.subscriptionPlans,
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
exports.ListSubscriptionPlansController = ListSubscriptionPlansController;
__decorate([
    (0, common_1.Post)('list'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_subscription_plans_request_1.ListSubscriptionPlansRequest, String]),
    __metadata("design:returntype", Promise)
], ListSubscriptionPlansController.prototype, "handle", null);
exports.ListSubscriptionPlansController = ListSubscriptionPlansController = __decorate([
    (0, common_1.Controller)('subscription-plans'),
    __metadata("design:paramtypes", [list_subscription_plans_use_case_1.ListSubscriptionPlansUseCase])
], ListSubscriptionPlansController);
//# sourceMappingURL=list-subscription-plans.controller.js.map