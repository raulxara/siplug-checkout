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
exports.CreatePaymentSplitService = void 0;
const common_1 = require("@nestjs/common");
const payment_split_entity_1 = require("../../entities/payment-split.entity");
const payment_splits_tokens_1 = require("../../tokens/payment-splits.tokens");
const create_payment_split_dto_out_1 = require("./dtos/create-payment-split.dto-out");
let CreatePaymentSplitService = class CreatePaymentSplitService {
    paymentSplitsRepository;
    constructor(paymentSplitsRepository) {
        this.paymentSplitsRepository = paymentSplitsRepository;
    }
    async exec(dtoIn) {
        const entity = new payment_split_entity_1.PaymentSplitEntity(this.paymentSplitsRepository);
        entity.officeId = dtoIn.officeId;
        entity.clientId = dtoIn.clientId;
        entity.checkoutSessionId = dtoIn.checkoutSessionId;
        entity.paymentTransactionId = dtoIn.paymentTransactionId;
        entity.subscriptionId = dtoIn.subscriptionId;
        entity.subscriptionInvoiceId = dtoIn.subscriptionInvoiceId;
        entity.splitRuleId = dtoIn.splitRuleId;
        entity.gatewayProvider = dtoIn.gatewayProvider;
        entity.gatewaySplitId = dtoIn.gatewaySplitId;
        entity.amount = dtoIn.amount;
        entity.currency = dtoIn.currency;
        entity.providerPayload = dtoIn.providerPayload;
        entity.providerResponse = dtoIn.providerResponse;
        entity.gatewayResponse = dtoIn.gatewayResponse;
        entity.metadata = dtoIn.metadata;
        entity.config = dtoIn.config;
        entity.changesHistory = [
            {
                source: 'CreatePaymentSplitService',
                action: 'created',
                createdAt: new Date().toISOString(),
            },
        ];
        entity.status = dtoIn.status ?? 'created';
        const created = await entity.create();
        return new create_payment_split_dto_out_1.CreatePaymentSplitDtoOut({
            id: created.id,
            _id: created._id,
            officeId: created.officeId,
            clientId: created.clientId,
            checkoutSessionId: created.checkoutSessionId,
            paymentTransactionId: created.paymentTransactionId,
            subscriptionId: created.subscriptionId,
            subscriptionInvoiceId: created.subscriptionInvoiceId,
            splitRuleId: created.splitRuleId,
            gatewayProvider: created.gatewayProvider,
            gatewaySplitId: created.gatewaySplitId,
            amount: created.amount,
            currency: created.currency,
            providerPayload: created.providerPayload,
            providerResponse: created.providerResponse,
            gatewayResponse: created.gatewayResponse,
            metadata: created.metadata,
            config: created.config,
            changesHistory: created.changesHistory,
            status: created.status,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }
};
exports.CreatePaymentSplitService = CreatePaymentSplitService;
exports.CreatePaymentSplitService = CreatePaymentSplitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreatePaymentSplitService);
//# sourceMappingURL=create-payment-split.service.js.map