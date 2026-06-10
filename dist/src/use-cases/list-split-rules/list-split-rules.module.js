"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSplitRulesModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const split_rules_module_1 = require("../../modules/split-rules/split-rules.module");
const list_split_rules_controller_1 = require("./list-split-rules.controller");
const list_split_rules_use_case_1 = require("./list-split-rules.use-case");
let ListSplitRulesModule = class ListSplitRulesModule {
};
exports.ListSplitRulesModule = ListSplitRulesModule;
exports.ListSplitRulesModule = ListSplitRulesModule = __decorate([
    (0, common_1.Module)({
        imports: [split_rules_module_1.SplitRulesModule, security_module_1.SecurityModule],
        controllers: [list_split_rules_controller_1.ListSplitRulesController],
        providers: [list_split_rules_use_case_1.ListSplitRulesUseCase],
        exports: [list_split_rules_use_case_1.ListSplitRulesUseCase],
    })
], ListSplitRulesModule);
//# sourceMappingURL=list-split-rules.module.js.map