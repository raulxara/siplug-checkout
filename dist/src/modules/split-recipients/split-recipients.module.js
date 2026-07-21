"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRecipientsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infra/database/prisma/prisma.module");
const split_recipients_repository_1 = require("./repositories/split-recipients.repository");
const create_split_recipient_service_1 = require("./services/create-split-recipient/create-split-recipient.service");
const find_split_recipient_by_unique_id_service_1 = require("./services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service");
const split_recipients_tokens_1 = require("./tokens/split-recipients.tokens");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const get_all_split_recipients_service_1 = require("./services/get-all-split-recipients/get-all-split-recipients.service");
const get_all_split_recipients_by_office_id_service_1 = require("./services/get-all-split-recipients-by-office-id/get-all-split-recipients-by-office-id.service");
const update_split_recipient_service_1 = require("./services/update-split-recipient/update-split-recipient.service");
let SplitRecipientsModule = class SplitRecipientsModule {
};
exports.SplitRecipientsModule = SplitRecipientsModule;
exports.SplitRecipientsModule = SplitRecipientsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [
            {
                provide: split_recipients_tokens_1.SPLIT_RECIPIENTS_REPOSITORY,
                useClass: split_recipients_repository_1.SplitRecipientsRepository,
            },
            create_split_recipient_service_1.CreateSplitRecipientService,
            find_split_recipient_by_unique_id_service_1.FindSplitRecipientByUniqueIdService,
            build_changes_history_service_1.BuildChangesHistoryService,
            get_all_split_recipients_service_1.GetAllSplitRecipientsService,
            get_all_split_recipients_by_office_id_service_1.GetAllSplitRecipientsByOfficeIdService,
            update_split_recipient_service_1.UpdateSplitRecipientService,
        ],
        exports: [
            split_recipients_tokens_1.SPLIT_RECIPIENTS_REPOSITORY,
            create_split_recipient_service_1.CreateSplitRecipientService,
            find_split_recipient_by_unique_id_service_1.FindSplitRecipientByUniqueIdService,
            get_all_split_recipients_service_1.GetAllSplitRecipientsService,
            get_all_split_recipients_by_office_id_service_1.GetAllSplitRecipientsByOfficeIdService,
            update_split_recipient_service_1.UpdateSplitRecipientService,
        ],
    })
], SplitRecipientsModule);
//# sourceMappingURL=split-recipients.module.js.map