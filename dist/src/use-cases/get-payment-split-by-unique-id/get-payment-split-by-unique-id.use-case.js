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
exports.GetPaymentSplitByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const get_all_payment_split_recipients_by_payment_split_id_dto_in_1 = require("../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in");
const get_all_payment_split_recipients_by_payment_split_id_service_1 = require("../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service");
const find_payment_split_by_unique_id_dto_in_1 = require("../../modules/payment-splits/services/find-payment-split-by-unique-id/dtos/find-payment-split-by-unique-id.dto-in");
const find_payment_split_by_unique_id_service_1 = require("../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_payment_split_by_unique_id_dto_out_1 = require("./dtos/get-payment-split-by-unique-id.dto-out");
let GetPaymentSplitByUniqueIdUseCase = class GetPaymentSplitByUniqueIdUseCase {
    findPaymentSplitByUniqueIdService;
    getAllPaymentSplitRecipientsByPaymentSplitIdService;
    resolveActorAuthorizationService;
    constructor(findPaymentSplitByUniqueIdService, getAllPaymentSplitRecipientsByPaymentSplitIdService, resolveActorAuthorizationService) {
        this.findPaymentSplitByUniqueIdService = findPaymentSplitByUniqueIdService;
        this.getAllPaymentSplitRecipientsByPaymentSplitIdService = getAllPaymentSplitRecipientsByPaymentSplitIdService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'paymentSplit',
            requiredAction: 'getPaymentSplitByUniqueId',
        });
        const paymentSplitDtoOut = await this.findPaymentSplitByUniqueIdService.exec(new find_payment_split_by_unique_id_dto_in_1.FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId));
        const paymentSplitRecipientsDtoOut = await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(new get_all_payment_split_recipients_by_payment_split_id_dto_in_1.GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(dtoIn.paymentSplitId));
        return new get_payment_split_by_unique_id_dto_out_1.GetPaymentSplitByUniqueIdDtoOut(paymentSplitDtoOut.paymentSplit, paymentSplitRecipientsDtoOut.paymentSplitRecipients);
    }
};
exports.GetPaymentSplitByUniqueIdUseCase = GetPaymentSplitByUniqueIdUseCase;
exports.GetPaymentSplitByUniqueIdUseCase = GetPaymentSplitByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_payment_split_by_unique_id_service_1.FindPaymentSplitByUniqueIdService,
        get_all_payment_split_recipients_by_payment_split_id_service_1.GetAllPaymentSplitRecipientsByPaymentSplitIdService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], GetPaymentSplitByUniqueIdUseCase);
//# sourceMappingURL=get-payment-split-by-unique-id.use-case.js.map