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
exports.UpdatePaymentSplitStatusService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const payment_splits_tokens_1 = require("../../tokens/payment-splits.tokens");
const update_payment_split_status_dto_out_1 = require("./dtos/update-payment-split-status.dto-out");
let UpdatePaymentSplitStatusService = class UpdatePaymentSplitStatusService {
    paymentSplitsRepository;
    buildChangesHistoryService;
    constructor(paymentSplitsRepository, buildChangesHistoryService) {
        this.paymentSplitsRepository = paymentSplitsRepository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        const current = await this.paymentSplitsRepository.findByUniqueId(dtoIn._id);
        if (current === null) {
            throw new Error('payment split not found');
        }
        this.validateStatus(dtoIn.status);
        this.validateTransition(current.status, dtoIn.status);
        const newDataForHistory = this.buildNewDataForHistory(dtoIn);
        const changesHistory = this.buildChangesHistoryService.exec({
            currentChangesHistory: current.changesHistory ?? null,
            oldData: current,
            newData: newDataForHistory,
            source: dtoIn.source,
        });
        const updated = await this.paymentSplitsRepository.updateByUniqueId(dtoIn._id, {
            gateway_split_id: dtoIn.gatewaySplitId,
            provider_payload: dtoIn.providerPayload,
            provider_response: dtoIn.providerResponse,
            gateway_response: dtoIn.gatewayResponse,
            metadata: dtoIn.metadata,
            config: dtoIn.config,
            changes_history: changesHistory,
            status: dtoIn.status,
        });
        return new update_payment_split_status_dto_out_1.UpdatePaymentSplitStatusDtoOut(updated);
    }
    buildNewDataForHistory(dtoIn) {
        const newData = {};
        this.addIfNotNull(newData, 'gatewaySplitId', dtoIn.gatewaySplitId);
        this.addIfNotNull(newData, 'providerPayload', dtoIn.providerPayload);
        this.addIfNotNull(newData, 'providerResponse', dtoIn.providerResponse);
        this.addIfNotNull(newData, 'gatewayResponse', dtoIn.gatewayResponse);
        this.addIfNotNull(newData, 'metadata', dtoIn.metadata);
        this.addIfNotNull(newData, 'config', dtoIn.config);
        this.addIfNotNull(newData, 'status', dtoIn.status);
        return newData;
    }
    validateStatus(status) {
        const allowedStatuses = [
            'created',
            'pending_gateway',
            'transferred',
            'failed',
            'refunded',
        ];
        if (!allowedStatuses.includes(status)) {
            throw new Error(`invalid payment split status: ${status}`);
        }
    }
    validateTransition(currentStatus, nextStatus) {
        if (currentStatus === nextStatus) {
            return;
        }
        const transitions = {
            created: ['pending_gateway', 'transferred', 'failed', 'refunded'],
            pending_gateway: ['transferred', 'failed', 'refunded'],
            transferred: ['refunded'],
            failed: [],
            refunded: [],
        };
        const allowedNextStatuses = transitions[currentStatus] ?? [];
        if (!allowedNextStatuses.includes(nextStatus)) {
            throw new Error(`invalid payment split status transition from ${currentStatus} to ${nextStatus}`);
        }
    }
    addIfNotNull(target, key, value) {
        if (value !== null && value !== undefined) {
            target[key] = value;
        }
    }
};
exports.UpdatePaymentSplitStatusService = UpdatePaymentSplitStatusService;
exports.UpdatePaymentSplitStatusService = UpdatePaymentSplitStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdatePaymentSplitStatusService);
//# sourceMappingURL=update-payment-split-status.service.js.map