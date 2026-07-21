"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchStripeSplitTransferService = void 0;
const common_1 = require("@nestjs/common");
const gateway_split_transfer_dto_out_1 = require("../../../dtos/gateway-split-transfer.dto-out");
let DispatchStripeSplitTransferService = class DispatchStripeSplitTransferService {
    async exec(dtoIn) {
        if (!dtoIn.providerToken.startsWith('sk_')) {
            throw new Error('Stripe provider token must start with sk_');
        }
        if (!dtoIn.sourceTransactionId.startsWith('ch_')) {
            throw new Error('Stripe sourceTransactionId must start with ch_');
        }
        const transfers = [];
        const providerRequests = [];
        const providerResponses = [];
        for (const recipient of dtoIn.recipients) {
            const result = await this.createTransfer({
                dtoIn,
                recipient,
            });
            transfers.push(result.transfer);
            providerRequests.push(result.providerRequest);
            providerResponses.push(result.providerResponse);
        }
        const successTransfers = transfers.filter((transfer) => transfer.success === true);
        const failedTransfers = transfers.filter((transfer) => transfer.success !== true);
        const gatewaySplitId = successTransfers.length > 0
            ? String(successTransfers[0].gatewayTransferId ?? '')
            : null;
        const status = failedTransfers.length === 0
            ? 'transferred'
            : successTransfers.length > 0
                ? 'partially_transferred'
                : 'failed';
        return new gateway_split_transfer_dto_out_1.GatewaySplitTransferDtoOut(successTransfers.length > 0, 'stripe', status, gatewaySplitId && gatewaySplitId.trim() !== '' ? gatewaySplitId : null, transfers, {
            provider: 'stripe',
            endpoint: 'POST /v1/transfers',
            requests: providerRequests,
        }, {
            provider: 'stripe',
            transfers: providerResponses,
        }, {
            provider: 'stripe',
            status,
            successCount: successTransfers.length,
            failedCount: failedTransfers.length,
            transfers,
        }, failedTransfers.length > 0
            ? 'one or more Stripe split transfers failed'
            : null);
    }
    async createTransfer(params) {
        const { dtoIn, recipient } = params;
        const idempotencyKey = [
            dtoIn.idempotencyKey,
            recipient.paymentSplitRecipientId,
        ].join(':');
        const body = new URLSearchParams();
        body.set('amount', String(recipient.amount));
        body.set('currency', recipient.currency.toLowerCase());
        body.set('destination', recipient.destinationAccountId);
        body.set('source_transaction', dtoIn.sourceTransactionId);
        body.set('transfer_group', dtoIn.paymentSplitId);
        const metadata = {
            paymentSplitId: dtoIn.paymentSplitId,
            paymentSplitRecipientId: recipient.paymentSplitRecipientId,
            paymentTransactionId: dtoIn.paymentTransactionId,
            paymentWebhookEventId: dtoIn.paymentWebhookEventId,
            splitRecipientId: recipient.splitRecipientId,
            role: recipient.role,
            source: 'DispatchStripeSplitTransferService',
        };
        for (const [key, value] of Object.entries(metadata)) {
            if (value === undefined || value === null) {
                continue;
            }
            body.set(`metadata[${key}]`, String(value));
        }
        const providerRequest = {
            amount: recipient.amount,
            currency: recipient.currency.toLowerCase(),
            destination: recipient.destinationAccountId,
            sourceTransaction: dtoIn.sourceTransactionId,
            transferGroup: dtoIn.paymentSplitId,
            idempotencyKey,
            metadata,
        };
        const response = await fetch('https://api.stripe.com/v1/transfers', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${dtoIn.providerToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Idempotency-Key': idempotencyKey,
            },
            body,
        });
        const responseText = await response.text();
        const responseBody = this.parseJson(responseText);
        const gatewayTransferId = this.extractString(responseBody, 'id');
        const providerResponse = {
            statusCode: response.status,
            ok: response.ok,
            body: responseBody,
        };
        if (!response.ok) {
            return {
                transfer: {
                    success: false,
                    paymentSplitRecipientId: recipient.paymentSplitRecipientId,
                    splitRecipientId: recipient.splitRecipientId,
                    gatewayTransferId,
                    destinationAccountId: recipient.destinationAccountId,
                    amount: recipient.amount,
                    currency: recipient.currency,
                    statusCode: response.status,
                    response: responseBody,
                },
                providerRequest,
                providerResponse,
            };
        }
        return {
            transfer: {
                success: true,
                paymentSplitRecipientId: recipient.paymentSplitRecipientId,
                splitRecipientId: recipient.splitRecipientId,
                gatewayTransferId,
                destinationAccountId: recipient.destinationAccountId,
                amount: recipient.amount,
                currency: recipient.currency,
                statusCode: response.status,
                response: responseBody,
            },
            providerRequest,
            providerResponse,
        };
    }
    parseJson(value) {
        try {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                return null;
            }
            return parsed;
        }
        catch {
            return null;
        }
    }
    extractString(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
};
exports.DispatchStripeSplitTransferService = DispatchStripeSplitTransferService;
exports.DispatchStripeSplitTransferService = DispatchStripeSplitTransferService = __decorate([
    (0, common_1.Injectable)()
], DispatchStripeSplitTransferService);
//# sourceMappingURL=dispatch-stripe-split-transfer.service.js.map