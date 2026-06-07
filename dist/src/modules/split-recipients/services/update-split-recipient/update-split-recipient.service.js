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
exports.UpdateSplitRecipientService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const split_recipients_tokens_1 = require("../../tokens/split-recipients.tokens");
const update_split_recipient_dto_out_1 = require("./dtos/update-split-recipient.dto-out");
let UpdateSplitRecipientService = class UpdateSplitRecipientService {
    splitRecipientsRepository;
    buildChangesHistoryService;
    constructor(splitRecipientsRepository, buildChangesHistoryService) {
        this.splitRecipientsRepository = splitRecipientsRepository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        const current = await this.splitRecipientsRepository.findByUniqueId(dtoIn._id);
        if (current === null) {
            throw new Error('split recipient not found');
        }
        const newDataForHistory = this.buildNewDataForHistory(dtoIn);
        const changesHistory = this.buildChangesHistoryService.exec({
            currentChangesHistory: current.changesHistory ?? null,
            oldData: current,
            newData: newDataForHistory,
            source: dtoIn.source,
        });
        const updated = await this.splitRecipientsRepository.updateByUniqueId(dtoIn._id, {
            office_id: dtoIn.officeId,
            client_id: dtoIn.clientId,
            gateway_id: dtoIn.gatewayId,
            api_credential_id: dtoIn.apiCredentialId,
            name: dtoIn.name,
            document_type: dtoIn.documentType,
            document_value: dtoIn.documentValue,
            email: dtoIn.email,
            gateway_provider: dtoIn.gatewayProvider,
            gateway_recipient_id: dtoIn.gatewayRecipientId,
            gateway_account_id: dtoIn.gatewayAccountId,
            bank_data: dtoIn.bankData,
            metadata: dtoIn.metadata,
            config: dtoIn.config,
            changes_history: changesHistory,
            status: dtoIn.status,
        });
        return new update_split_recipient_dto_out_1.UpdateSplitRecipientDtoOut(updated);
    }
    buildNewDataForHistory(dtoIn) {
        const newData = {};
        this.addIfNotNull(newData, 'officeId', dtoIn.officeId);
        this.addIfNotNull(newData, 'clientId', dtoIn.clientId);
        this.addIfNotNull(newData, 'gatewayId', dtoIn.gatewayId);
        this.addIfNotNull(newData, 'apiCredentialId', dtoIn.apiCredentialId);
        this.addIfNotNull(newData, 'name', dtoIn.name);
        this.addIfNotNull(newData, 'documentType', dtoIn.documentType);
        this.addIfNotNull(newData, 'documentValue', dtoIn.documentValue);
        this.addIfNotNull(newData, 'email', dtoIn.email);
        this.addIfNotNull(newData, 'gatewayProvider', dtoIn.gatewayProvider);
        this.addIfNotNull(newData, 'gatewayRecipientId', dtoIn.gatewayRecipientId);
        this.addIfNotNull(newData, 'gatewayAccountId', dtoIn.gatewayAccountId);
        this.addIfNotNull(newData, 'bankData', dtoIn.bankData);
        this.addIfNotNull(newData, 'metadata', dtoIn.metadata);
        this.addIfNotNull(newData, 'config', dtoIn.config);
        this.addIfNotNull(newData, 'status', dtoIn.status);
        return newData;
    }
    addIfNotNull(target, key, value) {
        if (value !== null && value !== undefined) {
            target[key] = value;
        }
    }
};
exports.UpdateSplitRecipientService = UpdateSplitRecipientService;
exports.UpdateSplitRecipientService = UpdateSplitRecipientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(split_recipients_tokens_1.SPLIT_RECIPIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateSplitRecipientService);
//# sourceMappingURL=update-split-recipient.service.js.map