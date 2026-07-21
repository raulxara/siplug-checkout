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
exports.UpdatePaymentSplitService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const payment_splits_tokens_1 = require("../../tokens/payment-splits.tokens");
const update_payment_split_dto_out_1 = require("./dtos/update-payment-split.dto-out");
let UpdatePaymentSplitService = class UpdatePaymentSplitService {
    repository;
    buildChangesHistoryService;
    constructor(repository, buildChangesHistoryService) {
        this.repository = repository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        const current = await this.repository.findByUniqueId(dtoIn._id);
        if (current === null) {
            throw new Error('payment split not found');
        }
        const newData = this.buildNewData(dtoIn);
        const historyDtoOut = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
            currentChangesHistory: current.changesHistory,
            oldData: this.buildOldData(current),
            newData,
            source: dtoIn.source,
        }));
        const updated = await this.repository.updateByUniqueId(dtoIn._id, {
            ...this.buildRepositoryUpdateData(dtoIn),
            changes_history: historyDtoOut.hasChanges
                ? historyDtoOut.changesHistory
                : current.changesHistory,
        });
        return new update_payment_split_dto_out_1.UpdatePaymentSplitDtoOut(updated);
    }
    buildNewData(dtoIn) {
        const data = {};
        if (dtoIn.gatewaySplitId !== undefined && dtoIn.gatewaySplitId !== null) {
            data.gatewaySplitId = dtoIn.gatewaySplitId;
        }
        if (dtoIn.providerPayload !== undefined && dtoIn.providerPayload !== null) {
            data.providerPayload = dtoIn.providerPayload;
        }
        if (dtoIn.providerResponse !== undefined &&
            dtoIn.providerResponse !== null) {
            data.providerResponse = dtoIn.providerResponse;
        }
        if (dtoIn.gatewayResponse !== undefined && dtoIn.gatewayResponse !== null) {
            data.gatewayResponse = dtoIn.gatewayResponse;
        }
        if (dtoIn.metadata !== undefined && dtoIn.metadata !== null) {
            data.metadata = dtoIn.metadata;
        }
        if (dtoIn.config !== undefined && dtoIn.config !== null) {
            data.config = dtoIn.config;
        }
        if (dtoIn.status !== undefined) {
            data.status = dtoIn.status;
        }
        return data;
    }
    buildRepositoryUpdateData(dtoIn) {
        const data = {};
        if (dtoIn.gatewaySplitId !== undefined && dtoIn.gatewaySplitId !== null) {
            data.gateway_split_id = dtoIn.gatewaySplitId;
        }
        if (dtoIn.providerPayload !== undefined && dtoIn.providerPayload !== null) {
            data.provider_payload = dtoIn.providerPayload;
        }
        if (dtoIn.providerResponse !== undefined &&
            dtoIn.providerResponse !== null) {
            data.provider_response = dtoIn.providerResponse;
        }
        if (dtoIn.gatewayResponse !== undefined && dtoIn.gatewayResponse !== null) {
            data.gateway_response = dtoIn.gatewayResponse;
        }
        if (dtoIn.metadata !== undefined && dtoIn.metadata !== null) {
            data.metadata = dtoIn.metadata;
        }
        if (dtoIn.config !== undefined && dtoIn.config !== null) {
            data.config = dtoIn.config;
        }
        if (dtoIn.status !== undefined) {
            data.status = dtoIn.status;
        }
        return data;
    }
    buildOldData(row) {
        return {
            gatewaySplitId: row.gatewaySplitId,
            providerPayload: row.providerPayload,
            providerResponse: row.providerResponse,
            gatewayResponse: row.gatewayResponse,
            metadata: row.metadata,
            config: row.config,
            status: row.status,
        };
    }
};
exports.UpdatePaymentSplitService = UpdatePaymentSplitService;
exports.UpdatePaymentSplitService = UpdatePaymentSplitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdatePaymentSplitService);
//# sourceMappingURL=update-payment-split.service.js.map