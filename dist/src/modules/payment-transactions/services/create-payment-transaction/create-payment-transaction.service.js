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
exports.CreatePaymentTransactionService = void 0;
const common_1 = require("@nestjs/common");
const payment_transaction_entity_1 = require("../../entities/payment-transaction.entity");
const payment_transactions_tokens_1 = require("../../tokens/payment-transactions.tokens");
const create_payment_transaction_dto_out_1 = require("./dtos/create-payment-transaction.dto-out");
let CreatePaymentTransactionService = class CreatePaymentTransactionService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new payment_transaction_entity_1.PaymentTransactionEntity(this.repository);
            entity.officeId = dtoIn.officeId;
            entity.clientId = dtoIn.clientId;
            entity.checkoutSessionId = dtoIn.checkoutSessionId;
            entity.paymentCustomerId = dtoIn.paymentCustomerId;
            entity.gatewayId = dtoIn.gatewayId;
            entity.apiCredentialId = dtoIn.apiCredentialId;
            entity.gatewayTransactionId = dtoIn.gatewayTransactionId;
            entity.externalReference = dtoIn.externalReference;
            entity.idempotencyKey = dtoIn.idempotencyKey;
            entity.paymentType = dtoIn.paymentType;
            entity.paymentMethod = dtoIn.paymentMethod;
            entity.amount = dtoIn.amount;
            entity.currency = dtoIn.currency;
            entity.installments = dtoIn.installments;
            entity.installmentAmount = dtoIn.installmentAmount;
            entity.interestAmount = dtoIn.interestAmount;
            entity.interestType = dtoIn.interestType;
            entity.gatewayStatus = dtoIn.gatewayStatus;
            entity.status = dtoIn.status;
            entity.processStatus = dtoIn.processStatus;
            entity.processMessage = dtoIn.processMessage;
            entity.providerPayload = dtoIn.providerPayload;
            entity.providerResponse = dtoIn.providerResponse;
            entity.gatewayResponse = dtoIn.gatewayResponse;
            entity.qrCode = dtoIn.qrCode;
            entity.qrCodeBase64 = dtoIn.qrCodeBase64;
            entity.boletoUrl = dtoIn.boletoUrl;
            entity.checkoutUrl = dtoIn.checkoutUrl;
            entity.splitRequired = dtoIn.splitRequired;
            entity.hasSplit = dtoIn.hasSplit;
            entity.paidAt = dtoIn.paidAt;
            entity.authorizedAt = dtoIn.authorizedAt;
            entity.canceledAt = dtoIn.canceledAt;
            entity.failedAt = dtoIn.failedAt;
            entity.refundedAt = dtoIn.refundedAt;
            entity.expiresAt = dtoIn.expiresAt;
            entity.metadata = dtoIn.metadata;
            entity.config = dtoIn.config;
            await entity.create();
            return create_payment_transaction_dto_out_1.CreatePaymentTransactionDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on create payment transaction';
            throw new Error(message);
        }
    }
};
exports.CreatePaymentTransactionService = CreatePaymentTransactionService;
exports.CreatePaymentTransactionService = CreatePaymentTransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_transactions_tokens_1.PAYMENT_TRANSACTIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreatePaymentTransactionService);
//# sourceMappingURL=create-payment-transaction.service.js.map