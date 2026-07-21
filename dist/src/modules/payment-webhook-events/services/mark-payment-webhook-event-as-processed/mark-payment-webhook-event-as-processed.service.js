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
exports.MarkPaymentWebhookEventAsProcessedService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const payment_webhook_events_tokens_1 = require("../../tokens/payment-webhook-events.tokens");
const mark_payment_webhook_event_as_processed_dto_out_1 = require("./dtos/mark-payment-webhook-event-as-processed.dto-out");
let MarkPaymentWebhookEventAsProcessedService = class MarkPaymentWebhookEventAsProcessedService {
    repository;
    buildChangesHistoryService;
    constructor(repository, buildChangesHistoryService) {
        this.repository = repository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        const current = await this.repository.findByUniqueId(dtoIn._id);
        if (current === null) {
            throw new Error('payment webhook event not found');
        }
        const processedAt = new Date().toISOString();
        const newData = {
            processingResult: dtoIn.processingResult,
            processedAt,
            status: 'processed',
        };
        const historyDtoOut = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
            currentChangesHistory: current.changesHistory,
            oldData: this.buildOldData(current),
            newData,
            source: dtoIn.source,
        }));
        const updated = await this.repository.updateByUniqueId(dtoIn._id, {
            processing_result: dtoIn.processingResult,
            processed_at: processedAt,
            changes_history: historyDtoOut.hasChanges
                ? historyDtoOut.changesHistory
                : current.changesHistory,
            status: 'processed',
        });
        return new mark_payment_webhook_event_as_processed_dto_out_1.MarkPaymentWebhookEventAsProcessedDtoOut(updated);
    }
    buildOldData(row) {
        return {
            processingResult: row.processingResult,
            processedAt: row.processedAt,
            status: row.status,
        };
    }
};
exports.MarkPaymentWebhookEventAsProcessedService = MarkPaymentWebhookEventAsProcessedService;
exports.MarkPaymentWebhookEventAsProcessedService = MarkPaymentWebhookEventAsProcessedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_webhook_events_tokens_1.PAYMENT_WEBHOOK_EVENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], MarkPaymentWebhookEventAsProcessedService);
//# sourceMappingURL=mark-payment-webhook-event-as-processed.service.js.map