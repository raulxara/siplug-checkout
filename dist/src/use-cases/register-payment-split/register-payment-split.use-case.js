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
exports.RegisterPaymentSplitUseCase = void 0;
const common_1 = require("@nestjs/common");
const create_payment_split_recipient_dto_in_1 = require("../../modules/payment-split-recipients/services/create-payment-split-recipient/dtos/create-payment-split-recipient.dto-in");
const create_payment_split_recipient_service_1 = require("../../modules/payment-split-recipients/services/create-payment-split-recipient/create-payment-split-recipient.service");
const create_payment_split_dto_in_1 = require("../../modules/payment-splits/services/create-payment-split/dtos/create-payment-split.dto-in");
const create_payment_split_service_1 = require("../../modules/payment-splits/services/create-payment-split/create-payment-split.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const calculate_payment_split_dto_in_1 = require("../../modules/split-calculations/services/calculate-payment-split/dtos/calculate-payment-split.dto-in");
const calculate_payment_split_service_1 = require("../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service");
const register_payment_split_dto_out_1 = require("./dtos/register-payment-split.dto-out");
let RegisterPaymentSplitUseCase = class RegisterPaymentSplitUseCase {
    resolveActorAuthorizationService;
    calculatePaymentSplitService;
    createPaymentSplitService;
    createPaymentSplitRecipientService;
    constructor(resolveActorAuthorizationService, calculatePaymentSplitService, createPaymentSplitService, createPaymentSplitRecipientService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.calculatePaymentSplitService = calculatePaymentSplitService;
        this.createPaymentSplitService = createPaymentSplitService;
        this.createPaymentSplitRecipientService = createPaymentSplitRecipientService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'paymentSplit',
            requiredAction: 'registerPaymentSplit',
        });
        const calculation = await this.calculatePaymentSplitService.exec(new calculate_payment_split_dto_in_1.CalculatePaymentSplitDtoIn(dtoIn.splitRuleId, dtoIn.grossAmount, dtoIn.gatewayFeeAmount, dtoIn.netAmount, dtoIn.currency, dtoIn.metadata));
        const splitRule = calculation.splitRule;
        const paymentSplitConfig = {
            ...(dtoIn.config ?? {}),
            calculationSnapshot: {
                calculationBase: calculation.calculationBase,
                grossAmount: calculation.grossAmount,
                gatewayFeeAmount: calculation.gatewayFeeAmount,
                netAmount: calculation.netAmount,
                baseAmount: calculation.baseAmount,
                allocatedAmount: calculation.allocatedAmount,
                unallocatedAmount: calculation.unallocatedAmount,
                currency: calculation.currency,
            },
        };
        const paymentSplitDtoOut = await this.createPaymentSplitService.exec(new create_payment_split_dto_in_1.CreatePaymentSplitDtoIn(String(splitRule.officeId), String(splitRule.clientId), dtoIn.checkoutSessionId, dtoIn.paymentTransactionId, dtoIn.subscriptionId, dtoIn.subscriptionInvoiceId, dtoIn.splitRuleId, dtoIn.gatewayProvider, null, calculation.allocatedAmount, calculation.currency, null, null, null, dtoIn.metadata, paymentSplitConfig, 'created'));
        const paymentSplitId = String(paymentSplitDtoOut.paymentSplit._id);
        const paymentSplitRecipients = [];
        for (const recipient of calculation.recipients) {
            const retainOnPlatform = this.shouldRetainRecipientOnPlatform({
                role: recipient.role,
                metadata: recipient.metadata,
                config: recipient.config,
            });
            const recipientMetadata = {
                ...(recipient.metadata ?? {}),
                ...(retainOnPlatform
                    ? {
                        retainOnPlatform: true,
                        gatewayTransferMode: 'retained_on_platform',
                    }
                    : {
                        retainOnPlatform: false,
                        gatewayTransferMode: 'gateway_transfer',
                    }),
            };
            const recipientConfig = {
                ...(recipient.config ?? {}),
                splitRuleRecipientId: recipient.splitRuleRecipientId,
                fixedAmount: recipient.fixedAmount,
                liableForGatewayFee: recipient.liableForGatewayFee,
                liableForRefund: recipient.liableForRefund,
                priority: recipient.priority,
                retainOnPlatform,
                transferToGateway: !retainOnPlatform,
                gatewayTransferMode: retainOnPlatform
                    ? 'retained_on_platform'
                    : 'gateway_transfer',
            };
            const paymentSplitRecipientDtoOut = await this.createPaymentSplitRecipientService.exec(new create_payment_split_recipient_dto_in_1.CreatePaymentSplitRecipientDtoIn(paymentSplitId, recipient.splitRecipientId, null, null, recipient.role, recipient.amount, recipient.percentage, recipient.currency, null, null, null, recipientMetadata, recipientConfig, 'created'));
            paymentSplitRecipients.push(paymentSplitRecipientDtoOut.paymentSplitRecipient);
        }
        return new register_payment_split_dto_out_1.RegisterPaymentSplitDtoOut(paymentSplitDtoOut.paymentSplit, paymentSplitRecipients);
    }
    shouldRetainRecipientOnPlatform(params) {
        const metadata = this.toObject(params.metadata);
        const config = this.toObject(params.config);
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
        const role = String(params.role ?? '').trim().toLowerCase();
        return ['platform', 'commission', 'application_fee'].includes(role);
    }
    toObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
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
};
exports.RegisterPaymentSplitUseCase = RegisterPaymentSplitUseCase;
exports.RegisterPaymentSplitUseCase = RegisterPaymentSplitUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        calculate_payment_split_service_1.CalculatePaymentSplitService,
        create_payment_split_service_1.CreatePaymentSplitService,
        create_payment_split_recipient_service_1.CreatePaymentSplitRecipientService])
], RegisterPaymentSplitUseCase);
//# sourceMappingURL=register-payment-split.use-case.js.map