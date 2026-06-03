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
exports.UpdateCheckoutSessionService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const checkout_sessions_tokens_1 = require("../../tokens/checkout-sessions.tokens");
const update_checkout_session_dto_out_1 = require("./dtos/update-checkout-session.dto-out");
let UpdateCheckoutSessionService = class UpdateCheckoutSessionService {
    repository;
    buildChangesHistoryService;
    constructor(repository, buildChangesHistoryService) {
        this.repository = repository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        try {
            const currentRow = await this.repository.findByUniqueId(dtoIn._id);
            if (!currentRow) {
                throw new Error('checkout session not found');
            }
            const newDataForHistory = this.removeNullValues({
                officeId: dtoIn.officeId,
                clientId: dtoIn.clientId,
                paymentCustomerId: dtoIn.paymentCustomerId,
                gatewayId: dtoIn.gatewayId,
                apiCredentialId: dtoIn.apiCredentialId,
                code: dtoIn.code,
                externalReference: dtoIn.externalReference,
                idempotencyKey: dtoIn.idempotencyKey,
                paymentType: dtoIn.paymentType,
                amount: dtoIn.amount,
                currency: dtoIn.currency,
                description: dtoIn.description,
                successUrl: dtoIn.successUrl,
                cancelUrl: dtoIn.cancelUrl,
                expiresAt: dtoIn.expiresAt,
                metadata: dtoIn.metadata,
                config: dtoIn.config,
                status: dtoIn.status,
            });
            const historyDtoOut = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
                currentChangesHistory: currentRow.changesHistory,
                oldData: this.buildOldData(currentRow),
                newData: newDataForHistory,
                source: dtoIn.source,
            }));
            const row = await this.repository.updateByUniqueId(dtoIn._id, {
                office_id: dtoIn.officeId,
                client_id: dtoIn.clientId,
                payment_customer_id: dtoIn.paymentCustomerId,
                gateway_id: dtoIn.gatewayId,
                api_credential_id: dtoIn.apiCredentialId,
                code: dtoIn.code,
                external_reference: dtoIn.externalReference,
                idempotency_key: dtoIn.idempotencyKey,
                payment_type: dtoIn.paymentType,
                amount: dtoIn.amount,
                currency: dtoIn.currency,
                description: dtoIn.description,
                success_url: dtoIn.successUrl,
                cancel_url: dtoIn.cancelUrl,
                expires_at: dtoIn.expiresAt,
                metadata: dtoIn.metadata,
                config: dtoIn.config,
                changes_history: historyDtoOut.hasChanges
                    ? historyDtoOut.changesHistory
                    : currentRow.changesHistory,
                status: dtoIn.status,
            });
            return new update_checkout_session_dto_out_1.UpdateCheckoutSessionDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update checkout session';
            throw new Error(message);
        }
    }
    removeNullValues(data) {
        return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
    }
    buildOldData(row) {
        return {
            officeId: row.officeId,
            clientId: row.clientId,
            paymentCustomerId: row.paymentCustomerId,
            gatewayId: row.gatewayId,
            apiCredentialId: row.apiCredentialId,
            code: row.code,
            externalReference: row.externalReference,
            idempotencyKey: row.idempotencyKey,
            paymentType: row.paymentType,
            amount: row.amount,
            currency: row.currency,
            description: row.description,
            successUrl: row.successUrl,
            cancelUrl: row.cancelUrl,
            expiresAt: row.expiresAt,
            metadata: row.metadata,
            config: row.config,
            status: row.status,
        };
    }
};
exports.UpdateCheckoutSessionService = UpdateCheckoutSessionService;
exports.UpdateCheckoutSessionService = UpdateCheckoutSessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(checkout_sessions_tokens_1.CHECKOUT_SESSIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateCheckoutSessionService);
//# sourceMappingURL=update-checkout-session.service.js.map