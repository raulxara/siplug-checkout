"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitCalculationsModule = void 0;
const common_1 = require("@nestjs/common");
const split_rule_recipients_module_1 = require("../split-rule-recipients/split-rule-recipients.module");
const split_rules_module_1 = require("../split-rules/split-rules.module");
const calculate_payment_split_service_1 = require("./services/calculate-payment-split/calculate-payment-split.service");
let SplitCalculationsModule = class SplitCalculationsModule {
};
exports.SplitCalculationsModule = SplitCalculationsModule;
exports.SplitCalculationsModule = SplitCalculationsModule = __decorate([
    (0, common_1.Module)({
        imports: [split_rules_module_1.SplitRulesModule, split_rule_recipients_module_1.SplitRuleRecipientsModule],
        providers: [calculate_payment_split_service_1.CalculatePaymentSplitService],
        exports: [calculate_payment_split_service_1.CalculatePaymentSplitService],
    })
], SplitCalculationsModule);
//# sourceMappingURL=split-calculations.module.js.map