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
exports.SyncPaymentTransactionStatusUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const update_checkout_session_dto_in_1 = require("../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in");
const update_checkout_session_service_1 = require("../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service");
const gateway_payment_status_dto_in_1 = require("../../modules/gateway-orchestration/dtos/gateway-payment-status.dto-in");
const resolve_payment_gateway_credential_dto_in_1 = require("../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/dtos/resolve-payment-gateway-credential.dto-in");
const resolve_payment_gateway_credential_service_1 = require("../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service");
const sync_gateway_payment_status_service_1 = require("../../modules/gateway-orchestration/services/sync-gateway-payment-status/sync-gateway-payment-status.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const update_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in");
const update_payment_transaction_service_1 = require("../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const sync_payment_transaction_status_dto_out_1 = require("./dtos/sync-payment-transaction-status.dto-out");
let SyncPaymentTransactionStatusUseCase = class SyncPaymentTransactionStatusUseCase {
    resolveActorAuthorizationService;
    findPaymentTransactionByUniqueIdService;
    updatePaymentTransactionService;
    updateCheckoutSessionService;
    resolvePaymentGatewayCredentialService;
    syncGatewayPaymentStatusService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findPaymentTransactionByUniqueIdService, updatePaymentTransactionService, updateCheckoutSessionService, resolvePaymentGatewayCredentialService, syncGatewayPaymentStatusService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.updateCheckoutSessionService = updateCheckoutSessionService;
        this.resolvePaymentGatewayCredentialService = resolvePaymentGatewayCredentialService;
        this.syncGatewayPaymentStatusService = syncGatewayPaymentStatusService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'syncPaymentTransactionStatus',
                requiredEntity: 'payment_transactions',
            }));
            const paymentTransactionDtoOut = await this.findPaymentTransactionByUniqueIdService.exec(new find_payment_transaction_by_unique_id_dto_in_1.FindPaymentTransactionByUniqueIdDtoIn(dtoIn.paymentTransactionId));
            const paymentTransaction = paymentTransactionDtoOut.paymentTransaction;
            if (this.isFinalStatus(paymentTransaction.status) && !dtoIn.force) {
                return new sync_payment_transaction_status_dto_out_1.SyncPaymentTransactionStatusDtoOut(paymentTransaction, null, false, 'payment transaction already has a final status. Use force=true to sync again.');
            }
            if (paymentTransaction.gatewayTransactionId === null) {
                throw new Error('payment transaction gatewayTransactionId is required to sync status');
            }
            const resolvedGatewayCredentialDtoOut = await this.resolvePaymentGatewayCredentialService.exec(new resolve_payment_gateway_credential_dto_in_1.ResolvePaymentGatewayCredentialDtoIn({
                officeId: paymentTransaction.officeId,
                clientId: paymentTransaction.clientId,
                paymentType: paymentTransaction.paymentType,
                paymentMethod: paymentTransaction.paymentMethod,
                gatewayId: paymentTransaction.gatewayId,
                apiCredentialId: paymentTransaction.apiCredentialId,
            }));
            const resolvedGateway = resolvedGatewayCredentialDtoOut.gateway;
            const resolvedApiCredential = resolvedGatewayCredentialDtoOut.apiCredential;
            const gatewayStatusDtoOut = await this.syncGatewayPaymentStatusService.exec(new gateway_payment_status_dto_in_1.GatewayPaymentStatusDtoIn({
                gatewayProvider: resolvedGateway.provider,
                gatewaySlug: resolvedGateway.slug,
                paymentTransaction,
                apiCredential: {
                    _id: resolvedApiCredential._id,
                    slug: resolvedApiCredential.slug,
                    gatewayId: resolvedApiCredential.gatewayId,
                    token: resolvedGatewayCredentialDtoOut.decryptedProviderToken,
                    config: resolvedApiCredential.config,
                    connectionData: resolvedGatewayCredentialDtoOut.connectionData,
                },
                config: {
                    gatewayConfig: resolvedGateway.config,
                    transactionConfig: paymentTransaction.config,
                    apiCredentialConfig: resolvedApiCredential.config,
                },
            }));
            const updatedPaymentTransactionDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                _id: paymentTransaction._id,
                gatewayTransactionId: gatewayStatusDtoOut.gatewayTransactionId,
                gatewayStatus: gatewayStatusDtoOut.gatewayStatus,
                status: gatewayStatusDtoOut.status,
                processStatus: gatewayStatusDtoOut.processStatus,
                processMessage: gatewayStatusDtoOut.processMessage,
                providerResponse: this.sanitizeSensitiveGatewayData(gatewayStatusDtoOut.providerResponse),
                gatewayResponse: this.sanitizeSensitiveGatewayData(gatewayStatusDtoOut.gatewayResponse),
                qrCode: gatewayStatusDtoOut.qrCode,
                qrCodeBase64: gatewayStatusDtoOut.qrCodeBase64,
                boletoUrl: gatewayStatusDtoOut.boletoUrl,
                checkoutUrl: gatewayStatusDtoOut.checkoutUrl,
                paidAt: gatewayStatusDtoOut.paidAt,
                authorizedAt: gatewayStatusDtoOut.authorizedAt,
                canceledAt: gatewayStatusDtoOut.canceledAt,
                failedAt: gatewayStatusDtoOut.failedAt,
                refundedAt: gatewayStatusDtoOut.refundedAt,
                expiresAt: gatewayStatusDtoOut.expiresAt,
                source: 'SyncPaymentTransactionStatusUseCase',
            }));
            let checkoutSession = null;
            if (updatedPaymentTransactionDtoOut.paymentTransaction.checkoutSessionId !==
                null) {
                const updatedCheckoutSessionDtoOut = await this.updateCheckoutSessionService.exec(new update_checkout_session_dto_in_1.UpdateCheckoutSessionDtoIn({
                    _id: updatedPaymentTransactionDtoOut.paymentTransaction
                        .checkoutSessionId,
                    status: this.resolveCheckoutSessionStatus(updatedPaymentTransactionDtoOut.paymentTransaction.status),
                    source: 'SyncPaymentTransactionStatusUseCase',
                }));
                checkoutSession =
                    updatedCheckoutSessionDtoOut.checkoutSession;
            }
            return new sync_payment_transaction_status_dto_out_1.SyncPaymentTransactionStatusDtoOut(updatedPaymentTransactionDtoOut.paymentTransaction, checkoutSession, gatewayStatusDtoOut.success, gatewayStatusDtoOut.processMessage);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'SyncPaymentTransactionStatusUseCase',
                error,
                appFile: __filename,
                context: {
                    paymentTransactionId: dtoIn.paymentTransactionId,
                    force: dtoIn.force,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on sync payment transaction status use case';
            throw new Error(message);
        }
    }
    isFinalStatus(status) {
        return ['paid', 'failed', 'canceled', 'refunded', 'expired'].includes(status);
    }
    resolveCheckoutSessionStatus(paymentTransactionStatus) {
        if (paymentTransactionStatus === 'paid') {
            return 'paid';
        }
        if (paymentTransactionStatus === 'authorized') {
            return 'authorized';
        }
        if (paymentTransactionStatus === 'failed') {
            return 'failed';
        }
        if (paymentTransactionStatus === 'canceled') {
            return 'canceled';
        }
        if (paymentTransactionStatus === 'refunded') {
            return 'refunded';
        }
        if (paymentTransactionStatus === 'expired') {
            return 'expired';
        }
        return 'processing';
    }
    sanitizeSensitiveGatewayData(data) {
        if (data === null) {
            return null;
        }
        const sanitized = this.sanitizeUnknownGatewayValue(data);
        if (!sanitized ||
            typeof sanitized !== 'object' ||
            Array.isArray(sanitized)) {
            return null;
        }
        return sanitized;
    }
    sanitizeUnknownGatewayValue(value) {
        if (Array.isArray(value)) {
            return value.map((item) => this.sanitizeUnknownGatewayValue(item));
        }
        if (value && typeof value === 'object') {
            const sanitizedObject = {};
            for (const [key, itemValue] of Object.entries(value)) {
                if (this.isSensitiveGatewayKey(key)) {
                    sanitizedObject[key] = '[REDACTED]';
                    continue;
                }
                sanitizedObject[key] = this.sanitizeUnknownGatewayValue(itemValue);
            }
            return sanitizedObject;
        }
        return value;
    }
    isSensitiveGatewayKey(key) {
        const normalizedKey = key
            .toLowerCase()
            .trim()
            .replace(/[\s_\-]/g, '');
        const sensitiveKeys = [
            'token',
            'cardtoken',
            'encryptedcard',
            'cardnumber',
            'card',
            'cvv',
            'securitycode',
            'pan',
            'rawcard',
            'accesstoken',
            'providertoken',
            'authorization',
            'clientsecret',
            'merchantkey',
            'secret',
            'password',
        ];
        return sensitiveKeys.includes(normalizedKey);
    }
};
exports.SyncPaymentTransactionStatusUseCase = SyncPaymentTransactionStatusUseCase;
exports.SyncPaymentTransactionStatusUseCase = SyncPaymentTransactionStatusUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        update_payment_transaction_service_1.UpdatePaymentTransactionService,
        update_checkout_session_service_1.UpdateCheckoutSessionService,
        resolve_payment_gateway_credential_service_1.ResolvePaymentGatewayCredentialService,
        sync_gateway_payment_status_service_1.SyncGatewayPaymentStatusService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], SyncPaymentTransactionStatusUseCase);
//# sourceMappingURL=sync-payment-transaction-status.use-case.js.map