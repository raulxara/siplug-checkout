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
exports.UpdateSplitRecipientUseCase = void 0;
const common_1 = require("@nestjs/common");
const find_split_recipient_by_unique_id_dto_in_1 = require("../../modules/split-recipients/services/find-split-recipient-by-unique-id/dtos/find-split-recipient-by-unique-id.dto-in");
const find_split_recipient_by_unique_id_service_1 = require("../../modules/split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service");
const update_split_recipient_dto_in_1 = require("../../modules/split-recipients/services/update-split-recipient/dtos/update-split-recipient.dto-in");
const update_split_recipient_service_1 = require("../../modules/split-recipients/services/update-split-recipient/update-split-recipient.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const update_split_recipient_dto_out_1 = require("./dtos/update-split-recipient.dto-out");
let UpdateSplitRecipientUseCase = class UpdateSplitRecipientUseCase {
    findSplitRecipientByUniqueIdService;
    updateSplitRecipientService;
    resolveActorAuthorizationService;
    constructor(findSplitRecipientByUniqueIdService, updateSplitRecipientService, resolveActorAuthorizationService) {
        this.findSplitRecipientByUniqueIdService = findSplitRecipientByUniqueIdService;
        this.updateSplitRecipientService = updateSplitRecipientService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'splitRecipient',
            requiredAction: 'updateSplitRecipient',
        });
        await this.findSplitRecipientByUniqueIdService.exec(new find_split_recipient_by_unique_id_dto_in_1.FindSplitRecipientByUniqueIdDtoIn(dtoIn.splitRecipientId));
        const splitRecipientDtoOut = await this.updateSplitRecipientService.exec(new update_split_recipient_dto_in_1.UpdateSplitRecipientDtoIn(dtoIn.splitRecipientId, dtoIn.officeId, dtoIn.clientId, dtoIn.gatewayId, dtoIn.apiCredentialId, dtoIn.name, dtoIn.documentType, dtoIn.documentValue, dtoIn.email, dtoIn.gatewayProvider, dtoIn.gatewayRecipientId, dtoIn.gatewayAccountId, dtoIn.bankData, dtoIn.metadata, dtoIn.config, dtoIn.status, 'UpdateSplitRecipientUseCase'));
        return new update_split_recipient_dto_out_1.UpdateSplitRecipientDtoOut(splitRecipientDtoOut.splitRecipient);
    }
};
exports.UpdateSplitRecipientUseCase = UpdateSplitRecipientUseCase;
exports.UpdateSplitRecipientUseCase = UpdateSplitRecipientUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_split_recipient_by_unique_id_service_1.FindSplitRecipientByUniqueIdService,
        update_split_recipient_service_1.UpdateSplitRecipientService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], UpdateSplitRecipientUseCase);
//# sourceMappingURL=update-split-recipient.use-case.js.map