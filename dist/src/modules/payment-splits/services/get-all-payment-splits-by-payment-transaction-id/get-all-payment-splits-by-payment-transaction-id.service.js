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
exports.GetAllPaymentSplitsByPaymentTransactionIdService = void 0;
const common_1 = require("@nestjs/common");
const payment_splits_tokens_1 = require("../../tokens/payment-splits.tokens");
const get_all_payment_splits_by_payment_transaction_id_dto_out_1 = require("./dtos/get-all-payment-splits-by-payment-transaction-id.dto-out");
let GetAllPaymentSplitsByPaymentTransactionIdService = class GetAllPaymentSplitsByPaymentTransactionIdService {
    paymentSplitsRepository;
    constructor(paymentSplitsRepository) {
        this.paymentSplitsRepository = paymentSplitsRepository;
    }
    async exec(dtoIn) {
        const paymentSplits = await this.paymentSplitsRepository.getAllByPaymentTransactionId(dtoIn.paymentTransactionId);
        return new get_all_payment_splits_by_payment_transaction_id_dto_out_1.GetAllPaymentSplitsByPaymentTransactionIdDtoOut(paymentSplits);
    }
};
exports.GetAllPaymentSplitsByPaymentTransactionIdService = GetAllPaymentSplitsByPaymentTransactionIdService;
exports.GetAllPaymentSplitsByPaymentTransactionIdService = GetAllPaymentSplitsByPaymentTransactionIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetAllPaymentSplitsByPaymentTransactionIdService);
//# sourceMappingURL=get-all-payment-splits-by-payment-transaction-id.service.js.map