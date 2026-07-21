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
exports.FindPaymentSplitByUniqueIdService = void 0;
const common_1 = require("@nestjs/common");
const payment_splits_tokens_1 = require("../../tokens/payment-splits.tokens");
const find_payment_split_by_unique_id_dto_out_1 = require("./dtos/find-payment-split-by-unique-id.dto-out");
let FindPaymentSplitByUniqueIdService = class FindPaymentSplitByUniqueIdService {
    paymentSplitsRepository;
    constructor(paymentSplitsRepository) {
        this.paymentSplitsRepository = paymentSplitsRepository;
    }
    async exec(dtoIn) {
        const paymentSplit = await this.paymentSplitsRepository.findByUniqueId(dtoIn.paymentSplitId);
        if (paymentSplit === null) {
            throw new Error('payment split not found');
        }
        return new find_payment_split_by_unique_id_dto_out_1.FindPaymentSplitByUniqueIdDtoOut(paymentSplit);
    }
};
exports.FindPaymentSplitByUniqueIdService = FindPaymentSplitByUniqueIdService;
exports.FindPaymentSplitByUniqueIdService = FindPaymentSplitByUniqueIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindPaymentSplitByUniqueIdService);
//# sourceMappingURL=find-payment-split-by-unique-id.service.js.map