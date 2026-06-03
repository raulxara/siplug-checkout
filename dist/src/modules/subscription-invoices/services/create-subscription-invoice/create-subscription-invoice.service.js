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
exports.CreateSubscriptionInvoiceService = void 0;
const common_1 = require("@nestjs/common");
const subscription_invoice_entity_1 = require("../../entities/subscription-invoice.entity");
const subscription_invoices_tokens_1 = require("../../tokens/subscription-invoices.tokens");
const create_subscription_invoice_dto_out_1 = require("./dtos/create-subscription-invoice.dto-out");
let CreateSubscriptionInvoiceService = class CreateSubscriptionInvoiceService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new subscription_invoice_entity_1.SubscriptionInvoiceEntity(this.repository);
            entity.subscriptionId = dtoIn.subscriptionId;
            entity.subscriptionCycleId = dtoIn.subscriptionCycleId;
            entity.paymentTransactionId = dtoIn.paymentTransactionId;
            entity.invoiceNumber = dtoIn.invoiceNumber;
            entity.amount = dtoIn.amount;
            entity.currency = dtoIn.currency;
            entity.dueAt = dtoIn.dueAt;
            entity.paidAt = dtoIn.paidAt;
            entity.attemptNumber = dtoIn.attemptNumber;
            entity.externalReference = dtoIn.externalReference;
            entity.gatewayInvoiceId = dtoIn.gatewayInvoiceId;
            entity.lastAttemptAt = dtoIn.lastAttemptAt;
            entity.metadata = dtoIn.metadata;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            const created = await entity.create();
            return new create_subscription_invoice_dto_out_1.CreateSubscriptionInvoiceDtoOut(this.toRow(created));
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on create subscription invoice';
            throw new Error(message);
        }
    }
    toRow(entity) {
        return {
            id: this.requiredNumber(entity.id, 'subscription invoice id'),
            _id: this.requiredString(entity._id, 'subscription invoice _id'),
            subscriptionId: entity.subscriptionId,
            subscriptionCycleId: entity.subscriptionCycleId,
            paymentTransactionId: entity.paymentTransactionId,
            invoiceNumber: entity.invoiceNumber,
            amount: entity.amount,
            currency: entity.currency,
            dueAt: entity.dueAt,
            paidAt: entity.paidAt,
            attemptNumber: entity.attemptNumber,
            externalReference: entity.externalReference,
            gatewayInvoiceId: entity.gatewayInvoiceId,
            lastAttemptAt: entity.lastAttemptAt,
            metadata: entity.metadata,
            config: entity.config,
            changesHistory: entity.changesHistory,
            status: this.requiredString(entity.status, 'subscription invoice status'),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    requiredNumber(value, field) {
        if (value === null) {
            throw new Error(`${field} was not hydrated`);
        }
        return value;
    }
    requiredString(value, field) {
        if (value === null || value.trim() === '') {
            throw new Error(`${field} was not hydrated`);
        }
        return value;
    }
};
exports.CreateSubscriptionInvoiceService = CreateSubscriptionInvoiceService;
exports.CreateSubscriptionInvoiceService = CreateSubscriptionInvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscription_invoices_tokens_1.SUBSCRIPTION_INVOICES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateSubscriptionInvoiceService);
//# sourceMappingURL=create-subscription-invoice.service.js.map