"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRulesModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infra/database/prisma/prisma.module");
const split_rules_repository_1 = require("./repositories/split-rules.repository");
const create_split_rule_service_1 = require("./services/create-split-rule/create-split-rule.service");
const find_split_rule_by_unique_id_service_1 = require("./services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service");
const split_rules_tokens_1 = require("./tokens/split-rules.tokens");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const get_all_split_rules_service_1 = require("./services/get-all-split-rules/get-all-split-rules.service");
const get_all_split_rules_by_office_id_service_1 = require("./services/get-all-split-rules-by-office-id/get-all-split-rules-by-office-id.service");
const update_split_rule_service_1 = require("./services/update-split-rule/update-split-rule.service");
let SplitRulesModule = class SplitRulesModule {
};
exports.SplitRulesModule = SplitRulesModule;
exports.SplitRulesModule = SplitRulesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [
            {
                provide: split_rules_tokens_1.SPLIT_RULES_REPOSITORY,
                useClass: split_rules_repository_1.SplitRulesRepository,
            },
            create_split_rule_service_1.CreateSplitRuleService,
            find_split_rule_by_unique_id_service_1.FindSplitRuleByUniqueIdService,
            build_changes_history_service_1.BuildChangesHistoryService,
            build_changes_history_service_1.BuildChangesHistoryService,
            get_all_split_rules_service_1.GetAllSplitRulesService,
            get_all_split_rules_by_office_id_service_1.GetAllSplitRulesByOfficeIdService,
            update_split_rule_service_1.UpdateSplitRuleService,
        ],
        exports: [
            split_rules_tokens_1.SPLIT_RULES_REPOSITORY,
            create_split_rule_service_1.CreateSplitRuleService,
            find_split_rule_by_unique_id_service_1.FindSplitRuleByUniqueIdService,
            get_all_split_rules_service_1.GetAllSplitRulesService,
            get_all_split_rules_by_office_id_service_1.GetAllSplitRulesByOfficeIdService,
            update_split_rule_service_1.UpdateSplitRuleService,
        ],
    })
], SplitRulesModule);
//# sourceMappingURL=split-rules.module.js.map