"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSplitEntity = void 0;
class PaymentSplitEntity {
    paymentSplitsRepository;
    id = null;
    _id = null;
    officeId;
    clientId;
    checkoutSessionId = null;
    paymentTransactionId;
    subscriptionId = null;
    subscriptionInvoiceId = null;
    splitRuleId = null;
    gatewayProvider;
    gatewaySplitId = null;
    amount;
    currency;
    providerPayload = null;
    providerResponse = null;
    gatewayResponse = null;
    metadata = null;
    config = null;
    changesHistory = null;
    status = 'created';
    createdAt = null;
    updatedAt = null;
    constructor(paymentSplitsRepository) {
        this.paymentSplitsRepository = paymentSplitsRepository;
    }
    async create() {
        if (!this.paymentSplitsRepository) {
            throw new Error('paymentSplitsRepository is required');
        }
        const created = await this.paymentSplitsRepository.create(this);
        this.id = created.id;
        this._id = created._id;
        this.officeId = created.officeId;
        this.clientId = created.clientId;
        this.checkoutSessionId = created.checkoutSessionId;
        this.paymentTransactionId = created.paymentTransactionId;
        this.subscriptionId = created.subscriptionId;
        this.subscriptionInvoiceId = created.subscriptionInvoiceId;
        this.splitRuleId = created.splitRuleId;
        this.gatewayProvider = created.gatewayProvider;
        this.gatewaySplitId = created.gatewaySplitId;
        this.amount = created.amount;
        this.currency = created.currency;
        this.providerPayload = created.providerPayload;
        this.providerResponse = created.providerResponse;
        this.gatewayResponse = created.gatewayResponse;
        this.metadata = created.metadata;
        this.config = created.config;
        this.changesHistory = created.changesHistory;
        this.status = created.status;
        this.createdAt = created.createdAt;
        this.updatedAt = created.updatedAt;
        return this;
    }
}
exports.PaymentSplitEntity = PaymentSplitEntity;
//# sourceMappingURL=payment-split.entity.js.map