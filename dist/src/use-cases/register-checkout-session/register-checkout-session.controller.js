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
exports.RegisterCheckoutSessionController = void 0;
const common_1 = require("@nestjs/common");
const register_checkout_session_dto_in_1 = require("./dtos/register-checkout-session.dto-in");
const register_checkout_session_request_1 = require("./http/register-checkout-session.request");
const register_checkout_session_use_case_1 = require("./register-checkout-session.use-case");
let RegisterCheckoutSessionController = class RegisterCheckoutSessionController {
    registerCheckoutSessionUseCase;
    constructor(registerCheckoutSessionUseCase) {
        this.registerCheckoutSessionUseCase = registerCheckoutSessionUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';
            const dtoOut = await this.registerCheckoutSessionUseCase.exec(new register_checkout_session_dto_in_1.RegisterCheckoutSessionDtoIn({
                token,
                officeId: body.officeId,
                clientId: body.clientId,
                paymentCustomerId: body.paymentCustomerId ?? null,
                gatewayId: body.gatewayId,
                apiCredentialId: body.apiCredentialId ?? null,
                code: body.code ?? null,
                externalReference: body.externalReference ?? null,
                idempotencyKey: body.idempotencyKey ?? null,
                paymentType: body.paymentType,
                amount: body.amount,
                currency: body.currency ?? 'BRL',
                description: body.description ?? null,
                successUrl: body.successUrl ?? null,
                cancelUrl: body.cancelUrl ?? null,
                expiresAt: body.expiresAt ?? null,
                items: body.items,
                metadata: body.metadata ?? null,
                config: body.config ?? null,
                status: body.status ?? 'created',
            }));
            return {
                status: 'success',
                message: 'checkout session registered successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on register checkout session controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.RegisterCheckoutSessionController = RegisterCheckoutSessionController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_checkout_session_request_1.RegisterCheckoutSessionRequest, String]),
    __metadata("design:returntype", Promise)
], RegisterCheckoutSessionController.prototype, "handle", null);
exports.RegisterCheckoutSessionController = RegisterCheckoutSessionController = __decorate([
    (0, common_1.Controller)('checkout-sessions'),
    __metadata("design:paramtypes", [register_checkout_session_use_case_1.RegisterCheckoutSessionUseCase])
], RegisterCheckoutSessionController);
//# sourceMappingURL=register-checkout-session.controller.js.map