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
exports.SyncPaymentTransactionStatusController = void 0;
const common_1 = require("@nestjs/common");
const sync_payment_transaction_status_dto_in_1 = require("./dtos/sync-payment-transaction-status.dto-in");
const sync_payment_transaction_status_request_1 = require("./http/sync-payment-transaction-status.request");
const sync_payment_transaction_status_use_case_1 = require("./sync-payment-transaction-status.use-case");
let SyncPaymentTransactionStatusController = class SyncPaymentTransactionStatusController {
    syncPaymentTransactionStatusUseCase;
    constructor(syncPaymentTransactionStatusUseCase) {
        this.syncPaymentTransactionStatusUseCase = syncPaymentTransactionStatusUseCase;
    }
    async handle(authorization, body) {
        try {
            const dtoOut = await this.syncPaymentTransactionStatusUseCase.exec(new sync_payment_transaction_status_dto_in_1.SyncPaymentTransactionStatusDtoIn({
                token: this.extractBearerToken(authorization),
                paymentTransactionId: body.paymentTransactionId,
                force: body.force ?? false,
            }));
            return {
                status: 'success',
                message: 'payment transaction status synchronized successfully',
                data: {
                    synced: dtoOut.synced,
                    message: dtoOut.message,
                    paymentTransaction: dtoOut.paymentTransaction,
                    checkoutSession: dtoOut.checkoutSession,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on sync payment transaction status';
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
exports.SyncPaymentTransactionStatusController = SyncPaymentTransactionStatusController;
__decorate([
    (0, common_1.Post)('sync-status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, sync_payment_transaction_status_request_1.SyncPaymentTransactionStatusRequest]),
    __metadata("design:returntype", Promise)
], SyncPaymentTransactionStatusController.prototype, "handle", null);
exports.SyncPaymentTransactionStatusController = SyncPaymentTransactionStatusController = __decorate([
    (0, common_1.Controller)('payment-transactions'),
    __metadata("design:paramtypes", [sync_payment_transaction_status_use_case_1.SyncPaymentTransactionStatusUseCase])
], SyncPaymentTransactionStatusController);
//# sourceMappingURL=sync-payment-transaction-status.controller.js.map