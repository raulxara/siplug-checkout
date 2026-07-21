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
exports.UpdatePaymentTransactionController = void 0;
const common_1 = require("@nestjs/common");
const update_payment_transaction_dto_in_1 = require("./dtos/update-payment-transaction.dto-in");
const update_payment_transaction_request_1 = require("./http/update-payment-transaction.request");
const update_payment_transaction_use_case_1 = require("./update-payment-transaction.use-case");
let UpdatePaymentTransactionController = class UpdatePaymentTransactionController {
    updatePaymentTransactionUseCase;
    constructor(updatePaymentTransactionUseCase) {
        this.updatePaymentTransactionUseCase = updatePaymentTransactionUseCase;
    }
    async handle(authorization, body) {
        try {
            const dtoOut = await this.updatePaymentTransactionUseCase.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionUseCaseDtoIn({
                token: this.extractBearerToken(authorization),
                paymentTransactionId: body.paymentTransactionId,
                status: body.status ?? null,
                gatewayStatus: body.gatewayStatus ?? null,
                processStatus: body.processStatus ?? null,
                processMessage: body.processMessage ?? null,
                qrCode: body.qrCode ?? null,
                qrCodeBase64: body.qrCodeBase64 ?? null,
                boletoUrl: body.boletoUrl ?? null,
                checkoutUrl: body.checkoutUrl ?? null,
                paidAt: body.paidAt ?? null,
                authorizedAt: body.authorizedAt ?? null,
                canceledAt: body.canceledAt ?? null,
                failedAt: body.failedAt ?? null,
                refundedAt: body.refundedAt ?? null,
                expiresAt: body.expiresAt ?? null,
                metadata: body.metadata ?? null,
                config: body.config ?? null,
            }));
            return {
                status: 'success',
                message: 'payment transaction updated successfully',
                data: {
                    paymentTransaction: dtoOut.paymentTransaction,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update payment transaction';
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
exports.UpdatePaymentTransactionController = UpdatePaymentTransactionController;
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_payment_transaction_request_1.UpdatePaymentTransactionRequest]),
    __metadata("design:returntype", Promise)
], UpdatePaymentTransactionController.prototype, "handle", null);
exports.UpdatePaymentTransactionController = UpdatePaymentTransactionController = __decorate([
    (0, common_1.Controller)('payment-transactions'),
    __metadata("design:paramtypes", [update_payment_transaction_use_case_1.UpdatePaymentTransactionUseCase])
], UpdatePaymentTransactionController);
//# sourceMappingURL=update-payment-transaction.controller.js.map