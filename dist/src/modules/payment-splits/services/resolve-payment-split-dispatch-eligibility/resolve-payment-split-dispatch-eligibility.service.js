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
exports.ResolvePaymentSplitDispatchEligibilityService = void 0;
const common_1 = require("@nestjs/common");
const payment_splits_tokens_1 = require("../../tokens/payment-splits.tokens");
const resolve_payment_split_dispatch_eligibility_dto_out_1 = require("./dtos/resolve-payment-split-dispatch-eligibility.dto-out");
let ResolvePaymentSplitDispatchEligibilityService = class ResolvePaymentSplitDispatchEligibilityService {
    paymentSplitsRepository;
    constructor(paymentSplitsRepository) {
        this.paymentSplitsRepository = paymentSplitsRepository;
    }
    async exec(dtoIn) {
        const paymentSplit = await this.paymentSplitsRepository.findByUniqueId(dtoIn.paymentSplitId);
        if (paymentSplit === null) {
            return new resolve_payment_split_dispatch_eligibility_dto_out_1.ResolvePaymentSplitDispatchEligibilityDtoOut(false, 'payment split not found', dtoIn.paymentSplitId, null, null);
        }
        const status = this.extractStatus(paymentSplit);
        if (['created', 'failed'].includes(status)) {
            return new resolve_payment_split_dispatch_eligibility_dto_out_1.ResolvePaymentSplitDispatchEligibilityDtoOut(true, `payment split status ${status} is eligible for dispatch`, dtoIn.paymentSplitId, status, paymentSplit);
        }
        if (status === 'pending_gateway') {
            return new resolve_payment_split_dispatch_eligibility_dto_out_1.ResolvePaymentSplitDispatchEligibilityDtoOut(false, 'payment split already has pending gateway dispatch', dtoIn.paymentSplitId, status, paymentSplit);
        }
        if (status === 'transferred') {
            return new resolve_payment_split_dispatch_eligibility_dto_out_1.ResolvePaymentSplitDispatchEligibilityDtoOut(false, 'payment split already transferred', dtoIn.paymentSplitId, status, paymentSplit);
        }
        if (status === 'refunded') {
            return new resolve_payment_split_dispatch_eligibility_dto_out_1.ResolvePaymentSplitDispatchEligibilityDtoOut(false, 'payment split already refunded', dtoIn.paymentSplitId, status, paymentSplit);
        }
        return new resolve_payment_split_dispatch_eligibility_dto_out_1.ResolvePaymentSplitDispatchEligibilityDtoOut(false, `payment split status ${status} is not eligible for dispatch`, dtoIn.paymentSplitId, status, paymentSplit);
    }
    extractStatus(paymentSplit) {
        return String(paymentSplit.status ?? '').trim();
    }
};
exports.ResolvePaymentSplitDispatchEligibilityService = ResolvePaymentSplitDispatchEligibilityService;
exports.ResolvePaymentSplitDispatchEligibilityService = ResolvePaymentSplitDispatchEligibilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ResolvePaymentSplitDispatchEligibilityService);
//# sourceMappingURL=resolve-payment-split-dispatch-eligibility.service.js.map