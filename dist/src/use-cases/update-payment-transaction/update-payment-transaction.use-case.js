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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentTransactionUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const update_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in");
const update_payment_transaction_service_1 = require("../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const update_payment_transaction_dto_out_1 = require("./dtos/update-payment-transaction.dto-out");
let UpdatePaymentTransactionUseCase = class UpdatePaymentTransactionUseCase {
    resolveActorAuthorizationService;
    updatePaymentTransactionService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, updatePaymentTransactionService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'updatePaymentTransaction',
                requiredEntity: 'payment_transactions',
            }));
            this.validateAllowedStatus(dtoIn.status);
            this.validateAllowedProcessStatus(dtoIn.processStatus);
            this.assertNoSensitiveFields(dtoIn.metadata, 'metadata');
            this.assertNoSensitiveFields(dtoIn.config, 'config');
            const dtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                _id: dtoIn.paymentTransactionId,
                status: dtoIn.status,
                gatewayStatus: dtoIn.gatewayStatus,
                processStatus: dtoIn.processStatus,
                processMessage: dtoIn.processMessage,
                qrCode: dtoIn.qrCode,
                qrCodeBase64: dtoIn.qrCodeBase64,
                boletoUrl: dtoIn.boletoUrl,
                checkoutUrl: dtoIn.checkoutUrl,
                paidAt: dtoIn.paidAt,
                authorizedAt: dtoIn.authorizedAt,
                canceledAt: dtoIn.canceledAt,
                failedAt: dtoIn.failedAt,
                refundedAt: dtoIn.refundedAt,
                expiresAt: dtoIn.expiresAt,
                metadata: dtoIn.metadata,
                config: dtoIn.config,
                source: 'UpdatePaymentTransactionUseCase',
            }));
            return new update_payment_transaction_dto_out_1.UpdatePaymentTransactionUseCaseDtoOut(dtoOut.paymentTransaction);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'UpdatePaymentTransactionUseCase',
                error,
                appFile: __filename,
                context: {
                    paymentTransactionId: dtoIn.paymentTransactionId,
                    status: dtoIn.status,
                    gatewayStatus: dtoIn.gatewayStatus,
                    processStatus: dtoIn.processStatus,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on update payment transaction use case';
            throw new Error(message);
        }
    }
    validateAllowedStatus(status) {
        if (status === null) {
            return;
        }
        const allowedStatuses = [
            'created',
            'pending',
            'processing',
            'authorized',
            'paid',
            'failed',
            'canceled',
            'refunded',
            'expired',
        ];
        if (!allowedStatuses.includes(status)) {
            throw new Error(`status must be one of: ${allowedStatuses.join(', ')}`);
        }
    }
    validateAllowedProcessStatus(processStatus) {
        if (processStatus === null) {
            return;
        }
        const allowedProcessStatuses = [
            'pending',
            'dispatching_gateway',
            'gateway_pending',
            'gateway_authorized',
            'gateway_approved',
            'gateway_rejected',
            'gateway_cancelled',
            'gateway_dispatched',
            'gateway_dispatch_failed',
            'gateway_dispatch_exception',
            'manual_update',
            'manual_review',
            'sync_pending',
            'sync_completed',
            'sync_failed',
        ];
        if (!allowedProcessStatuses.includes(processStatus)) {
            throw new Error(`processStatus must be one of: ${allowedProcessStatuses.join(', ')}`);
        }
    }
    assertNoSensitiveFields(data, path) {
        if (data === null) {
            return;
        }
        const forbiddenKeys = [
            'token',
            'providerToken',
            'provider_token',
            'accessToken',
            'access_token',
            'authorization',
            'card',
            'cardNumber',
            'card_number',
            'cardToken',
            'card_token',
            'encryptedCard',
            'encrypted_card',
            'cvv',
            'securityCode',
            'security_code',
            'pan',
            'rawCard',
            'raw_card',
            'password',
            'secret',
            'clientSecret',
            'client_secret',
            'merchantKey',
            'merchant_key',
        ];
        for (const [key, value] of Object.entries(data)) {
            if (forbiddenKeys.includes(key)) {
                throw new Error(`forbidden sensitive field: ${path}.${key}`);
            }
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                this.assertNoSensitiveFields(value, `${path}.${key}`);
            }
        }
    }
};
exports.UpdatePaymentTransactionUseCase = UpdatePaymentTransactionUseCase;
exports.UpdatePaymentTransactionUseCase = UpdatePaymentTransactionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        update_payment_transaction_service_1.UpdatePaymentTransactionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], UpdatePaymentTransactionUseCase);
//# sourceMappingURL=update-payment-transaction.use-case.js.map