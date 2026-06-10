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
exports.SyncSplitRuleRecipientsUseCase = void 0;
const common_1 = require("@nestjs/common");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const find_split_recipient_by_unique_id_dto_in_1 = require("../../modules/split-recipients/services/find-split-recipient-by-unique-id/dtos/find-split-recipient-by-unique-id.dto-in");
const find_split_recipient_by_unique_id_service_1 = require("../../modules/split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service");
const find_split_rule_by_unique_id_dto_in_1 = require("../../modules/split-rules/services/find-split-rule-by-unique-id/dtos/find-split-rule-by-unique-id.dto-in");
const find_split_rule_by_unique_id_service_1 = require("../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service");
const create_split_rule_recipient_dto_in_1 = require("../../modules/split-rule-recipients/services/create-split-rule-recipient/dtos/create-split-rule-recipient.dto-in");
const create_split_rule_recipient_service_1 = require("../../modules/split-rule-recipients/services/create-split-rule-recipient/create-split-rule-recipient.service");
const find_split_rule_recipient_by_rule_and_recipient_dto_in_1 = require("../../modules/split-rule-recipients/services/find-split-rule-recipient-by-rule-and-recipient/dtos/find-split-rule-recipient-by-rule-and-recipient.dto-in");
const find_split_rule_recipient_by_rule_and_recipient_service_1 = require("../../modules/split-rule-recipients/services/find-split-rule-recipient-by-rule-and-recipient/find-split-rule-recipient-by-rule-and-recipient.service");
const get_all_split_rule_recipients_by_split_rule_id_dto_in_1 = require("../../modules/split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/dtos/get-all-split-rule-recipients-by-split-rule-id.dto-in");
const get_all_split_rule_recipients_by_split_rule_id_service_1 = require("../../modules/split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/get-all-split-rule-recipients-by-split-rule-id.service");
const update_split_rule_recipient_dto_in_1 = require("../../modules/split-rule-recipients/services/update-split-rule-recipient/dtos/update-split-rule-recipient.dto-in");
const update_split_rule_recipient_service_1 = require("../../modules/split-rule-recipients/services/update-split-rule-recipient/update-split-rule-recipient.service");
const sync_split_rule_recipients_dto_out_1 = require("./dtos/sync-split-rule-recipients.dto-out");
let SyncSplitRuleRecipientsUseCase = class SyncSplitRuleRecipientsUseCase {
    resolveActorAuthorizationService;
    findSplitRuleByUniqueIdService;
    findSplitRecipientByUniqueIdService;
    findSplitRuleRecipientByRuleAndRecipientService;
    createSplitRuleRecipientService;
    updateSplitRuleRecipientService;
    getAllSplitRuleRecipientsBySplitRuleIdService;
    constructor(resolveActorAuthorizationService, findSplitRuleByUniqueIdService, findSplitRecipientByUniqueIdService, findSplitRuleRecipientByRuleAndRecipientService, createSplitRuleRecipientService, updateSplitRuleRecipientService, getAllSplitRuleRecipientsBySplitRuleIdService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findSplitRuleByUniqueIdService = findSplitRuleByUniqueIdService;
        this.findSplitRecipientByUniqueIdService = findSplitRecipientByUniqueIdService;
        this.findSplitRuleRecipientByRuleAndRecipientService = findSplitRuleRecipientByRuleAndRecipientService;
        this.createSplitRuleRecipientService = createSplitRuleRecipientService;
        this.updateSplitRuleRecipientService = updateSplitRuleRecipientService;
        this.getAllSplitRuleRecipientsBySplitRuleIdService = getAllSplitRuleRecipientsBySplitRuleIdService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'splitRuleRecipient',
            requiredAction: 'syncSplitRuleRecipients',
        });
        const splitRuleDtoOut = await this.findSplitRuleByUniqueIdService.exec(new find_split_rule_by_unique_id_dto_in_1.FindSplitRuleByUniqueIdDtoIn(dtoIn.splitRuleId));
        let createdCount = 0;
        let updatedCount = 0;
        let inactivatedCount = 0;
        const syncedRecipients = [];
        for (const recipient of dtoIn.recipients) {
            await this.validateSplitRecipientExists(recipient.splitRecipientId);
            const existingDtoOut = await this.findSplitRuleRecipientByRuleAndRecipientService.exec(new find_split_rule_recipient_by_rule_and_recipient_dto_in_1.FindSplitRuleRecipientByRuleAndRecipientDtoIn({
                splitRuleId: dtoIn.splitRuleId,
                splitRecipientId: recipient.splitRecipientId,
            }));
            if (existingDtoOut.splitRuleRecipient === null) {
                const created = await this.createRecipient(dtoIn.splitRuleId, recipient);
                createdCount++;
                syncedRecipients.push(created);
                continue;
            }
            const updated = await this.updateRecipient(String(existingDtoOut.splitRuleRecipient._id), recipient, 'active');
            updatedCount++;
            syncedRecipients.push(updated);
        }
        const currentRecipientsDtoOut = await this.getAllSplitRuleRecipientsBySplitRuleIdService.exec(new get_all_split_rule_recipients_by_split_rule_id_dto_in_1.GetAllSplitRuleRecipientsBySplitRuleIdDtoIn(dtoIn.splitRuleId));
        const receivedRecipientIds = new Set(dtoIn.recipients.map((recipient) => recipient.splitRecipientId));
        for (const current of currentRecipientsDtoOut.splitRuleRecipients) {
            const currentSplitRecipientId = String(current.splitRecipientId ?? '');
            if (receivedRecipientIds.has(currentSplitRecipientId)) {
                continue;
            }
            if (String(current.status ?? '') === 'inactive') {
                continue;
            }
            await this.updateSplitRuleRecipientService.exec(new update_split_rule_recipient_dto_in_1.UpdateSplitRuleRecipientDtoIn(String(current._id), null, null, null, null, null, null, null, null, null, null, 'inactive', 'SyncSplitRuleRecipientsUseCase'));
            inactivatedCount++;
        }
        return new sync_split_rule_recipients_dto_out_1.SyncSplitRuleRecipientsDtoOut(splitRuleDtoOut.splitRule, syncedRecipients, createdCount, updatedCount, inactivatedCount);
    }
    async validateSplitRecipientExists(splitRecipientId) {
        await this.findSplitRecipientByUniqueIdService.exec(new find_split_recipient_by_unique_id_dto_in_1.FindSplitRecipientByUniqueIdDtoIn(splitRecipientId));
    }
    async createRecipient(splitRuleId, recipient) {
        const created = await this.createSplitRuleRecipientService.exec(new create_split_rule_recipient_dto_in_1.CreateSplitRuleRecipientDtoIn(splitRuleId, recipient.splitRecipientId, recipient.role, recipient.percentage, recipient.fixedAmount, recipient.liableForGatewayFee, recipient.liableForRefund, recipient.priority, recipient.metadata, recipient.config, recipient.status));
        return created.splitRuleRecipient;
    }
    async updateRecipient(splitRuleRecipientId, recipient, status) {
        const updated = await this.updateSplitRuleRecipientService.exec(new update_split_rule_recipient_dto_in_1.UpdateSplitRuleRecipientDtoIn(splitRuleRecipientId, null, null, recipient.role, recipient.percentage, recipient.fixedAmount, recipient.liableForGatewayFee, recipient.liableForRefund, recipient.priority, recipient.metadata, recipient.config, status, 'SyncSplitRuleRecipientsUseCase'));
        return updated.splitRuleRecipient;
    }
};
exports.SyncSplitRuleRecipientsUseCase = SyncSplitRuleRecipientsUseCase;
exports.SyncSplitRuleRecipientsUseCase = SyncSplitRuleRecipientsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_split_rule_by_unique_id_service_1.FindSplitRuleByUniqueIdService,
        find_split_recipient_by_unique_id_service_1.FindSplitRecipientByUniqueIdService,
        find_split_rule_recipient_by_rule_and_recipient_service_1.FindSplitRuleRecipientByRuleAndRecipientService,
        create_split_rule_recipient_service_1.CreateSplitRuleRecipientService,
        update_split_rule_recipient_service_1.UpdateSplitRuleRecipientService,
        get_all_split_rule_recipients_by_split_rule_id_service_1.GetAllSplitRuleRecipientsBySplitRuleIdService])
], SyncSplitRuleRecipientsUseCase);
//# sourceMappingURL=sync-split-rule-recipients.use-case.js.map