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
exports.UpdatePaymentSplitLifecycleUseCase = void 0;
const common_1 = require("@nestjs/common");
const get_all_payment_split_recipients_by_payment_split_id_dto_in_1 = require("../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in");
const get_all_payment_split_recipients_by_payment_split_id_service_1 = require("../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service");
const update_payment_split_recipient_status_dto_in_1 = require("../../modules/payment-split-recipients/services/update-payment-split-recipient-status/dtos/update-payment-split-recipient-status.dto-in");
const update_payment_split_recipient_status_service_1 = require("../../modules/payment-split-recipients/services/update-payment-split-recipient-status/update-payment-split-recipient-status.service");
const find_payment_split_by_unique_id_dto_in_1 = require("../../modules/payment-splits/services/find-payment-split-by-unique-id/dtos/find-payment-split-by-unique-id.dto-in");
const find_payment_split_by_unique_id_service_1 = require("../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service");
const update_payment_split_status_dto_in_1 = require("../../modules/payment-splits/services/update-payment-split-status/dtos/update-payment-split-status.dto-in");
const update_payment_split_status_service_1 = require("../../modules/payment-splits/services/update-payment-split-status/update-payment-split-status.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const update_payment_split_lifecycle_dto_out_1 = require("./dtos/update-payment-split-lifecycle.dto-out");
let UpdatePaymentSplitLifecycleUseCase = class UpdatePaymentSplitLifecycleUseCase {
    resolveActorAuthorizationService;
    findPaymentSplitByUniqueIdService;
    updatePaymentSplitStatusService;
    getAllPaymentSplitRecipientsByPaymentSplitIdService;
    updatePaymentSplitRecipientStatusService;
    constructor(resolveActorAuthorizationService, findPaymentSplitByUniqueIdService, updatePaymentSplitStatusService, getAllPaymentSplitRecipientsByPaymentSplitIdService, updatePaymentSplitRecipientStatusService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findPaymentSplitByUniqueIdService = findPaymentSplitByUniqueIdService;
        this.updatePaymentSplitStatusService = updatePaymentSplitStatusService;
        this.getAllPaymentSplitRecipientsByPaymentSplitIdService = getAllPaymentSplitRecipientsByPaymentSplitIdService;
        this.updatePaymentSplitRecipientStatusService = updatePaymentSplitRecipientStatusService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'paymentSplit',
            requiredAction: 'updatePaymentSplitLifecycle',
        });
        await this.findPaymentSplitByUniqueIdService.exec(new find_payment_split_by_unique_id_dto_in_1.FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId));
        const currentRecipientsDtoOut = await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(new get_all_payment_split_recipients_by_payment_split_id_dto_in_1.GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(dtoIn.paymentSplitId));
        const paymentSplitDtoOut = await this.updatePaymentSplitStatusService.exec(new update_payment_split_status_dto_in_1.UpdatePaymentSplitStatusDtoIn(dtoIn.paymentSplitId, dtoIn.status, dtoIn.gatewaySplitId, dtoIn.providerPayload, dtoIn.providerResponse, dtoIn.gatewayResponse, dtoIn.metadata, dtoIn.config, 'UpdatePaymentSplitLifecycleUseCase'));
        const recipientsToUpdate = dtoIn.recipients.length > 0
            ? dtoIn.recipients
            : this.buildRecipientsFromCurrentList(currentRecipientsDtoOut.paymentSplitRecipients, dtoIn.status);
        for (const recipient of recipientsToUpdate) {
            const currentRecipient = this.resolveCurrentRecipient(recipient, currentRecipientsDtoOut.paymentSplitRecipients);
            await this.updatePaymentSplitRecipientStatusService.exec(new update_payment_split_recipient_status_dto_in_1.UpdatePaymentSplitRecipientStatusDtoIn(String(currentRecipient._id), recipient.status ?? dtoIn.status, recipient.gatewayRecipientId, recipient.gatewayTransferId, recipient.providerPayload, recipient.providerResponse, recipient.gatewayResponse, recipient.metadata, recipient.config, 'UpdatePaymentSplitLifecycleUseCase'));
        }
        const updatedRecipientsDtoOut = await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(new get_all_payment_split_recipients_by_payment_split_id_dto_in_1.GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(dtoIn.paymentSplitId));
        return new update_payment_split_lifecycle_dto_out_1.UpdatePaymentSplitLifecycleDtoOut(paymentSplitDtoOut.paymentSplit, updatedRecipientsDtoOut.paymentSplitRecipients);
    }
    buildRecipientsFromCurrentList(currentRecipients, status) {
        return currentRecipients.map((recipient) => ({
            paymentSplitRecipientId: String(recipient._id),
            splitRecipientId: String(recipient.splitRecipientId),
            status,
            gatewayRecipientId: null,
            gatewayTransferId: null,
            providerPayload: null,
            providerResponse: null,
            gatewayResponse: null,
            metadata: null,
            config: null,
        }));
    }
    resolveCurrentRecipient(recipient, currentRecipients) {
        if (recipient.paymentSplitRecipientId !== null) {
            const foundByPaymentSplitRecipientId = currentRecipients.find((current) => String(current._id) === recipient.paymentSplitRecipientId);
            if (foundByPaymentSplitRecipientId) {
                return foundByPaymentSplitRecipientId;
            }
        }
        if (recipient.splitRecipientId !== null) {
            const foundBySplitRecipientId = currentRecipients.find((current) => String(current.splitRecipientId) === recipient.splitRecipientId);
            if (foundBySplitRecipientId) {
                return foundBySplitRecipientId;
            }
        }
        throw new Error('payment split recipient does not belong to payment split');
    }
};
exports.UpdatePaymentSplitLifecycleUseCase = UpdatePaymentSplitLifecycleUseCase;
exports.UpdatePaymentSplitLifecycleUseCase = UpdatePaymentSplitLifecycleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_payment_split_by_unique_id_service_1.FindPaymentSplitByUniqueIdService,
        update_payment_split_status_service_1.UpdatePaymentSplitStatusService,
        get_all_payment_split_recipients_by_payment_split_id_service_1.GetAllPaymentSplitRecipientsByPaymentSplitIdService,
        update_payment_split_recipient_status_service_1.UpdatePaymentSplitRecipientStatusService])
], UpdatePaymentSplitLifecycleUseCase);
//# sourceMappingURL=update-payment-split-lifecycle.use-case.js.map