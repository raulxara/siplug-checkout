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
exports.UpdateSubscriptionInvoiceService = void 0;
const common_1 = require("@nestjs/common");
const subscription_invoices_tokens_1 = require("../../tokens/subscription-invoices.tokens");
const update_subscription_invoice_dto_out_1 = require("./dtos/update-subscription-invoice.dto-out");
let UpdateSubscriptionInvoiceService = class UpdateSubscriptionInvoiceService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const current = await this.repository.findByUniqueId(dtoIn._id);
            if (!current) {
                throw new Error('subscription invoice not found');
            }
            const changesHistory = this.buildChangesHistory({
                current,
                dtoIn,
            });
            const updated = await this.repository.updateByUniqueId(dtoIn._id, {
                payment_transaction_id: dtoIn.paymentTransactionId,
                gateway_invoice_id: dtoIn.gatewayInvoiceId,
                last_attempt_at: dtoIn.lastAttemptAt,
                attempt_number: dtoIn.attemptNumber,
                paid_at: dtoIn.paidAt,
                metadata: dtoIn.metadata,
                config: dtoIn.config,
                status: dtoIn.status,
                changes_history: changesHistory,
            });
            return new update_subscription_invoice_dto_out_1.UpdateSubscriptionInvoiceDtoOut(updated);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update subscription invoice';
            throw new Error(message);
        }
    }
    buildChangesHistory(params) {
        const previous = params.current.changesHistory ?? [];
        const changes = {
            source: params.dtoIn.source,
            changedAt: new Date().toISOString(),
            old: {},
            new: {},
        };
        const oldValues = changes.old;
        const newValues = changes.new;
        this.appendChange(oldValues, newValues, 'paymentTransactionId', params.current.paymentTransactionId, params.dtoIn.paymentTransactionId);
        this.appendChange(oldValues, newValues, 'gatewayInvoiceId', params.current.gatewayInvoiceId, params.dtoIn.gatewayInvoiceId);
        this.appendChange(oldValues, newValues, 'lastAttemptAt', params.current.lastAttemptAt, params.dtoIn.lastAttemptAt);
        this.appendChange(oldValues, newValues, 'attemptNumber', params.current.attemptNumber, params.dtoIn.attemptNumber);
        this.appendChange(oldValues, newValues, 'paidAt', params.current.paidAt, params.dtoIn.paidAt);
        this.appendChange(oldValues, newValues, 'status', params.current.status, params.dtoIn.status);
        return [...previous, changes];
    }
    appendChange(oldValues, newValues, field, oldValue, newValue) {
        if (newValue === null || newValue === undefined) {
            return;
        }
        if (oldValue === newValue) {
            return;
        }
        oldValues[field] = oldValue;
        newValues[field] = newValue;
    }
};
exports.UpdateSubscriptionInvoiceService = UpdateSubscriptionInvoiceService;
exports.UpdateSubscriptionInvoiceService = UpdateSubscriptionInvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscription_invoices_tokens_1.SUBSCRIPTION_INVOICES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdateSubscriptionInvoiceService);
//# sourceMappingURL=update-subscription-invoice.service.js.map