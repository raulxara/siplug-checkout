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
exports.ReservePaymentSplitDispatchService = void 0;
const common_1 = require("@nestjs/common");
const payment_splits_tokens_1 = require("../../tokens/payment-splits.tokens");
const reserve_payment_split_dispatch_dto_out_1 = require("./dtos/reserve-payment-split-dispatch.dto-out");
let ReservePaymentSplitDispatchService = class ReservePaymentSplitDispatchService {
    paymentSplitsRepository;
    constructor(paymentSplitsRepository) {
        this.paymentSplitsRepository = paymentSplitsRepository;
    }
    async exec(dtoIn) {
        const paymentSplit = await this.paymentSplitsRepository.findByUniqueId(dtoIn.paymentSplitId);
        if (paymentSplit === null) {
            return new reserve_payment_split_dispatch_dto_out_1.ReservePaymentSplitDispatchDtoOut(false, 'payment split not found', dtoIn.paymentSplitId, null, null, null, null);
        }
        const previousStatus = String(paymentSplit.status ?? '').trim();
        if (!['created', 'failed'].includes(previousStatus)) {
            return new reserve_payment_split_dispatch_dto_out_1.ReservePaymentSplitDispatchDtoOut(false, `payment split status ${previousStatus} is not available for dispatch reservation`, dtoIn.paymentSplitId, previousStatus, previousStatus, null, paymentSplit);
        }
        const reservation = {
            provider: dtoIn.provider,
            sourceTransactionId: dtoIn.sourceTransactionId,
            paymentTransactionId: dtoIn.paymentTransactionId,
            webhookEventId: dtoIn.webhookEventId,
            webhookEventType: dtoIn.webhookEventType,
            reservedAt: new Date().toISOString(),
            source: dtoIn.source,
        };
        const updatedPaymentSplit = await this.paymentSplitsRepository.updateByUniqueId(dtoIn.paymentSplitId, {
            status: 'pending_gateway',
            providerPayload: {
                ...(this.toObject(paymentSplit.providerPayload) ?? {}),
                dispatchReservation: reservation,
            },
            metadata: {
                ...(this.toObject(paymentSplit.metadata) ?? {}),
                lastDispatchReservation: reservation,
            },
            source: dtoIn.source,
        });
        return new reserve_payment_split_dispatch_dto_out_1.ReservePaymentSplitDispatchDtoOut(true, 'payment split dispatch reserved successfully', dtoIn.paymentSplitId, previousStatus, updatedPaymentSplit.status, reservation, updatedPaymentSplit);
    }
    toObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
};
exports.ReservePaymentSplitDispatchService = ReservePaymentSplitDispatchService;
exports.ReservePaymentSplitDispatchService = ReservePaymentSplitDispatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ReservePaymentSplitDispatchService);
//# sourceMappingURL=reserve-payment-split-dispatch.service.js.map