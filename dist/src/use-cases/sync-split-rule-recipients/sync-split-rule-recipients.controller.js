"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncSplitRuleRecipientsController = void 0;
const common_1 = require("@nestjs/common");
const sync_split_rule_recipients_dto_in_1 = require("./dtos/sync-split-rule-recipients.dto-in");
const sync_split_rule_recipients_request_1 = require("./http/sync-split-rule-recipients.request");
const sync_split_rule_recipients_use_case_1 = require("./sync-split-rule-recipients.use-case");
let SyncSplitRuleRecipientsController = class SyncSplitRuleRecipientsController {
    syncSplitRuleRecipientsUseCase;
    constructor(syncSplitRuleRecipientsUseCase) {
        this.syncSplitRuleRecipientsUseCase = syncSplitRuleRecipientsUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.syncSplitRuleRecipientsUseCase.exec(new sync_split_rule_recipients_dto_in_1.SyncSplitRuleRecipientsDtoIn({
            token: this.resolveToken(authorization, request.token),
            splitRuleId: request.splitRuleId,
            recipients: request.recipients,
        }));
        return {
            status: 'success',
            message: 'split rule recipients synced successfully',
            data: {
                splitRule: dtoOut.splitRule,
                splitRuleRecipients: dtoOut.splitRuleRecipients,
                createdCount: dtoOut.createdCount,
                updatedCount: dtoOut.updatedCount,
                inactivatedCount: dtoOut.inactivatedCount,
            },
        };
    }
    resolveToken(authorization, fallbackToken) {
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.replace('Bearer ', '').trim();
        }
        return String(fallbackToken ?? '').trim();
    }
};
exports.SyncSplitRuleRecipientsController = SyncSplitRuleRecipientsController;
__decorate([
    (0, common_1.Post)('sync'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sync_split_rule_recipients_request_1.SyncSplitRuleRecipientsRequest, String]),
    __metadata("design:returntype", Promise)
], SyncSplitRuleRecipientsController.prototype, "handle", null);
exports.SyncSplitRuleRecipientsController = SyncSplitRuleRecipientsController = __decorate([
    (0, common_1.Controller)('split-rule-recipients'),
    __metadata("design:paramtypes", [sync_split_rule_recipients_use_case_1.SyncSplitRuleRecipientsUseCase])
], SyncSplitRuleRecipientsController);
//# sourceMappingURL=sync-split-rule-recipients.controller.js.map