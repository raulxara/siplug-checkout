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
exports.ListPaymentTransactionsController = void 0;
const common_1 = require("@nestjs/common");
const list_payment_transactions_dto_in_1 = require("./dtos/list-payment-transactions.dto-in");
const list_payment_transactions_use_case_1 = require("./list-payment-transactions.use-case");
let ListPaymentTransactionsController = class ListPaymentTransactionsController {
    listPaymentTransactionsUseCase;
    constructor(listPaymentTransactionsUseCase) {
        this.listPaymentTransactionsUseCase = listPaymentTransactionsUseCase;
    }
    async handle(authorization) {
        try {
            const dtoOut = await this.listPaymentTransactionsUseCase.exec(new list_payment_transactions_dto_in_1.ListPaymentTransactionsDtoIn({
                token: this.extractBearerToken(authorization),
            }));
            return {
                status: 'success',
                message: 'payment transactions listed successfully',
                data: {
                    paymentTransactions: dtoOut.paymentTransactions,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on list payment transactions';
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
exports.ListPaymentTransactionsController = ListPaymentTransactionsController;
__decorate([
    (0, common_1.Post)('list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListPaymentTransactionsController.prototype, "handle", null);
exports.ListPaymentTransactionsController = ListPaymentTransactionsController = __decorate([
    (0, common_1.Controller)('payment-transactions'),
    __metadata("design:paramtypes", [list_payment_transactions_use_case_1.ListPaymentTransactionsUseCase])
], ListPaymentTransactionsController);
//# sourceMappingURL=list-payment-transactions.controller.js.map