"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncSplitRuleRecipientsModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const split_recipients_module_1 = require("../../modules/split-recipients/split-recipients.module");
const split_rule_recipients_module_1 = require("../../modules/split-rule-recipients/split-rule-recipients.module");
const split_rules_module_1 = require("../../modules/split-rules/split-rules.module");
const sync_split_rule_recipients_controller_1 = require("./sync-split-rule-recipients.controller");
const sync_split_rule_recipients_use_case_1 = require("./sync-split-rule-recipients.use-case");
let SyncSplitRuleRecipientsModule = class SyncSplitRuleRecipientsModule {
};
exports.SyncSplitRuleRecipientsModule = SyncSplitRuleRecipientsModule;
exports.SyncSplitRuleRecipientsModule = SyncSplitRuleRecipientsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            security_module_1.SecurityModule,
            split_rules_module_1.SplitRulesModule,
            split_recipients_module_1.SplitRecipientsModule,
            split_rule_recipients_module_1.SplitRuleRecipientsModule,
        ],
        controllers: [sync_split_rule_recipients_controller_1.SyncSplitRuleRecipientsController],
        providers: [sync_split_rule_recipients_use_case_1.SyncSplitRuleRecipientsUseCase],
        exports: [sync_split_rule_recipients_use_case_1.SyncSplitRuleRecipientsUseCase],
    })
], SyncSplitRuleRecipientsModule);
//# sourceMappingURL=sync-split-rule-recipients.module.js.map