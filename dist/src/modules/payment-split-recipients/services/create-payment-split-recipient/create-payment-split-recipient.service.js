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
exports.CreatePaymentSplitRecipientService = void 0;
const common_1 = require("@nestjs/common");
const payment_split_recipient_entity_1 = require("../../entities/payment-split-recipient.entity");
const payment_split_recipients_tokens_1 = require("../../tokens/payment-split-recipients.tokens");
const create_payment_split_recipient_dto_out_1 = require("./dtos/create-payment-split-recipient.dto-out");
const find_split_recipient_by_unique_id_dto_in_1 = require("../../../split-recipients/services/find-split-recipient-by-unique-id/dtos/find-split-recipient-by-unique-id.dto-in");
const find_split_recipient_by_unique_id_service_1 = require("../../../split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service");
let CreatePaymentSplitRecipientService = class CreatePaymentSplitRecipientService {
    paymentSplitRecipientsRepository;
    findSplitRecipientByUniqueIdService;
    constructor(paymentSplitRecipientsRepository, findSplitRecipientByUniqueIdService) {
        this.paymentSplitRecipientsRepository = paymentSplitRecipientsRepository;
        this.findSplitRecipientByUniqueIdService = findSplitRecipientByUniqueIdService;
    }
    async exec(dtoIn) {
        const splitRecipient = await this.findSplitRecipientByUniqueIdService.exec(new find_split_recipient_by_unique_id_dto_in_1.FindSplitRecipientByUniqueIdDtoIn(dtoIn.splitRecipientId));
        const splitRecipientData = splitRecipient.splitRecipient;
        const resolvedGatewayRecipientId = this.toNullableString(dtoIn.gatewayRecipientId) ??
            this.toNullableString(splitRecipientData.gatewayRecipientId) ??
            this.toNullableString(splitRecipientData.gateway_recipient_id) ??
            this.extractStringFromObject(splitRecipientData.config, 'stripeAccountId') ??
            this.extractStringFromObject(splitRecipientData.config, 'stripe_account_id') ??
            this.extractStringFromObject(splitRecipientData.config, 'gatewayRecipientId') ??
            this.extractStringFromObject(splitRecipientData.config, 'gateway_recipient_id') ??
            this.extractStringFromObject(splitRecipientData.metadata, 'stripeAccountId') ??
            this.extractStringFromObject(splitRecipientData.metadata, 'stripe_account_id') ??
            this.extractStringFromObject(splitRecipientData.metadata, 'gatewayRecipientId') ??
            this.extractStringFromObject(splitRecipientData.metadata, 'gateway_recipient_id');
        const gatewayProvider = this.resolveGatewayProvider({
            config: dtoIn.config,
            gatewayRecipientId: resolvedGatewayRecipientId,
        });
        const entity = new payment_split_recipient_entity_1.PaymentSplitRecipientEntity(this.paymentSplitRecipientsRepository);
        entity.paymentSplitId = dtoIn.paymentSplitId;
        entity.splitRecipientId = dtoIn.splitRecipientId;
        entity.gatewayRecipientId = resolvedGatewayRecipientId;
        entity.gatewayTransferId = dtoIn.gatewayTransferId;
        entity.role = dtoIn.role;
        entity.amount = dtoIn.amount;
        entity.percentage = dtoIn.percentage;
        entity.currency = dtoIn.currency;
        entity.providerPayload = dtoIn.providerPayload;
        entity.providerResponse = dtoIn.providerResponse;
        entity.gatewayResponse = dtoIn.gatewayResponse;
        entity.metadata = {
            ...(dtoIn.metadata ?? {}),
            ...(resolvedGatewayRecipientId !== null
                ? {
                    gatewayRecipientId: resolvedGatewayRecipientId,
                    ...(gatewayProvider === 'stripe'
                        ? { stripeAccountId: resolvedGatewayRecipientId }
                        : gatewayProvider === 'pagseguro'
                            ? { pagseguroAccountId: resolvedGatewayRecipientId }
                            : {}),
                }
                : {}),
        };
        entity.config = {
            ...(dtoIn.config ?? {}),
            ...(resolvedGatewayRecipientId !== null
                ? {
                    gatewayRecipientId: resolvedGatewayRecipientId,
                    ...(gatewayProvider === 'stripe'
                        ? { stripeAccountId: resolvedGatewayRecipientId }
                        : gatewayProvider === 'pagseguro'
                            ? { pagseguroAccountId: resolvedGatewayRecipientId }
                            : {}),
                }
                : {}),
        };
        entity.changesHistory = [
            {
                source: 'CreatePaymentSplitRecipientService',
                action: 'created',
                createdAt: new Date().toISOString(),
            },
        ];
        entity.status = dtoIn.status ?? 'created';
        const created = await entity.create();
        return new create_payment_split_recipient_dto_out_1.CreatePaymentSplitRecipientDtoOut({
            id: created.id,
            _id: created._id,
            paymentSplitId: created.paymentSplitId,
            splitRecipientId: created.splitRecipientId,
            gatewayRecipientId: created.gatewayRecipientId,
            gatewayTransferId: created.gatewayTransferId,
            role: created.role,
            amount: created.amount,
            percentage: created.percentage,
            currency: created.currency,
            providerPayload: created.providerPayload,
            providerResponse: created.providerResponse,
            gatewayResponse: created.gatewayResponse,
            metadata: created.metadata,
            config: created.config,
            changesHistory: created.changesHistory,
            status: created.status,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    extractStringFromObject(value, key) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return this.toNullableString(value[key]);
    }
    resolveGatewayProvider(params) {
        if (params.gatewayRecipientId === null) {
            return null;
        }
        const gatewayAccounts = params.config?.gatewayAccounts;
        if (gatewayAccounts &&
            typeof gatewayAccounts === 'object' &&
            !Array.isArray(gatewayAccounts)) {
            for (const [provider, account] of Object.entries(gatewayAccounts)) {
                if (!account || typeof account !== 'object' || Array.isArray(account)) {
                    continue;
                }
                const accountId = this.toNullableString(account.accountId);
                if (accountId === params.gatewayRecipientId) {
                    return provider;
                }
            }
        }
        return params.gatewayRecipientId.startsWith('acct_') ? 'stripe' : null;
    }
};
exports.CreatePaymentSplitRecipientService = CreatePaymentSplitRecipientService;
exports.CreatePaymentSplitRecipientService = CreatePaymentSplitRecipientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_split_recipients_tokens_1.PAYMENT_SPLIT_RECIPIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, find_split_recipient_by_unique_id_service_1.FindSplitRecipientByUniqueIdService])
], CreatePaymentSplitRecipientService);
//# sourceMappingURL=create-payment-split-recipient.service.js.map