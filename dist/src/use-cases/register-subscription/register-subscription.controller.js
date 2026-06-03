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
exports.RegisterSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const register_subscription_dto_in_1 = require("./dtos/register-subscription.dto-in");
const register_subscription_request_1 = require("./http/register-subscription.request");
const register_subscription_use_case_1 = require("./register-subscription.use-case");
let RegisterSubscriptionController = class RegisterSubscriptionController {
    registerSubscriptionUseCase;
    constructor(registerSubscriptionUseCase) {
        this.registerSubscriptionUseCase = registerSubscriptionUseCase;
    }
    async handle(authorization, body) {
        try {
            const dtoOut = await this.registerSubscriptionUseCase.exec(new register_subscription_dto_in_1.RegisterSubscriptionDtoIn({
                token: this.extractBearerToken(authorization),
                officeId: body.officeId,
                clientId: body.clientId,
                subscriptionPlanId: body.subscriptionPlanId,
                paymentCustomerId: body.paymentCustomerId,
                gatewayId: body.gatewayId ?? null,
                apiCredentialId: body.apiCredentialId ?? null,
                externalReference: body.externalReference ?? null,
                amount: body.amount ?? null,
                currency: body.currency ?? null,
                nextBillingAt: body.nextBillingAt ?? null,
                metadata: body.metadata ?? null,
                config: body.config ?? null,
                status: body.status ?? 'created',
            }));
            return {
                status: 'success',
                message: 'subscription registered successfully',
                data: {
                    subscription: dtoOut.subscription,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on register subscription';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
    extractBearerToken(authorization) {
        if (!authorization || authorization.trim() === '') {
            throw new Error('authorization header is required');
        }
        return authorization.replace(/^Bearer\s+/i, '').trim();
    }
};
exports.RegisterSubscriptionController = RegisterSubscriptionController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_subscription_request_1.RegisterSubscriptionRequest]),
    __metadata("design:returntype", Promise)
], RegisterSubscriptionController.prototype, "handle", null);
exports.RegisterSubscriptionController = RegisterSubscriptionController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [register_subscription_use_case_1.RegisterSubscriptionUseCase])
], RegisterSubscriptionController);
//# sourceMappingURL=register-subscription.controller.js.map