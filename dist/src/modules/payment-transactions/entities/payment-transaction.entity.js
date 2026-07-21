"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class PaymentTransactionEntity extends abstract_entity_1.AbstractEntity {
    repository;
    officeId;
    clientId;
    checkoutSessionId = null;
    paymentCustomerId = null;
    gatewayId;
    apiCredentialId = null;
    gatewayTransactionId = null;
    externalReference = null;
    idempotencyKey = null;
    paymentType;
    paymentMethod;
    amount;
    currency;
    installments = null;
    installmentAmount = null;
    interestAmount = null;
    interestType = null;
    gatewayStatus = null;
    processStatus;
    processMessage = null;
    providerPayload = null;
    providerResponse = null;
    gatewayResponse = null;
    qrCode = null;
    qrCodeBase64 = null;
    boletoUrl = null;
    checkoutUrl = null;
    splitRequired = false;
    hasSplit = false;
    paidAt = null;
    authorizedAt = null;
    canceledAt = null;
    failedAt = null;
    refundedAt = null;
    expiresAt = null;
    metadata = null;
    config = null;
    changesHistory = null;
    constructor(repository) {
        super();
        this.repository = repository;
    }
    async create() {
        const fresh = await this.repository.create(this);
        this.hydrate({
            id: fresh.id,
            _id: fresh._id,
            officeId: fresh.officeId,
            clientId: fresh.clientId,
            checkoutSessionId: fresh.checkoutSessionId,
            paymentCustomerId: fresh.paymentCustomerId,
            gatewayId: fresh.gatewayId,
            apiCredentialId: fresh.apiCredentialId,
            gatewayTransactionId: fresh.gatewayTransactionId,
            externalReference: fresh.externalReference,
            idempotencyKey: fresh.idempotencyKey,
            paymentType: fresh.paymentType,
            paymentMethod: fresh.paymentMethod,
            amount: fresh.amount,
            currency: fresh.currency,
            installments: fresh.installments,
            installmentAmount: fresh.installmentAmount,
            interestAmount: fresh.interestAmount,
            interestType: fresh.interestType,
            gatewayStatus: fresh.gatewayStatus,
            status: fresh.status,
            processStatus: fresh.processStatus,
            processMessage: fresh.processMessage,
            providerPayload: fresh.providerPayload,
            providerResponse: fresh.providerResponse,
            gatewayResponse: fresh.gatewayResponse,
            qrCode: fresh.qrCode,
            qrCodeBase64: fresh.qrCodeBase64,
            boletoUrl: fresh.boletoUrl,
            checkoutUrl: fresh.checkoutUrl,
            splitRequired: fresh.splitRequired,
            hasSplit: fresh.hasSplit,
            paidAt: fresh.paidAt,
            authorizedAt: fresh.authorizedAt,
            canceledAt: fresh.canceledAt,
            failedAt: fresh.failedAt,
            refundedAt: fresh.refundedAt,
            expiresAt: fresh.expiresAt,
            metadata: fresh.metadata,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.PaymentTransactionEntity = PaymentTransactionEntity;
//# sourceMappingURL=payment-transaction.entity.js.map