"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSplitRuleByUniqueIdModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const split_rules_module_1 = require("../../modules/split-rules/split-rules.module");
const get_split_rule_by_unique_id_controller_1 = require("./get-split-rule-by-unique-id.controller");
const get_split_rule_by_unique_id_use_case_1 = require("./get-split-rule-by-unique-id.use-case");
let GetSplitRuleByUniqueIdModule = class GetSplitRuleByUniqueIdModule {
};
exports.GetSplitRuleByUniqueIdModule = GetSplitRuleByUniqueIdModule;
exports.GetSplitRuleByUniqueIdModule = GetSplitRuleByUniqueIdModule = __decorate([
    (0, common_1.Module)({
        imports: [split_rules_module_1.SplitRulesModule, security_module_1.SecurityModule],
        controllers: [get_split_rule_by_unique_id_controller_1.GetSplitRuleByUniqueIdController],
        providers: [get_split_rule_by_unique_id_use_case_1.GetSplitRuleByUniqueIdUseCase],
        exports: [get_split_rule_by_unique_id_use_case_1.GetSplitRuleByUniqueIdUseCase],
    })
], GetSplitRuleByUniqueIdModule);
//# sourceMappingURL=get-split-rule-by-unique-id.module.js.map