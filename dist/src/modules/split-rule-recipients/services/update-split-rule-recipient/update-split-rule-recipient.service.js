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
exports.UpdateSplitRuleRecipientService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const split_rule_recipients_tokens_1 = require("../../tokens/split-rule-recipients.tokens");
const update_split_rule_recipient_dto_out_1 = require("./dtos/update-split-rule-recipient.dto-out");
let UpdateSplitRuleRecipientService = class UpdateSplitRuleRecipientService {
    splitRuleRecipientsRepository;
    buildChangesHistoryService;
    constructor(splitRuleRecipientsRepository, buildChangesHistoryService) {
        this.splitRuleRecipientsRepository = splitRuleRecipientsRepository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        const current = await this.splitRuleRecipientsRepository.findByUniqueId(dtoIn._id);
        if (current === null) {
            throw new Error('split rule recipient not found');
        }
        const newDataForHistory = this.buildNewDataForHistory(dtoIn);
        const changesHistory = this.buildChangesHistoryService.exec({
            currentChangesHistory: current.changesHistory ?? null,
            oldData: current,
            newData: newDataForHistory,
            source: dtoIn.source,
        });
        const updated = await this.splitRuleRecipientsRepository.updateByUniqueId(dtoIn._id, {
            split_rule_id: dtoIn.splitRuleId,
            split_recipient_id: dtoIn.splitRecipientId,
            role: dtoIn.role,
            percentage: dtoIn.percentage,
            fixed_amount: dtoIn.fixedAmount,
            liable_for_gateway_fee: dtoIn.liableForGatewayFee,
            liable_for_refund: dtoIn.liableForRefund,
            priority: dtoIn.priority,
            metadata: dtoIn.metadata,
            config: dtoIn.config,
            changes_history: changesHistory,
            status: dtoIn.status,
        });
        return new update_split_rule_recipient_dto_out_1.UpdateSplitRuleRecipientDtoOut(updated);
    }
    buildNewDataForHistory(dtoIn) {
        const newData = {};
        this.addIfNotNull(newData, 'splitRuleId', dtoIn.splitRuleId);
        this.addIfNotNull(newData, 'splitRecipientId', dtoIn.splitRecipientId);
        this.addIfNotNull(newData, 'role', dtoIn.role);
        this.addIfNotNull(newData, 'percentage', dtoIn.percentage);
        this.addIfNotNull(newData, 'fixedAmount', dtoIn.fixedAmount);
        this.addIfNotNull(newData, 'liableForGatewayFee', dtoIn.liableForGatewayFee);
        this.addIfNotNull(newData, 'liableForRefund', dtoIn.liableForRefund);
        this.addIfNotNull(newData, 'priority', dtoIn.priority);
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
exports.UpdateSplitRuleRecipientService = UpdateSplitRuleRecipientService;
exports.UpdateSplitRuleRecipientService = UpdateSplitRuleRecipientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(split_rule_recipients_tokens_1.SPLIT_RULE_RECIPIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateSplitRuleRecipientService);
//# sourceMappingURL=update-split-rule-recipient.service.js.map