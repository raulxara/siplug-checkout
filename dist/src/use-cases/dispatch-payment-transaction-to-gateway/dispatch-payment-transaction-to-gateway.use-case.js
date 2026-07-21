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
exports.DispatchPaymentTransactionToGatewayUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const gateway_payment_dto_in_1 = require("../../modules/gateway-orchestration/dtos/gateway-payment.dto-in");
const decrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const dispatch_gateway_payment_service_1 = require("../../modules/gateway-orchestration/services/dispatch-gateway-payment/dispatch-gateway-payment.service");
const find_gateway_by_unique_id_dto_in_1 = require("../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in");
const find_gateway_by_unique_id_service_1 = require("../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const update_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in");
const update_payment_transaction_service_1 = require("../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const dispatch_payment_transaction_to_gateway_dto_out_1 = require("./dtos/dispatch-payment-transaction-to-gateway.dto-out");
let DispatchPaymentTransactionToGatewayUseCase = class DispatchPaymentTransactionToGatewayUseCase {
    resolveActorAuthorizationService;
    findPaymentTransactionByUniqueIdService;
    updatePaymentTransactionService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    findGatewayByUniqueIdService;
    findApiCredentialByUniqueIdService;
    dispatchGatewayPaymentService;
    decryptApiCredentialSecretService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findPaymentTransactionByUniqueIdService, updatePaymentTransactionService, findOfficeByUniqueIdService, findClientByUniqueIdService, findGatewayByUniqueIdService, findApiCredentialByUniqueIdService, dispatchGatewayPaymentService, decryptApiCredentialSecretService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findGatewayByUniqueIdService = findGatewayByUniqueIdService;
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.dispatchGatewayPaymentService = dispatchGatewayPaymentService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'dispatchPaymentTransactionToGateway',
                requiredEntity: 'payment_transactions',
            }));
            const paymentTransactionDtoOut = await this.findPaymentTransactionByUniqueIdService.exec(new find_payment_transaction_by_unique_id_dto_in_1.FindPaymentTransactionByUniqueIdDtoIn(dtoIn.paymentTransactionId));
            const paymentTransaction = paymentTransactionDtoOut.paymentTransaction;
            if (paymentTransaction.processStatus !== 'pending_gateway_dispatch') {
                throw new Error('payment transaction is not pending gateway dispatch');
            }
            if (paymentTransaction.status !== 'created') {
                throw new Error('payment transaction is not available for dispatch');
            }
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(paymentTransaction.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const clientDtoOut = await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(paymentTransaction.clientId));
            if (clientDtoOut.client.status !== 'active') {
                throw new Error('client is not active');
            }
            if (clientDtoOut.client.officeId !== paymentTransaction.officeId) {
                throw new Error('client does not belong to office');
            }
            const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(new find_gateway_by_unique_id_dto_in_1.FindGatewayByUniqueIdDtoIn(paymentTransaction.gatewayId));
            const gateway = gatewayDtoOut.gateway;
            if (gateway.status !== 'active') {
                throw new Error('gateway is not active');
            }
            let apiCredentialData = null;
            if (paymentTransaction.apiCredentialId !== null) {
                const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(paymentTransaction.apiCredentialId));
                const apiCredential = apiCredentialDtoOut.apiCredential;
                if (apiCredential.status !== 'active') {
                    throw new Error('api credential is not active');
                }
                if (apiCredential.gatewayId !== null &&
                    apiCredential.gatewayId !== paymentTransaction.gatewayId) {
                    throw new Error('api credential does not belong to gateway');
                }
                if (apiCredential.token === null || apiCredential.token.trim() === '') {
                    throw new Error('api credential token is required');
                }
                let apiCredentialData = null;
                if (apiCredential.token === null || apiCredential.token.trim() === '') {
                    throw new Error('api credential token is required');
                }
                const decryptedCredentialDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
                    apiCredential: {
                        config: {
                            token: apiCredential.token,
                        },
                    },
                    keysToDecrypt: ['token'],
                    strict: true,
                }));
                const decryptedProviderToken = this.extractDecryptedTokenFromApiCredentialConfig(decryptedCredentialDtoOut.apiCredential);
                apiCredentialData = {
                    _id: apiCredential._id,
                    slug: apiCredential.slug,
                    gatewayId: apiCredential.gatewayId,
                    token: decryptedProviderToken,
                    config: apiCredential.config,
                    connectionData: {
                        token: decryptedProviderToken,
                        config: apiCredential.config,
                    },
                };
            }
            const dispatchingTransactionDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                _id: paymentTransaction._id,
                processStatus: 'dispatching_gateway',
                processMessage: 'dispatching payment transaction to gateway',
                source: 'DispatchPaymentTransactionToGatewayUseCase.preDispatch',
            }));
            const gatewayPaymentDtoOut = await this.dispatchGatewayPaymentService.exec(new gateway_payment_dto_in_1.GatewayPaymentDtoIn({
                gatewayProvider: gateway.provider,
                gatewaySlug: gateway.slug,
                paymentTransaction: dispatchingTransactionDtoOut.paymentTransaction,
                apiCredential: apiCredentialData,
                providerPayload: dispatchingTransactionDtoOut.paymentTransaction.providerPayload,
                idempotencyKey: dispatchingTransactionDtoOut.paymentTransaction.idempotencyKey,
                config: {
                    gatewayConfig: gateway.config,
                    transactionConfig: dispatchingTransactionDtoOut.paymentTransaction.config,
                },
            }));
            const updatedTransactionDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                _id: paymentTransaction._id,
                gatewayTransactionId: gatewayPaymentDtoOut.gatewayTransactionId,
                gatewayStatus: gatewayPaymentDtoOut.gatewayStatus,
                status: gatewayPaymentDtoOut.status,
                processStatus: gatewayPaymentDtoOut.processStatus,
                processMessage: gatewayPaymentDtoOut.processMessage,
                providerPayload: gatewayPaymentDtoOut.providerRequest,
                providerResponse: gatewayPaymentDtoOut.providerResponse,
                gatewayResponse: gatewayPaymentDtoOut.gatewayResponse,
                qrCode: gatewayPaymentDtoOut.qrCode,
                qrCodeBase64: gatewayPaymentDtoOut.qrCodeBase64,
                boletoUrl: gatewayPaymentDtoOut.boletoUrl,
                checkoutUrl: gatewayPaymentDtoOut.checkoutUrl,
                paidAt: gatewayPaymentDtoOut.paidAt,
                authorizedAt: gatewayPaymentDtoOut.authorizedAt,
                canceledAt: gatewayPaymentDtoOut.canceledAt,
                failedAt: gatewayPaymentDtoOut.failedAt,
                refundedAt: gatewayPaymentDtoOut.refundedAt,
                expiresAt: gatewayPaymentDtoOut.expiresAt,
                source: 'DispatchPaymentTransactionToGatewayUseCase.postDispatch',
            }));
            return new dispatch_payment_transaction_to_gateway_dto_out_1.DispatchPaymentTransactionToGatewayDtoOut(updatedTransactionDtoOut.paymentTransaction);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'DispatchPaymentTransactionToGatewayUseCase',
                error,
                appFile: __filename,
                context: {
                    paymentTransactionId: dtoIn.paymentTransactionId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on dispatch payment transaction to gateway use case';
            throw new Error(message);
        }
    }
    extractDecryptedTokenFromApiCredentialConfig(apiCredential) {
        const config = apiCredential.config;
        if (!config || typeof config !== 'object' || Array.isArray(config)) {
            throw new Error('decrypted api credential config is invalid');
        }
        const token = config.token;
        if (typeof token !== 'string' || token.trim() === '') {
            throw new Error('decrypted api credential token is invalid');
        }
        return token;
    }
};
exports.DispatchPaymentTransactionToGatewayUseCase = DispatchPaymentTransactionToGatewayUseCase;
exports.DispatchPaymentTransactionToGatewayUseCase = DispatchPaymentTransactionToGatewayUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        update_payment_transaction_service_1.UpdatePaymentTransactionService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        find_gateway_by_unique_id_service_1.FindGatewayByUniqueIdService,
        find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        dispatch_gateway_payment_service_1.DispatchGatewayPaymentService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], DispatchPaymentTransactionToGatewayUseCase);
//# sourceMappingURL=dispatch-payment-transaction-to-gateway.use-case.js.map