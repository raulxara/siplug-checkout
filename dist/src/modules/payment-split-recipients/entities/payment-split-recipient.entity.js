"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSplitRecipientEntity = void 0;
class PaymentSplitRecipientEntity {
    paymentSplitRecipientsRepository;
    id = null;
    _id = null;
    paymentSplitId;
    splitRecipientId;
    gatewayRecipientId = null;
    gatewayTransferId = null;
    role = 'secondary';
    amount;
    percentage = null;
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
    constructor(paymentSplitRecipientsRepository) {
        this.paymentSplitRecipientsRepository = paymentSplitRecipientsRepository;
    }
    async create() {
        if (!this.paymentSplitRecipientsRepository) {
            throw new Error('paymentSplitRecipientsRepository is required');
        }
        const created = await this.paymentSplitRecipientsRepository.create(this);
        this.id = created.id;
        this._id = created._id;
        this.paymentSplitId = created.paymentSplitId;
        this.splitRecipientId = created.splitRecipientId;
        this.gatewayRecipientId = created.gatewayRecipientId;
        this.gatewayTransferId = created.gatewayTransferId;
        this.role = created.role;
        this.amount = created.amount;
        this.percentage = created.percentage;
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
exports.PaymentSplitRecipientEntity = PaymentSplitRecipientEntity;
//# sourceMappingURL=payment-split-recipient.entity.js.map