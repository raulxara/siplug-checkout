"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSplitRecipientsByOfficeIdModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const split_recipients_module_1 = require("../../modules/split-recipients/split-recipients.module");
const list_split_recipients_by_office_id_controller_1 = require("./list-split-recipients-by-office-id.controller");
const list_split_recipients_by_office_id_use_case_1 = require("./list-split-recipients-by-office-id.use-case");
let ListSplitRecipientsByOfficeIdModule = class ListSplitRecipientsByOfficeIdModule {
};
exports.ListSplitRecipientsByOfficeIdModule = ListSplitRecipientsByOfficeIdModule;
exports.ListSplitRecipientsByOfficeIdModule = ListSplitRecipientsByOfficeIdModule = __decorate([
    (0, common_1.Module)({
        imports: [split_recipients_module_1.SplitRecipientsModule, security_module_1.SecurityModule],
        controllers: [list_split_recipients_by_office_id_controller_1.ListSplitRecipientsByOfficeIdController],
        providers: [list_split_recipients_by_office_id_use_case_1.ListSplitRecipientsByOfficeIdUseCase],
        exports: [list_split_recipients_by_office_id_use_case_1.ListSplitRecipientsByOfficeIdUseCase],
    })
], ListSplitRecipientsByOfficeIdModule);
//# sourceMappingURL=list-split-recipients-by-office-id.module.js.map