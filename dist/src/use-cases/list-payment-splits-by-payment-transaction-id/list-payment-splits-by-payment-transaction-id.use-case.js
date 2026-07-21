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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentSplitsByPaymentTransactionIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const get_all_payment_split_recipients_by_payment_split_id_dto_in_1 = require("../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in");
const get_all_payment_split_recipients_by_payment_split_id_service_1 = require("../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service");
const get_all_payment_splits_by_payment_transaction_id_dto_in_1 = require("../../modules/payment-splits/services/get-all-payment-splits-by-payment-transaction-id/dtos/get-all-payment-splits-by-payment-transaction-id.dto-in");
const get_all_payment_splits_by_payment_transaction_id_service_1 = require("../../modules/payment-splits/services/get-all-payment-splits-by-payment-transaction-id/get-all-payment-splits-by-payment-transaction-id.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const list_payment_splits_by_payment_transaction_id_dto_out_1 = require("./dtos/list-payment-splits-by-payment-transaction-id.dto-out");
let ListPaymentSplitsByPaymentTransactionIdUseCase = class ListPaymentSplitsByPaymentTransactionIdUseCase {
    getAllPaymentSplitsByPaymentTransactionIdService;
    getAllPaymentSplitRecipientsByPaymentSplitIdService;
    resolveActorAuthorizationService;
    constructor(getAllPaymentSplitsByPaymentTransactionIdService, getAllPaymentSplitRecipientsByPaymentSplitIdService, resolveActorAuthorizationService) {
        this.getAllPaymentSplitsByPaymentTransactionIdService = getAllPaymentSplitsByPaymentTransactionIdService;
        this.getAllPaymentSplitRecipientsByPaymentSplitIdService = getAllPaymentSplitRecipientsByPaymentSplitIdService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'paymentSplit',
            requiredAction: 'listPaymentSplitsByPaymentTransactionId',
        });
        const paymentSplitsDtoOut = await this.getAllPaymentSplitsByPaymentTransactionIdService.exec(new get_all_payment_splits_by_payment_transaction_id_dto_in_1.GetAllPaymentSplitsByPaymentTransactionIdDtoIn(dtoIn.paymentTransactionId));
        const paymentSplits = [];
        for (const paymentSplit of paymentSplitsDtoOut.paymentSplits) {
            const paymentSplitRecipientsDtoOut = await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(new get_all_payment_split_recipients_by_payment_split_id_dto_in_1.GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(String(paymentSplit._id)));
            paymentSplits.push({
                paymentSplit,
                paymentSplitRecipients: paymentSplitRecipientsDtoOut.paymentSplitRecipients,
            });
        }
        return new list_payment_splits_by_payment_transaction_id_dto_out_1.ListPaymentSplitsByPaymentTransactionIdDtoOut(paymentSplits);
    }
};
exports.ListPaymentSplitsByPaymentTransactionIdUseCase = ListPaymentSplitsByPaymentTransactionIdUseCase;
exports.ListPaymentSplitsByPaymentTransactionIdUseCase = ListPaymentSplitsByPaymentTransactionIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_all_payment_splits_by_payment_transaction_id_service_1.GetAllPaymentSplitsByPaymentTransactionIdService,
        get_all_payment_split_recipients_by_payment_split_id_service_1.GetAllPaymentSplitRecipientsByPaymentSplitIdService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], ListPaymentSplitsByPaymentTransactionIdUseCase);
//# sourceMappingURL=list-payment-splits-by-payment-transaction-id.use-case.js.map