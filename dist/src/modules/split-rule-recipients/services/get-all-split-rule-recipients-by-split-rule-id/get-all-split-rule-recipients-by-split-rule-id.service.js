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
exports.GetAllSplitRuleRecipientsBySplitRuleIdService = void 0;
const common_1 = require("@nestjs/common");
const split_rule_recipients_tokens_1 = require("../../tokens/split-rule-recipients.tokens");
const get_all_split_rule_recipients_by_split_rule_id_dto_out_1 = require("./dtos/get-all-split-rule-recipients-by-split-rule-id.dto-out");
let GetAllSplitRuleRecipientsBySplitRuleIdService = class GetAllSplitRuleRecipientsBySplitRuleIdService {
    splitRuleRecipientsRepository;
    constructor(splitRuleRecipientsRepository) {
        this.splitRuleRecipientsRepository = splitRuleRecipientsRepository;
    }
    async exec(dtoIn) {
        const splitRuleRecipients = await this.splitRuleRecipientsRepository.getAllBySplitRuleId(dtoIn.splitRuleId);
        return new get_all_split_rule_recipients_by_split_rule_id_dto_out_1.GetAllSplitRuleRecipientsBySplitRuleIdDtoOut(splitRuleRecipients);
    }
};
exports.GetAllSplitRuleRecipientsBySplitRuleIdService = GetAllSplitRuleRecipientsBySplitRuleIdService;
exports.GetAllSplitRuleRecipientsBySplitRuleIdService = GetAllSplitRuleRecipientsBySplitRuleIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(split_rule_recipients_tokens_1.SPLIT_RULE_RECIPIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetAllSplitRuleRecipientsBySplitRuleIdService);
//# sourceMappingURL=get-all-split-rule-recipients-by-split-rule-id.service.js.map