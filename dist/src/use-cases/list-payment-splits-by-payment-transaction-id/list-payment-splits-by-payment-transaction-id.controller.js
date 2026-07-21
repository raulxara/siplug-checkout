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
exports.ListPaymentSplitsByPaymentTransactionIdController = void 0;
const common_1 = require("@nestjs/common");
const list_payment_splits_by_payment_transaction_id_dto_in_1 = require("./dtos/list-payment-splits-by-payment-transaction-id.dto-in");
const list_payment_splits_by_payment_transaction_id_request_1 = require("./http/list-payment-splits-by-payment-transaction-id.request");
const list_payment_splits_by_payment_transaction_id_use_case_1 = require("./list-payment-splits-by-payment-transaction-id.use-case");
let ListPaymentSplitsByPaymentTransactionIdController = class ListPaymentSplitsByPaymentTransactionIdController {
    listPaymentSplitsByPaymentTransactionIdUseCase;
    constructor(listPaymentSplitsByPaymentTransactionIdUseCase) {
        this.listPaymentSplitsByPaymentTransactionIdUseCase = listPaymentSplitsByPaymentTransactionIdUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.listPaymentSplitsByPaymentTransactionIdUseCase.exec(new list_payment_splits_by_payment_transaction_id_dto_in_1.ListPaymentSplitsByPaymentTransactionIdDtoIn({
            token: this.resolveToken(authorization, request.token),
            paymentTransactionId: request.paymentTransactionId,
        }));
        return {
            status: 'success',
            message: 'payment splits listed by payment transaction successfully',
            data: {
                paymentSplits: dtoOut.paymentSplits,
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
exports.ListPaymentSplitsByPaymentTransactionIdController = ListPaymentSplitsByPaymentTransactionIdController;
__decorate([
    (0, common_1.Post)('list-by-payment-transaction-id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_payment_splits_by_payment_transaction_id_request_1.ListPaymentSplitsByPaymentTransactionIdRequest, String]),
    __metadata("design:returntype", Promise)
], ListPaymentSplitsByPaymentTransactionIdController.prototype, "handle", null);
exports.ListPaymentSplitsByPaymentTransactionIdController = ListPaymentSplitsByPaymentTransactionIdController = __decorate([
    (0, common_1.Controller)('payment-splits'),
    __metadata("design:paramtypes", [list_payment_splits_by_payment_transaction_id_use_case_1.ListPaymentSplitsByPaymentTransactionIdUseCase])
], ListPaymentSplitsByPaymentTransactionIdController);
//# sourceMappingURL=list-payment-splits-by-payment-transaction-id.controller.js.map