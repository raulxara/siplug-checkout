"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRecipientEntity = void 0;
class SplitRecipientEntity {
    splitRecipientsRepository;
    id = null;
    _id = null;
    officeId;
    clientId;
    gatewayId = null;
    apiCredentialId = null;
    name;
    documentType = null;
    documentValue = null;
    email = null;
    gatewayProvider = null;
    gatewayRecipientId = null;
    gatewayAccountId = null;
    bankData = null;
    metadata = null;
    config = null;
    changesHistory = null;
    status = 'active';
    createdAt = null;
    updatedAt = null;
    constructor(splitRecipientsRepository) {
        this.splitRecipientsRepository = splitRecipientsRepository;
    }
    async create() {
        if (!this.splitRecipientsRepository) {
            throw new Error('splitRecipientsRepository is required');
        }
        const created = await this.splitRecipientsRepository.create(this);
        this.id = created.id;
        this._id = created._id;
        this.officeId = created.officeId;
        this.clientId = created.clientId;
        this.gatewayId = created.gatewayId;
        this.apiCredentialId = created.apiCredentialId;
        this.name = created.name;
        this.documentType = created.documentType;
        this.documentValue = created.documentValue;
        this.email = created.email;
        this.gatewayProvider = created.gatewayProvider;
        this.gatewayRecipientId = created.gatewayRecipientId;
        this.gatewayAccountId = created.gatewayAccountId;
        this.bankData = created.bankData;
        this.metadata = created.metadata;
        this.config = created.config;
        this.changesHistory = created.changesHistory;
        this.status = created.status;
        this.createdAt = created.createdAt;
        this.updatedAt = created.updatedAt;
        return this;
    }
}
exports.SplitRecipientEntity = SplitRecipientEntity;
//# sourceMappingURL=split-recipient.entity.js.map