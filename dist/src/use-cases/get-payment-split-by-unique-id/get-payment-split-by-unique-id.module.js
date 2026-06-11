"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentSplitByUniqueIdModule = void 0;
const common_1 = require("@nestjs/common");
const payment_split_recipients_module_1 = require("../../modules/payment-split-recipients/payment-split-recipients.module");
const payment_splits_module_1 = require("../../modules/payment-splits/payment-splits.module");
const security_module_1 = require("../../modules/security/security.module");
const get_payment_split_by_unique_id_controller_1 = require("./get-payment-split-by-unique-id.controller");
const get_payment_split_by_unique_id_use_case_1 = require("./get-payment-split-by-unique-id.use-case");
let GetPaymentSplitByUniqueIdModule = class GetPaymentSplitByUniqueIdModule {
};
exports.GetPaymentSplitByUniqueIdModule = GetPaymentSplitByUniqueIdModule;
exports.GetPaymentSplitByUniqueIdModule = GetPaymentSplitByUniqueIdModule = __decorate([
    (0, common_1.Module)({
        imports: [security_module_1.SecurityModule, payment_splits_module_1.PaymentSplitsModule, payment_split_recipients_module_1.PaymentSplitRecipientsModule],
        controllers: [get_payment_split_by_unique_id_controller_1.GetPaymentSplitByUniqueIdController],
        providers: [get_payment_split_by_unique_id_use_case_1.GetPaymentSplitByUniqueIdUseCase],
        exports: [get_payment_split_by_unique_id_use_case_1.GetPaymentSplitByUniqueIdUseCase],
    })
], GetPaymentSplitByUniqueIdModule);
//# sourceMappingURL=get-payment-split-by-unique-id.module.js.map