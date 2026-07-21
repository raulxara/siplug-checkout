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
exports.CreateSplitRuleRecipientService = void 0;
const common_1 = require("@nestjs/common");
const split_rule_recipient_entity_1 = require("../../entities/split-rule-recipient.entity");
const split_rule_recipients_tokens_1 = require("../../tokens/split-rule-recipients.tokens");
const create_split_rule_recipient_dto_out_1 = require("./dtos/create-split-rule-recipient.dto-out");
let CreateSplitRuleRecipientService = class CreateSplitRuleRecipientService {
    splitRuleRecipientsRepository;
    constructor(splitRuleRecipientsRepository) {
        this.splitRuleRecipientsRepository = splitRuleRecipientsRepository;
    }
    async exec(dtoIn) {
        const entity = new split_rule_recipient_entity_1.SplitRuleRecipientEntity(this.splitRuleRecipientsRepository);
        entity.splitRuleId = dtoIn.splitRuleId;
        entity.splitRecipientId = dtoIn.splitRecipientId;
        entity.role = dtoIn.role;
        entity.percentage = dtoIn.percentage;
        entity.fixedAmount = dtoIn.fixedAmount;
        entity.liableForGatewayFee = dtoIn.liableForGatewayFee;
        entity.liableForRefund = dtoIn.liableForRefund;
        entity.priority = dtoIn.priority;
        entity.metadata = dtoIn.metadata;
        entity.config = dtoIn.config;
        entity.changesHistory = [
            {
                source: 'CreateSplitRuleRecipientService',
                action: 'created',
                createdAt: new Date().toISOString(),
            },
        ];
        entity.status = dtoIn.status ?? 'active';
        const created = await entity.create();
        return new create_split_rule_recipient_dto_out_1.CreateSplitRuleRecipientDtoOut({
            id: created.id,
            _id: created._id,
            splitRuleId: created.splitRuleId,
            splitRecipientId: created.splitRecipientId,
            role: created.role,
            percentage: created.percentage,
            fixedAmount: created.fixedAmount,
            liableForGatewayFee: created.liableForGatewayFee,
            liableForRefund: created.liableForRefund,
            priority: created.priority,
            metadata: created.metadata,
            config: created.config,
            changesHistory: created.changesHistory,
            status: created.status,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }
};
exports.CreateSplitRuleRecipientService = CreateSplitRuleRecipientService;
exports.CreateSplitRuleRecipientService = CreateSplitRuleRecipientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(split_rule_recipients_tokens_1.SPLIT_RULE_RECIPIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateSplitRuleRecipientService);
//# sourceMappingURL=create-split-rule-recipient.service.js.map