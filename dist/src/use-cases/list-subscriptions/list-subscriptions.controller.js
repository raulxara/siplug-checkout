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
exports.ListSubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const list_subscriptions_dto_in_1 = require("./dtos/list-subscriptions.dto-in");
const list_subscriptions_request_1 = require("./http/list-subscriptions.request");
const list_subscriptions_use_case_1 = require("./list-subscriptions.use-case");
let ListSubscriptionsController = class ListSubscriptionsController {
    listSubscriptionsUseCase;
    constructor(listSubscriptionsUseCase) {
        this.listSubscriptionsUseCase = listSubscriptionsUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.listSubscriptionsUseCase.exec(new list_subscriptions_dto_in_1.ListSubscriptionsDtoIn({
            token: this.resolveToken(authorization, request.token),
        }));
        return {
            status: 'success',
            message: 'subscriptions listed successfully',
            data: {
                subscriptions: dtoOut.subscriptions,
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
exports.ListSubscriptionsController = ListSubscriptionsController;
__decorate([
    (0, common_1.Post)('list'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_subscriptions_request_1.ListSubscriptionsRequest, String]),
    __metadata("design:returntype", Promise)
], ListSubscriptionsController.prototype, "handle", null);
exports.ListSubscriptionsController = ListSubscriptionsController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [list_subscriptions_use_case_1.ListSubscriptionsUseCase])
], ListSubscriptionsController);
//# sourceMappingURL=list-subscriptions.controller.js.map