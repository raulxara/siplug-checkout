"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSplitRecipientModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const split_recipients_module_1 = require("../../modules/split-recipients/split-recipients.module");
const update_split_recipient_controller_1 = require("./update-split-recipient.controller");
const update_split_recipient_use_case_1 = require("./update-split-recipient.use-case");
let UpdateSplitRecipientModule = class UpdateSplitRecipientModule {
};
exports.UpdateSplitRecipientModule = UpdateSplitRecipientModule;
exports.UpdateSplitRecipientModule = UpdateSplitRecipientModule = __decorate([
    (0, common_1.Module)({
        imports: [split_recipients_module_1.SplitRecipientsModule, security_module_1.SecurityModule],
        controllers: [update_split_recipient_controller_1.UpdateSplitRecipientController],
        providers: [update_split_recipient_use_case_1.UpdateSplitRecipientUseCase],
        exports: [update_split_recipient_use_case_1.UpdateSplitRecipientUseCase],
    })
], UpdateSplitRecipientModule);
//# sourceMappingURL=update-split-recipient.module.js.map