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
exports.RegisterPaymentSplitController = void 0;
const common_1 = require("@nestjs/common");
const register_payment_split_dto_in_1 = require("./dtos/register-payment-split.dto-in");
const register_payment_split_request_1 = require("./http/register-payment-split.request");
const register_payment_split_use_case_1 = require("./register-payment-split.use-case");
let RegisterPaymentSplitController = class RegisterPaymentSplitController {
    registerPaymentSplitUseCase;
    constructor(registerPaymentSplitUseCase) {
        this.registerPaymentSplitUseCase = registerPaymentSplitUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.registerPaymentSplitUseCase.exec(new register_payment_split_dto_in_1.RegisterPaymentSplitDtoIn({
            token: this.resolveToken(authorization, request.token),
            splitRuleId: request.splitRuleId,
            checkoutSessionId: request.checkoutSessionId,
            paymentTransactionId: request.paymentTransactionId,
            subscriptionId: request.subscriptionId,
            subscriptionInvoiceId: request.subscriptionInvoiceId,
            gatewayProvider: request.gatewayProvider,
            grossAmount: request.grossAmount,
            gatewayFeeAmount: request.gatewayFeeAmount,
            netAmount: request.netAmount,
            currency: request.currency,
            metadata: request.metadata,
            config: request.config,
        }));
        return {
            status: 'success',
            message: 'payment split registered successfully',
            data: {
                paymentSplit: dtoOut.paymentSplit,
                paymentSplitRecipients: dtoOut.paymentSplitRecipients,
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
exports.RegisterPaymentSplitController = RegisterPaymentSplitController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_payment_split_request_1.RegisterPaymentSplitRequest, String]),
    __metadata("design:returntype", Promise)
], RegisterPaymentSplitController.prototype, "handle", null);
exports.RegisterPaymentSplitController = RegisterPaymentSplitController = __decorate([
    (0, common_1.Controller)('payment-splits'),
    __metadata("design:paramtypes", [register_payment_split_use_case_1.RegisterPaymentSplitUseCase])
], RegisterPaymentSplitController);
//# sourceMappingURL=register-payment-split.controller.js.map