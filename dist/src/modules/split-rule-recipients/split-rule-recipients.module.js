"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRuleRecipientsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const prisma_module_1 = require("../../infra/database/prisma/prisma.module");
const split_rule_recipients_repository_1 = require("./repositories/split-rule-recipients.repository");
const create_split_rule_recipient_service_1 = require("./services/create-split-rule-recipient/create-split-rule-recipient.service");
const find_split_rule_recipient_by_rule_and_recipient_service_1 = require("./services/find-split-rule-recipient-by-rule-and-recipient/find-split-rule-recipient-by-rule-and-recipient.service");
const get_all_split_rule_recipients_by_split_rule_id_service_1 = require("./services/get-all-split-rule-recipients-by-split-rule-id/get-all-split-rule-recipients-by-split-rule-id.service");
const update_split_rule_recipient_service_1 = require("./services/update-split-rule-recipient/update-split-rule-recipient.service");
const split_rule_recipients_tokens_1 = require("./tokens/split-rule-recipients.tokens");
let SplitRuleRecipientsModule = class SplitRuleRecipientsModule {
};
exports.SplitRuleRecipientsModule = SplitRuleRecipientsModule;
exports.SplitRuleRecipientsModule = SplitRuleRecipientsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [
            {
                provide: split_rule_recipients_tokens_1.SPLIT_RULE_RECIPIENTS_REPOSITORY,
                useClass: split_rule_recipients_repository_1.SplitRuleRecipientsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_split_rule_recipient_service_1.CreateSplitRuleRecipientService,
            update_split_rule_recipient_service_1.UpdateSplitRuleRecipientService,
            find_split_rule_recipient_by_rule_and_recipient_service_1.FindSplitRuleRecipientByRuleAndRecipientService,
            get_all_split_rule_recipients_by_split_rule_id_service_1.GetAllSplitRuleRecipientsBySplitRuleIdService,
        ],
        exports: [
            split_rule_recipients_tokens_1.SPLIT_RULE_RECIPIENTS_REPOSITORY,
            create_split_rule_recipient_service_1.CreateSplitRuleRecipientService,
            update_split_rule_recipient_service_1.UpdateSplitRuleRecipientService,
            find_split_rule_recipient_by_rule_and_recipient_service_1.FindSplitRuleRecipientByRuleAndRecipientService,
            get_all_split_rule_recipients_by_split_rule_id_service_1.GetAllSplitRuleRecipientsBySplitRuleIdService,
        ],
    })
], SplitRuleRecipientsModule);
//# sourceMappingURL=split-rule-recipients.module.js.map