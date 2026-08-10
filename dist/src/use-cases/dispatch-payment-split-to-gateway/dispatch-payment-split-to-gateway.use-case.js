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
exports.DispatchPaymentSplitToGatewayUseCase = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const gateway_split_transfer_dto_in_1 = require("../../modules/gateway-split-transfers/dtos/gateway-split-transfer.dto-in");
const dispatch_gateway_split_transfer_service_1 = require("../../modules/gateway-split-transfers/services/dispatch-gateway-split-transfer/dispatch-gateway-split-transfer.service");
const get_all_payment_split_recipients_by_payment_split_id_dto_in_1 = require("../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in");
const get_all_payment_split_recipients_by_payment_split_id_service_1 = require("../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service");
const update_payment_split_recipient_dto_in_1 = require("../../modules/payment-split-recipients/services/update-payment-split-recipient/dtos/update-payment-split-recipient.dto-in");
const update_payment_split_recipient_service_1 = require("../../modules/payment-split-recipients/services/update-payment-split-recipient/update-payment-split-recipient.service");
const find_payment_split_by_unique_id_dto_in_1 = require("../../modules/payment-splits/services/find-payment-split-by-unique-id/dtos/find-payment-split-by-unique-id.dto-in");
const find_payment_split_by_unique_id_service_1 = require("../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service");
const update_payment_split_dto_in_1 = require("../../modules/payment-splits/services/update-payment-split/dtos/update-payment-split.dto-in");
const update_payment_split_service_1 = require("../../modules/payment-splits/services/update-payment-split/update-payment-split.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const dispatch_payment_split_to_gateway_dto_out_1 = require("./dtos/dispatch-payment-split-to-gateway.dto-out");
let DispatchPaymentSplitToGatewayUseCase = class DispatchPaymentSplitToGatewayUseCase {
    findPaymentSplitByUniqueIdService;
    updatePaymentSplitService;
    getAllPaymentSplitRecipientsByPaymentSplitIdService;
    updatePaymentSplitRecipientService;
    findPaymentTransactionByUniqueIdService;
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    dispatchGatewaySplitTransferService;
    handleUseCaseExceptionService;
    constructor(findPaymentSplitByUniqueIdService, updatePaymentSplitService, getAllPaymentSplitRecipientsByPaymentSplitIdService, updatePaymentSplitRecipientService, findPaymentTransactionByUniqueIdService, findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, dispatchGatewaySplitTransferService, handleUseCaseExceptionService) {
        this.findPaymentSplitByUniqueIdService = findPaymentSplitByUniqueIdService;
        this.updatePaymentSplitService = updatePaymentSplitService;
        this.getAllPaymentSplitRecipientsByPaymentSplitIdService = getAllPaymentSplitRecipientsByPaymentSplitIdService;
        this.updatePaymentSplitRecipientService = updatePaymentSplitRecipientService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.dispatchGatewaySplitTransferService = dispatchGatewaySplitTransferService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const paymentSplitDtoOut = await this.findPaymentSplitByUniqueIdService.exec(new find_payment_split_by_unique_id_dto_in_1.FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId));
            const paymentSplit = paymentSplitDtoOut.paymentSplit;
            const currentStatus = String(paymentSplit.status ?? '').trim();
            if (currentStatus === 'transferred') {
                return new dispatch_payment_split_to_gateway_dto_out_1.DispatchPaymentSplitToGatewayDtoOut(false, 'payment split already transferred', paymentSplit, [], {
                    skipped: true,
                    reason: 'payment split already transferred',
                });
            }
            const dispatchableStatuses = [
                'created',
                'pending_gateway',
                'processing_gateway',
                'failed',
                'partially_transferred',
                'gateway_failed_retryable',
            ];
            if (!dispatchableStatuses.includes(currentStatus)) {
                return new dispatch_payment_split_to_gateway_dto_out_1.DispatchPaymentSplitToGatewayDtoOut(false, `payment split status does not allow gateway dispatch: ${currentStatus}`, paymentSplit, [], {
                    skipped: true,
                    reason: 'payment split status does not allow gateway dispatch',
                    currentStatus,
                    dispatchableStatuses,
                });
            }
            if (String(paymentSplit.gatewayProvider ?? '').trim() !== dtoIn.provider) {
                throw new Error('payment split gateway provider does not match webhook provider');
            }
            if (String(paymentSplit.paymentTransactionId ?? '').trim() !==
                dtoIn.paymentTransactionId) {
                throw new Error('payment split does not belong to payment transaction');
            }
            const paymentTransactionDtoOut = await this.findPaymentTransactionByUniqueIdService.exec(new find_payment_transaction_by_unique_id_dto_in_1.FindPaymentTransactionByUniqueIdDtoIn(dtoIn.paymentTransactionId));
            const paymentTransaction = paymentTransactionDtoOut.paymentTransaction;
            if (!paymentTransaction.apiCredentialId) {
                throw new Error('payment transaction apiCredentialId is required');
            }
            const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(paymentTransaction.apiCredentialId));
            const apiCredential = apiCredentialDtoOut.apiCredential;
            if (apiCredential.status !== 'active') {
                throw new Error('api credential is not active');
            }
            if (apiCredential.provider !== dtoIn.provider) {
                throw new Error('api credential provider does not match split provider');
            }
            const providerToken = this.resolveProviderToken(apiCredential);
            const recipientsDtoOut = await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(new get_all_payment_split_recipients_by_payment_split_id_dto_in_1.GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(dtoIn.paymentSplitId));
            const paymentSplitRecipients = this.extractRecipients(recipientsDtoOut);
            if (paymentSplitRecipients.length === 0) {
                throw new Error('payment split must have at least one recipient');
            }
            const retainedRecipients = await this.markRetainedRecipientsBeforeGatewayDispatch({
                currentRecipients: paymentSplitRecipients,
                provider: dtoIn.provider,
            });
            const recipientsForGateway = this.buildRecipientsForGateway(paymentSplitRecipients);
            await this.updatePaymentSplitService.exec(new update_payment_split_dto_in_1.UpdatePaymentSplitDtoIn({
                _id: dtoIn.paymentSplitId,
                status: 'processing_gateway',
                providerPayload: {
                    provider: dtoIn.provider,
                    sourceTransactionId: dtoIn.sourceTransactionId,
                    paymentTransactionId: dtoIn.paymentTransactionId,
                    paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                    recipients: recipientsForGateway,
                    retainedRecipients,
                },
                metadata: {
                    ...(this.toObject(paymentSplit.metadata) ?? {}),
                    lastGatewayDispatch: {
                        provider: dtoIn.provider,
                        sourceTransactionId: dtoIn.sourceTransactionId,
                        paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                        eventId: dtoIn.eventId,
                        eventType: dtoIn.eventType,
                        eventAction: dtoIn.eventAction,
                        canonicalStatus: dtoIn.canonicalStatus,
                        startedAt: new Date().toISOString(),
                    },
                },
                source: 'DispatchPaymentSplitToGatewayUseCase.processingGateway',
            }));
            if (recipientsForGateway.length === 0) {
                const retainedOnlyGatewayResponse = {
                    provider: dtoIn.provider,
                    status: 'transferred',
                    transfers: [],
                    retainedRecipients,
                    successCount: 0,
                    failedCount: 0,
                    retainedCount: retainedRecipients.length,
                };
                const finalSplitDtoOut = await this.updatePaymentSplitService.exec(new update_payment_split_dto_in_1.UpdatePaymentSplitDtoIn({
                    _id: dtoIn.paymentSplitId,
                    gatewaySplitId: null,
                    providerResponse: {
                        provider: dtoIn.provider,
                        transfers: [],
                        retainedRecipients,
                    },
                    gatewayResponse: retainedOnlyGatewayResponse,
                    metadata: {
                        ...(this.toObject(paymentSplit.metadata) ?? {}),
                        lastGatewayDispatch: {
                            provider: dtoIn.provider,
                            sourceTransactionId: dtoIn.sourceTransactionId,
                            paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                            eventId: dtoIn.eventId,
                            eventType: dtoIn.eventType,
                            eventAction: dtoIn.eventAction,
                            canonicalStatus: dtoIn.canonicalStatus,
                            finishedAt: new Date().toISOString(),
                            status: 'transferred',
                            dispatched: false,
                            completed: true,
                            retainedOnly: true,
                            errorMessage: null,
                        },
                    },
                    status: 'transferred',
                    source: 'DispatchPaymentSplitToGatewayUseCase.retainedOnly',
                }));
                return new dispatch_payment_split_to_gateway_dto_out_1.DispatchPaymentSplitToGatewayDtoOut(true, 'payment split completed with retained recipients only', finalSplitDtoOut.paymentSplit, retainedRecipients, {
                    dispatched: false,
                    completed: true,
                    status: 'transferred',
                    gatewayProvider: dtoIn.provider,
                    retainedOnly: true,
                    retainedRecipients,
                    transfers: [],
                });
            }
            const gatewayDtoOut = await this.dispatchGatewaySplitTransferService.exec(new gateway_split_transfer_dto_in_1.GatewaySplitTransferDtoIn({
                gatewayProvider: dtoIn.provider,
                providerToken,
                paymentSplitId: dtoIn.paymentSplitId,
                paymentTransactionId: dtoIn.paymentTransactionId,
                paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                sourceTransactionId: dtoIn.sourceTransactionId,
                idempotencyKey: this.buildIdempotencyKey(dtoIn),
                recipients: recipientsForGateway,
                metadata: {
                    source: 'DispatchPaymentSplitToGatewayUseCase',
                    eventId: dtoIn.eventId,
                    eventType: dtoIn.eventType,
                    eventAction: dtoIn.eventAction,
                    canonicalStatus: dtoIn.canonicalStatus,
                },
                config: null,
            }));
            const gatewayUpdatedRecipients = await this.updateRecipientsAfterGatewayDispatch({
                currentRecipients: paymentSplitRecipients,
                transfers: gatewayDtoOut.transfers,
            });
            const updatedRecipients = [
                ...retainedRecipients,
                ...gatewayUpdatedRecipients,
            ];
            const finalProviderResponse = this.mergeProviderResponseWithRetainedRecipients({
                providerResponse: gatewayDtoOut.providerResponse,
                retainedRecipients,
            });
            const finalGatewayResponse = this.mergeGatewayResponseWithRetainedRecipients({
                gatewayResponse: gatewayDtoOut.gatewayResponse,
                retainedRecipients,
            });
            const finalSplitDtoOut = await this.updatePaymentSplitService.exec(new update_payment_split_dto_in_1.UpdatePaymentSplitDtoIn({
                _id: dtoIn.paymentSplitId,
                gatewaySplitId: gatewayDtoOut.gatewaySplitId,
                providerResponse: finalProviderResponse,
                gatewayResponse: finalGatewayResponse,
                metadata: {
                    ...(this.toObject(paymentSplit.metadata) ?? {}),
                    lastGatewayDispatch: {
                        provider: dtoIn.provider,
                        sourceTransactionId: dtoIn.sourceTransactionId,
                        paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                        eventId: dtoIn.eventId,
                        eventType: dtoIn.eventType,
                        eventAction: dtoIn.eventAction,
                        canonicalStatus: dtoIn.canonicalStatus,
                        finishedAt: new Date().toISOString(),
                        status: gatewayDtoOut.status,
                        dispatched: gatewayDtoOut.dispatched,
                        errorMessage: gatewayDtoOut.errorMessage,
                    },
                },
                status: gatewayDtoOut.status,
                source: 'DispatchPaymentSplitToGatewayUseCase.gatewayResult',
            }));
            return new dispatch_payment_split_to_gateway_dto_out_1.DispatchPaymentSplitToGatewayDtoOut(gatewayDtoOut.dispatched, gatewayDtoOut.dispatched
                ? 'payment split dispatched to gateway successfully'
                : gatewayDtoOut.errorMessage ?? 'payment split was not dispatched', finalSplitDtoOut.paymentSplit, updatedRecipients, {
                dispatched: gatewayDtoOut.dispatched,
                gatewayProvider: gatewayDtoOut.gatewayProvider,
                status: gatewayDtoOut.status,
                gatewaySplitId: gatewayDtoOut.gatewaySplitId,
                transfers: gatewayDtoOut.transfers,
                errorMessage: gatewayDtoOut.errorMessage,
            });
        }
        catch (error) {
            await this.markSplitAsFailedSafe({
                paymentSplitId: dtoIn.paymentSplitId,
                error,
                provider: dtoIn.provider,
                sourceTransactionId: dtoIn.sourceTransactionId,
                paymentTransactionId: dtoIn.paymentTransactionId,
                paymentWebhookEventId: dtoIn.paymentWebhookEventId,
            });
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'DispatchPaymentSplitToGatewayUseCase',
                error,
                appFile: __filename,
                context: {
                    paymentSplitId: dtoIn.paymentSplitId,
                    paymentTransactionId: dtoIn.paymentTransactionId,
                    paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                    provider: dtoIn.provider,
                    sourceTransactionId: dtoIn.sourceTransactionId,
                    eventId: dtoIn.eventId,
                    eventType: dtoIn.eventType,
                    canonicalStatus: dtoIn.canonicalStatus,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on dispatch payment split to gateway use case';
            throw new Error(message);
        }
    }
    resolveProviderToken(apiCredential) {
        if (!apiCredential.token) {
            throw new Error('api credential token is required');
        }
        const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
            apiCredential: {
                config: {
                    token: apiCredential.token,
                },
            },
            keysToDecrypt: ['token'],
            strict: true,
        }));
        const config = decryptedDtoOut.apiCredential.config;
        if (!config || typeof config !== 'object' || Array.isArray(config)) {
            throw new Error('decrypted api credential token config is invalid');
        }
        const token = String(config.token ?? '').trim();
        if (token === '') {
            throw new Error('decrypted api credential token is required');
        }
        return token;
    }
    extractRecipients(dtoOut) {
        const response = dtoOut;
        return (response.paymentSplitRecipients ??
            response.recipients ??
            response.items ??
            response.data ??
            []);
    }
    buildRecipientsForGateway(recipients) {
        return recipients
            .filter((recipient) => {
            const status = String(recipient.status ?? '').trim();
            if (['transferred', 'retained'].includes(status)) {
                return false;
            }
            return !this.shouldRetainRecipientOnPlatform(recipient);
        })
            .map((recipient) => {
            const paymentSplitRecipientId = String(recipient._id ?? '').trim();
            const splitRecipientId = String(recipient.splitRecipientId ?? '').trim();
            const amount = Number(recipient.amount ?? 0);
            const currency = String(recipient.currency ?? 'BRL').trim();
            const destinationAccountId = this.resolveDestinationAccountId(recipient);
            if (paymentSplitRecipientId === '') {
                throw new Error('paymentSplitRecipient._id is required');
            }
            if (splitRecipientId === '') {
                throw new Error('paymentSplitRecipient.splitRecipientId is required');
            }
            if (!Number.isInteger(amount) || amount <= 0) {
                throw new Error(`payment split recipient amount must be greater than zero: ${paymentSplitRecipientId}`);
            }
            if (currency === '') {
                throw new Error(`payment split recipient currency is required: ${paymentSplitRecipientId}`);
            }
            if (destinationAccountId === null) {
                throw new Error(`gateway destination account id is required for payment split recipient: ${paymentSplitRecipientId}`);
            }
            return {
                paymentSplitRecipientId,
                splitRecipientId,
                destinationAccountId,
                amount,
                currency,
                role: String(recipient.role ?? 'secondary'),
                metadata: this.toObject(recipient.metadata),
                config: this.toObject(recipient.config),
            };
        });
    }
    resolveDestinationAccountId(recipient) {
        const direct = this.toNullableString(recipient.gatewayRecipientId) ??
            this.toNullableString(recipient.gateway_recipient_id) ??
            this.toNullableString(recipient.gatewayAccountId) ??
            this.toNullableString(recipient.gateway_account_id);
        if (direct !== null) {
            return direct;
        }
        const config = this.toObject(recipient.config);
        const metadata = this.toObject(recipient.metadata);
        return (this.extractString(config, 'stripeAccountId') ??
            this.extractString(config, 'stripe_account_id') ??
            this.extractString(config, 'gatewayRecipientId') ??
            this.extractString(config, 'gateway_recipient_id') ??
            this.extractString(config, 'gatewayAccountId') ??
            this.extractString(config, 'gateway_account_id') ??
            this.extractString(metadata, 'stripeAccountId') ??
            this.extractString(metadata, 'stripe_account_id') ??
            this.extractString(metadata, 'gatewayRecipientId') ??
            this.extractString(metadata, 'gateway_recipient_id') ??
            this.extractString(metadata, 'gatewayAccountId') ??
            this.extractString(metadata, 'gateway_account_id'));
    }
    async markRetainedRecipientsBeforeGatewayDispatch(params) {
        const retainedRecipients = [];
        for (const recipient of params.currentRecipients) {
            if (!this.shouldRetainRecipientOnPlatform(recipient)) {
                continue;
            }
            const retainedData = this.buildRetainedRecipientData(recipient);
            const currentStatus = String(recipient.status ?? '').trim();
            if (currentStatus === 'retained') {
                retainedRecipients.push(retainedData);
                continue;
            }
            const updatedDtoOut = await this.updatePaymentSplitRecipientService.exec(new update_payment_split_recipient_dto_in_1.UpdatePaymentSplitRecipientDtoIn({
                _id: retainedData.paymentSplitRecipientId,
                gatewayRecipientId: this.resolveDestinationAccountId(recipient),
                gatewayTransferId: null,
                providerResponse: {
                    provider: params.provider,
                    transfer: null,
                    retainedOnPlatform: true,
                    retainedRecipient: retainedData,
                },
                gatewayResponse: {
                    provider: params.provider,
                    status: 'retained',
                    transfer: null,
                    retainedOnPlatform: true,
                    retainedRecipient: retainedData,
                },
                metadata: {
                    ...(this.toObject(recipient.metadata) ?? {}),
                    retainOnPlatform: true,
                    gatewayTransferMode: 'retained_on_platform',
                    lastGatewayTransfer: {
                        provider: params.provider,
                        gatewayTransferId: null,
                        success: true,
                        statusCode: null,
                        retainedOnPlatform: true,
                        processedAt: new Date().toISOString(),
                    },
                },
                status: 'retained',
                source: 'DispatchPaymentSplitToGatewayUseCase.retainedOnPlatform',
            }));
            retainedRecipients.push(this.buildRetainedRecipientData(updatedDtoOut.paymentSplitRecipient));
        }
        return retainedRecipients;
    }
    buildRetainedRecipientData(recipient) {
        const paymentSplitRecipientId = String(recipient._id ?? '').trim();
        const splitRecipientId = String(recipient.splitRecipientId ?? '').trim();
        const amount = Number(recipient.amount ?? 0);
        const currency = String(recipient.currency ?? 'BRL').trim();
        if (paymentSplitRecipientId === '') {
            throw new Error('retained paymentSplitRecipient._id is required');
        }
        if (splitRecipientId === '') {
            throw new Error('retained paymentSplitRecipient.splitRecipientId is required');
        }
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error(`retained payment split recipient amount must be greater than zero: ${paymentSplitRecipientId}`);
        }
        if (currency === '') {
            throw new Error(`retained payment split recipient currency is required: ${paymentSplitRecipientId}`);
        }
        return {
            paymentSplitRecipientId,
            splitRecipientId,
            amount,
            currency,
            role: String(recipient.role ?? 'platform'),
            retainedOnPlatform: true,
            metadata: this.toObject(recipient.metadata),
            config: this.toObject(recipient.config),
        };
    }
    shouldRetainRecipientOnPlatform(recipient) {
        const config = this.toObject(recipient.config);
        const metadata = this.toObject(recipient.metadata);
        const explicitTransferToGateway = this.extractBoolean(config, 'transferToGateway') ??
            this.extractBoolean(config, 'transfer_to_gateway') ??
            this.extractBoolean(metadata, 'transferToGateway') ??
            this.extractBoolean(metadata, 'transfer_to_gateway');
        if (explicitTransferToGateway === true) {
            return false;
        }
        const explicitRetainOnPlatform = this.extractBoolean(config, 'retainOnPlatform') ??
            this.extractBoolean(config, 'retain_on_platform') ??
            this.extractBoolean(metadata, 'retainOnPlatform') ??
            this.extractBoolean(metadata, 'retain_on_platform');
        if (explicitRetainOnPlatform !== null) {
            return explicitRetainOnPlatform;
        }
        const role = String(recipient.role ?? '').trim().toLowerCase();
        return ['platform', 'commission', 'application_fee'].includes(role);
    }
    mergeProviderResponseWithRetainedRecipients(params) {
        return {
            ...(this.toObject(params.providerResponse) ?? {}),
            retainedRecipients: params.retainedRecipients,
            retainedCount: params.retainedRecipients.length,
        };
    }
    mergeGatewayResponseWithRetainedRecipients(params) {
        const gatewayResponse = this.toObject(params.gatewayResponse) ?? {};
        const currentSuccessCount = Number(gatewayResponse.successCount ?? 0);
        const currentFailedCount = Number(gatewayResponse.failedCount ?? 0);
        return {
            ...gatewayResponse,
            retainedRecipients: params.retainedRecipients,
            retainedCount: params.retainedRecipients.length,
            successCount: currentSuccessCount,
            failedCount: currentFailedCount,
        };
    }
    extractBoolean(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (value === true || value === false) {
            return value;
        }
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
                return true;
            }
            if (normalized === 'false' || normalized === '0' || normalized === 'no') {
                return false;
            }
        }
        if (typeof value === 'number') {
            if (value === 1) {
                return true;
            }
            if (value === 0) {
                return false;
            }
        }
        return null;
    }
    async updateRecipientsAfterGatewayDispatch(params) {
        const updatedRecipients = [];
        for (const transfer of params.transfers) {
            const paymentSplitRecipientId = String(transfer.paymentSplitRecipientId ?? '').trim();
            if (paymentSplitRecipientId === '') {
                continue;
            }
            const currentRecipient = params.currentRecipients.find((recipient) => String(recipient._id ?? '').trim() === paymentSplitRecipientId);
            const status = transfer.success === true ? 'transferred' : 'failed';
            const updatedDtoOut = await this.updatePaymentSplitRecipientService.exec(new update_payment_split_recipient_dto_in_1.UpdatePaymentSplitRecipientDtoIn({
                _id: paymentSplitRecipientId,
                gatewayRecipientId: this.toNullableString(transfer.destinationAccountId),
                gatewayTransferId: this.toNullableString(transfer.gatewayTransferId),
                providerResponse: {
                    provider: 'stripe',
                    transfer,
                },
                gatewayResponse: {
                    provider: 'stripe',
                    transfer,
                },
                metadata: {
                    ...(this.toObject(currentRecipient?.metadata) ?? {}),
                    lastGatewayTransfer: {
                        provider: 'stripe',
                        gatewayTransferId: this.toNullableString(transfer.gatewayTransferId),
                        success: transfer.success === true,
                        statusCode: transfer.statusCode,
                        processedAt: new Date().toISOString(),
                    },
                },
                status,
                source: 'DispatchPaymentSplitToGatewayUseCase.updateRecipientAfterGatewayDispatch',
            }));
            updatedRecipients.push(updatedDtoOut.paymentSplitRecipient);
        }
        return updatedRecipients;
    }
    async markSplitAsFailedSafe(params) {
        try {
            const message = params.error instanceof Error
                ? params.error.message
                : 'error on dispatch payment split to gateway';
            await this.updatePaymentSplitService.exec(new update_payment_split_dto_in_1.UpdatePaymentSplitDtoIn({
                _id: params.paymentSplitId,
                gatewayResponse: {
                    provider: params.provider,
                    sourceTransactionId: params.sourceTransactionId,
                    paymentTransactionId: params.paymentTransactionId,
                    paymentWebhookEventId: params.paymentWebhookEventId,
                    errorMessage: message,
                    failedAt: new Date().toISOString(),
                },
                status: 'failed',
                source: 'DispatchPaymentSplitToGatewayUseCase.failed',
            }));
        }
        catch {
        }
    }
    buildIdempotencyKey(dtoIn) {
        return [
            'payment-split-transfer',
            dtoIn.provider,
            dtoIn.paymentSplitId,
            dtoIn.sourceTransactionId,
        ].join(':');
    }
    toObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    extractString(object, key) {
        if (object === null) {
            return null;
        }
        return this.toNullableString(object[key]);
    }
};
exports.DispatchPaymentSplitToGatewayUseCase = DispatchPaymentSplitToGatewayUseCase;
exports.DispatchPaymentSplitToGatewayUseCase = DispatchPaymentSplitToGatewayUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_payment_split_by_unique_id_service_1.FindPaymentSplitByUniqueIdService,
        update_payment_split_service_1.UpdatePaymentSplitService,
        get_all_payment_split_recipients_by_payment_split_id_service_1.GetAllPaymentSplitRecipientsByPaymentSplitIdService,
        update_payment_split_recipient_service_1.UpdatePaymentSplitRecipientService,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        dispatch_gateway_split_transfer_service_1.DispatchGatewaySplitTransferService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], DispatchPaymentSplitToGatewayUseCase);
//# sourceMappingURL=dispatch-payment-split-to-gateway.use-case.js.map