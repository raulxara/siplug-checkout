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
exports.FindPaymentTransactionByGatewayTransactionIdService = void 0;
const common_1 = require("@nestjs/common");
const payment_transactions_tokens_1 = require("../../tokens/payment-transactions.tokens");
const find_payment_transaction_by_gateway_transaction_id_dto_out_1 = require("./dtos/find-payment-transaction-by-gateway-transaction-id.dto-out");
let FindPaymentTransactionByGatewayTransactionIdService = class FindPaymentTransactionByGatewayTransactionIdService {
    paymentTransactionsRepository;
    constructor(paymentTransactionsRepository) {
        this.paymentTransactionsRepository = paymentTransactionsRepository;
    }
    async exec(dtoIn) {
        try {
            const paymentTransaction = await this.paymentTransactionsRepository.findByGatewayTransactionId(dtoIn.gatewayTransactionId);
            if (paymentTransaction === null) {
                throw new Error('payment transaction not found');
            }
            return new find_payment_transaction_by_gateway_transaction_id_dto_out_1.FindPaymentTransactionByGatewayTransactionIdDtoOut(paymentTransaction);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on find payment transaction by gateway transaction id';
            throw new Error(message);
        }
    }
};
exports.FindPaymentTransactionByGatewayTransactionIdService = FindPaymentTransactionByGatewayTransactionIdService;
exports.FindPaymentTransactionByGatewayTransactionIdService = FindPaymentTransactionByGatewayTransactionIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_transactions_tokens_1.PAYMENT_TRANSACTIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindPaymentTransactionByGatewayTransactionIdService);
//# sourceMappingURL=find-payment-transaction-by-gateway-transaction-id.service.js.map