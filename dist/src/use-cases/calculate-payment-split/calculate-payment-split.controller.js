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
exports.CalculatePaymentSplitController = void 0;
const common_1 = require("@nestjs/common");
const calculate_payment_split_dto_in_1 = require("./dtos/calculate-payment-split.dto-in");
const calculate_payment_split_request_1 = require("./http/calculate-payment-split.request");
const calculate_payment_split_use_case_1 = require("./calculate-payment-split.use-case");
let CalculatePaymentSplitController = class CalculatePaymentSplitController {
    calculatePaymentSplitUseCase;
    constructor(calculatePaymentSplitUseCase) {
        this.calculatePaymentSplitUseCase = calculatePaymentSplitUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.calculatePaymentSplitUseCase.exec(new calculate_payment_split_dto_in_1.CalculatePaymentSplitDtoIn({
            token: this.resolveToken(authorization, request.token),
            splitRuleId: request.splitRuleId,
            grossAmount: request.grossAmount,
            gatewayFeeAmount: request.gatewayFeeAmount,
            netAmount: request.netAmount,
            currency: request.currency,
            metadata: request.metadata,
        }));
        return {
            status: 'success',
            message: 'payment split calculated successfully',
            data: {
                paymentSplitCalculation: dtoOut.paymentSplitCalculation,
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
exports.CalculatePaymentSplitController = CalculatePaymentSplitController;
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_payment_split_request_1.CalculatePaymentSplitRequest, String]),
    __metadata("design:returntype", Promise)
], CalculatePaymentSplitController.prototype, "handle", null);
exports.CalculatePaymentSplitController = CalculatePaymentSplitController = __decorate([
    (0, common_1.Controller)('payment-splits'),
    __metadata("design:paramtypes", [calculate_payment_split_use_case_1.CalculatePaymentSplitUseCase])
], CalculatePaymentSplitController);
//# sourceMappingURL=calculate-payment-split.controller.js.map