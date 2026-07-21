"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentSplitLifecycleModule = void 0;
const common_1 = require("@nestjs/common");
const payment_split_recipients_module_1 = require("../../modules/payment-split-recipients/payment-split-recipients.module");
const payment_splits_module_1 = require("../../modules/payment-splits/payment-splits.module");
const security_module_1 = require("../../modules/security/security.module");
const update_payment_split_lifecycle_controller_1 = require("./update-payment-split-lifecycle.controller");
const update_payment_split_lifecycle_use_case_1 = require("./update-payment-split-lifecycle.use-case");
let UpdatePaymentSplitLifecycleModule = class UpdatePaymentSplitLifecycleModule {
};
exports.UpdatePaymentSplitLifecycleModule = UpdatePaymentSplitLifecycleModule;
exports.UpdatePaymentSplitLifecycleModule = UpdatePaymentSplitLifecycleModule = __decorate([
    (0, common_1.Module)({
        imports: [security_module_1.SecurityModule, payment_splits_module_1.PaymentSplitsModule, payment_split_recipients_module_1.PaymentSplitRecipientsModule],
        controllers: [update_payment_split_lifecycle_controller_1.UpdatePaymentSplitLifecycleController],
        providers: [update_payment_split_lifecycle_use_case_1.UpdatePaymentSplitLifecycleUseCase],
        exports: [update_payment_split_lifecycle_use_case_1.UpdatePaymentSplitLifecycleUseCase],
    })
], UpdatePaymentSplitLifecycleModule);
//# sourceMappingURL=update-payment-split-lifecycle.module.js.map