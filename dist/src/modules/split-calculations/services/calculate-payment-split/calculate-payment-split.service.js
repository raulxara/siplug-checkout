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
exports.CalculatePaymentSplitService = void 0;
const common_1 = require("@nestjs/common");
const get_all_split_rule_recipients_by_split_rule_id_dto_in_1 = require("../../../split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/dtos/get-all-split-rule-recipients-by-split-rule-id.dto-in");
const get_all_split_rule_recipients_by_split_rule_id_service_1 = require("../../../split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/get-all-split-rule-recipients-by-split-rule-id.service");
const find_split_rule_by_unique_id_dto_in_1 = require("../../../split-rules/services/find-split-rule-by-unique-id/dtos/find-split-rule-by-unique-id.dto-in");
const find_split_rule_by_unique_id_service_1 = require("../../../split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service");
const find_split_recipient_by_unique_id_dto_in_1 = require("../../../split-recipients/services/find-split-recipient-by-unique-id/dtos/find-split-recipient-by-unique-id.dto-in");
const find_split_recipient_by_unique_id_service_1 = require("../../../split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service");
const calculate_payment_split_dto_out_1 = require("./dtos/calculate-payment-split.dto-out");
let CalculatePaymentSplitService = class CalculatePaymentSplitService {
    findSplitRuleByUniqueIdService;
    getAllSplitRuleRecipientsBySplitRuleIdService;
    findSplitRecipientByUniqueIdService;
    constructor(findSplitRuleByUniqueIdService, getAllSplitRuleRecipientsBySplitRuleIdService, findSplitRecipientByUniqueIdService) {
        this.findSplitRuleByUniqueIdService = findSplitRuleByUniqueIdService;
        this.getAllSplitRuleRecipientsBySplitRuleIdService = getAllSplitRuleRecipientsBySplitRuleIdService;
        this.findSplitRecipientByUniqueIdService = findSplitRecipientByUniqueIdService;
    }
    async exec(dtoIn) {
        this.validateAmount(dtoIn.grossAmount, 'grossAmount');
        const splitRuleDtoOut = await this.findSplitRuleByUniqueIdService.exec(new find_split_rule_by_unique_id_dto_in_1.FindSplitRuleByUniqueIdDtoIn(dtoIn.splitRuleId));
        const splitRule = splitRuleDtoOut.splitRule;
        if (String(splitRule.status ?? '') !== 'active') {
            throw new Error('split rule is not active');
        }
        const splitRuleRecipientsDtoOut = await this.getAllSplitRuleRecipientsBySplitRuleIdService.exec(new get_all_split_rule_recipients_by_split_rule_id_dto_in_1.GetAllSplitRuleRecipientsBySplitRuleIdDtoIn(dtoIn.splitRuleId));
        const activeRecipients = splitRuleRecipientsDtoOut.splitRuleRecipients
            .filter((recipient) => String(recipient.status ?? '') === 'active')
            .sort((a, b) => {
            const priorityA = this.toNumber(a.priority, 0);
            const priorityB = this.toNumber(b.priority, 0);
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            return this.toNumber(a.id, 0) - this.toNumber(b.id, 0);
        });
        if (activeRecipients.length === 0) {
            throw new Error('split rule has no active recipients');
        }
        const calculationBase = String(splitRule.calculationBase ?? 'gross_amount').trim();
        const gatewayFeeAmount = dtoIn.gatewayFeeAmount ?? 0;
        this.validateAmount(gatewayFeeAmount, 'gatewayFeeAmount');
        const netAmount = dtoIn.netAmount === null
            ? dtoIn.grossAmount - gatewayFeeAmount
            : dtoIn.netAmount;
        this.validateAmount(netAmount, 'netAmount');
        const baseAmount = this.resolveBaseAmount({
            calculationBase,
            grossAmount: dtoIn.grossAmount,
            netAmount,
        });
        const calculatedRecipients = await this.calculateRecipients({
            recipients: activeRecipients,
            baseAmount,
            currency: dtoIn.currency,
        });
        const allocatedAmount = calculatedRecipients.reduce((total, recipient) => total + recipient.amount, 0);
        if (allocatedAmount > baseAmount) {
            throw new Error('allocated split amount cannot be greater than baseAmount');
        }
        const unallocatedAmount = baseAmount - allocatedAmount;
        return new calculate_payment_split_dto_out_1.CalculatePaymentSplitDtoOut(splitRule, calculationBase, dtoIn.grossAmount, gatewayFeeAmount, netAmount, baseAmount, allocatedAmount, unallocatedAmount, dtoIn.currency, calculatedRecipients, dtoIn.metadata);
    }
    resolveBaseAmount(params) {
        if (params.calculationBase === 'gross_amount') {
            return params.grossAmount;
        }
        if (params.calculationBase === 'net_amount') {
            return params.netAmount;
        }
        throw new Error(`unsupported calculationBase: ${params.calculationBase}`);
    }
    async calculateRecipients(params) {
        const calculatedRecipients = [];
        let percentageTotal = 0;
        let fixedAmountTotal = 0;
        for (const recipient of params.recipients) {
            const percentage = this.toNullableNumber(recipient.percentage);
            const fixedAmount = this.toNullableNumber(recipient.fixedAmount);
            if (percentage !== null) {
                percentageTotal += percentage;
            }
            if (fixedAmount !== null) {
                fixedAmountTotal += fixedAmount;
            }
        }
        if (percentageTotal > 100) {
            throw new Error('percentage total cannot be greater than 100');
        }
        if (fixedAmountTotal > params.baseAmount) {
            throw new Error('fixed amount total cannot be greater than baseAmount');
        }
        for (const recipient of params.recipients) {
            const percentage = this.toNullableNumber(recipient.percentage);
            const fixedAmount = this.toNullableNumber(recipient.fixedAmount);
            let amount = 0;
            if (fixedAmount !== null) {
                amount += fixedAmount;
            }
            if (percentage !== null) {
                amount += this.calculatePercentageAmount(params.baseAmount, percentage);
            }
            const splitRecipientDtoOut = await this.findSplitRecipientByUniqueIdService.exec(new find_split_recipient_by_unique_id_dto_in_1.FindSplitRecipientByUniqueIdDtoIn(String(recipient.splitRecipientId)));
            const splitRecipient = splitRecipientDtoOut.splitRecipient;
            const splitRecipientConfig = this.toNullableObject(splitRecipient.config);
            const ruleRecipientConfig = this.toNullableObject(recipient.config);
            calculatedRecipients.push({
                splitRuleRecipientId: String(recipient._id),
                splitRecipientId: String(recipient.splitRecipientId),
                role: String(recipient.role ?? 'secondary'),
                percentage,
                fixedAmount,
                amount,
                currency: params.currency,
                liableForGatewayFee: this.toBoolean(recipient.liableForGatewayFee, false),
                liableForRefund: this.toBoolean(recipient.liableForRefund, false),
                priority: this.toNumber(recipient.priority, 0),
                metadata: this.toNullableObject(recipient.metadata),
                config: {
                    ...(splitRecipientConfig ?? {}),
                    ...(ruleRecipientConfig ?? {}),
                    gatewayAccounts: {
                        ...(this.toNullableObject(splitRecipientConfig?.gatewayAccounts) ??
                            {}),
                        ...(this.toNullableObject(ruleRecipientConfig?.gatewayAccounts) ??
                            {}),
                    },
                },
            });
        }
        this.applyRoundingResidueWhenNeeded({
            baseAmount: params.baseAmount,
            percentageTotal,
            fixedAmountTotal,
            recipients: calculatedRecipients,
        });
        const allocatedAmount = calculatedRecipients.reduce((total, recipient) => total + recipient.amount, 0);
        if (allocatedAmount > params.baseAmount) {
            throw new Error('allocated split amount cannot be greater than baseAmount');
        }
        return calculatedRecipients;
    }
    calculatePercentageAmount(baseAmount, percentage) {
        const basisPoints = Math.round(percentage * 100);
        return Math.floor((baseAmount * basisPoints) / 10000);
    }
    applyRoundingResidueWhenNeeded(params) {
        if (params.fixedAmountTotal !== 0) {
            return;
        }
        if (Math.round(params.percentageTotal * 100) !== 10000) {
            return;
        }
        const allocatedAmount = params.recipients.reduce((total, recipient) => total + recipient.amount, 0);
        const residue = params.baseAmount - allocatedAmount;
        if (residue <= 0) {
            return;
        }
        const recipientToReceiveResidue = params.recipients.find((recipient) => recipient.percentage !== null);
        if (!recipientToReceiveResidue) {
            return;
        }
        recipientToReceiveResidue.amount += residue;
    }
    validateAmount(value, field) {
        if (!Number.isFinite(value)) {
            throw new Error(`${field} must be a valid number`);
        }
        if (!Number.isInteger(value)) {
            throw new Error(`${field} must be an integer amount in cents`);
        }
        if (value < 0) {
            throw new Error(`${field} cannot be negative`);
        }
    }
    toNullableNumber(value) {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue)) {
            throw new Error(`invalid number value: ${String(value)}`);
        }
        return numberValue;
    }
    toNumber(value, fallback) {
        const nullable = this.toNullableNumber(value);
        return nullable === null ? fallback : nullable;
    }
    toBoolean(value, fallback) {
        if (value === undefined || value === null || value === '') {
            return fallback;
        }
        if (typeof value === 'boolean') {
            return value;
        }
        const normalized = String(value).toLowerCase().trim();
        return normalized === 'true' || normalized === '1' || normalized === 'yes';
    }
    toNullableObject(value) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
};
exports.CalculatePaymentSplitService = CalculatePaymentSplitService;
exports.CalculatePaymentSplitService = CalculatePaymentSplitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_split_rule_by_unique_id_service_1.FindSplitRuleByUniqueIdService,
        get_all_split_rule_recipients_by_split_rule_id_service_1.GetAllSplitRuleRecipientsBySplitRuleIdService,
        find_split_recipient_by_unique_id_service_1.FindSplitRecipientByUniqueIdService])
], CalculatePaymentSplitService);
//# sourceMappingURL=calculate-payment-split.service.js.map