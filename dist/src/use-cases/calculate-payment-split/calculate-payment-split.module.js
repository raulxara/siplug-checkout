"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatePaymentSplitModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const split_calculations_module_1 = require("../../modules/split-calculations/split-calculations.module");
const calculate_payment_split_controller_1 = require("./calculate-payment-split.controller");
const calculate_payment_split_use_case_1 = require("./calculate-payment-split.use-case");
let CalculatePaymentSplitModule = class CalculatePaymentSplitModule {
};
exports.CalculatePaymentSplitModule = CalculatePaymentSplitModule;
exports.CalculatePaymentSplitModule = CalculatePaymentSplitModule = __decorate([
    (0, common_1.Module)({
        imports: [split_calculations_module_1.SplitCalculationsModule, security_module_1.SecurityModule],
        controllers: [calculate_payment_split_controller_1.CalculatePaymentSplitController],
        providers: [calculate_payment_split_use_case_1.CalculatePaymentSplitUseCase],
        exports: [calculate_payment_split_use_case_1.CalculatePaymentSplitUseCase],
    })
], CalculatePaymentSplitModule);
//# sourceMappingURL=calculate-payment-split.module.js.map