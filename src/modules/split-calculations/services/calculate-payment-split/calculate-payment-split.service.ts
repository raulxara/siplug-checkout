import { Injectable } from '@nestjs/common';

import { GetAllSplitRuleRecipientsBySplitRuleIdDtoIn } from '../../../split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/dtos/get-all-split-rule-recipients-by-split-rule-id.dto-in';
import { GetAllSplitRuleRecipientsBySplitRuleIdService } from '../../../split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/get-all-split-rule-recipients-by-split-rule-id.service';
import { FindSplitRuleByUniqueIdDtoIn } from '../../../split-rules/services/find-split-rule-by-unique-id/dtos/find-split-rule-by-unique-id.dto-in';
import { FindSplitRuleByUniqueIdService } from '../../../split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';
import { CalculatePaymentSplitDtoIn } from './dtos/calculate-payment-split.dto-in';
import {
  CalculatedPaymentSplitRecipientDtoOut,
  CalculatePaymentSplitDtoOut,
} from './dtos/calculate-payment-split.dto-out';

@Injectable()
export class CalculatePaymentSplitService {
  constructor(
    private readonly findSplitRuleByUniqueIdService: FindSplitRuleByUniqueIdService,
    private readonly getAllSplitRuleRecipientsBySplitRuleIdService: GetAllSplitRuleRecipientsBySplitRuleIdService,
  ) {}

  async exec(
    dtoIn: CalculatePaymentSplitDtoIn,
  ): Promise<CalculatePaymentSplitDtoOut> {
    this.validateAmount(dtoIn.grossAmount, 'grossAmount');

    const splitRuleDtoOut = await this.findSplitRuleByUniqueIdService.exec(
      new FindSplitRuleByUniqueIdDtoIn(dtoIn.splitRuleId),
    );

    const splitRule = splitRuleDtoOut.splitRule;

    if (String(splitRule.status ?? '') !== 'active') {
      throw new Error('split rule is not active');
    }

    const splitRuleRecipientsDtoOut =
      await this.getAllSplitRuleRecipientsBySplitRuleIdService.exec(
        new GetAllSplitRuleRecipientsBySplitRuleIdDtoIn(dtoIn.splitRuleId),
      );

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

    const calculationBase = String(
      splitRule.calculationBase ?? 'gross_amount',
    ).trim();

    const gatewayFeeAmount = dtoIn.gatewayFeeAmount ?? 0;

    this.validateAmount(gatewayFeeAmount, 'gatewayFeeAmount');

    const netAmount =
      dtoIn.netAmount === null
        ? dtoIn.grossAmount - gatewayFeeAmount
        : dtoIn.netAmount;

    this.validateAmount(netAmount, 'netAmount');

    const baseAmount = this.resolveBaseAmount({
      calculationBase,
      grossAmount: dtoIn.grossAmount,
      netAmount,
    });

    const calculatedRecipients = this.calculateRecipients({
      recipients: activeRecipients,
      baseAmount,
      currency: dtoIn.currency,
    });

    const allocatedAmount = calculatedRecipients.reduce(
      (total, recipient) => total + recipient.amount,
      0,
    );

    if (allocatedAmount > baseAmount) {
      throw new Error('allocated split amount cannot be greater than baseAmount');
    }

    const unallocatedAmount = baseAmount - allocatedAmount;

    return new CalculatePaymentSplitDtoOut(
      splitRule,
      calculationBase,
      dtoIn.grossAmount,
      gatewayFeeAmount,
      netAmount,
      baseAmount,
      allocatedAmount,
      unallocatedAmount,
      dtoIn.currency,
      calculatedRecipients,
      dtoIn.metadata,
    );
  }

  private resolveBaseAmount(params: {
    calculationBase: string;
    grossAmount: number;
    netAmount: number;
  }): number {
    if (params.calculationBase === 'gross_amount') {
      return params.grossAmount;
    }

    if (params.calculationBase === 'net_amount') {
      return params.netAmount;
    }

    throw new Error(`unsupported calculationBase: ${params.calculationBase}`);
  }

  private calculateRecipients(params: {
    recipients: Array<Record<string, unknown>>;
    baseAmount: number;
    currency: string;
  }): CalculatedPaymentSplitRecipientDtoOut[] {
    const calculatedRecipients: CalculatedPaymentSplitRecipientDtoOut[] = [];

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

      calculatedRecipients.push({
        splitRuleRecipientId: String(recipient._id),
        splitRecipientId: String(recipient.splitRecipientId),

        role: String(recipient.role ?? 'secondary'),
        percentage,
        fixedAmount,

        amount,
        currency: params.currency,

        liableForGatewayFee: this.toBoolean(
          recipient.liableForGatewayFee,
          false,
        ),
        liableForRefund: this.toBoolean(recipient.liableForRefund, false),
        priority: this.toNumber(recipient.priority, 0),

        metadata: this.toNullableObject(recipient.metadata),
        config: this.toNullableObject(recipient.config),
      });
    }

    this.applyRoundingResidueWhenNeeded({
      baseAmount: params.baseAmount,
      percentageTotal,
      fixedAmountTotal,
      recipients: calculatedRecipients,
    });

    const allocatedAmount = calculatedRecipients.reduce(
      (total, recipient) => total + recipient.amount,
      0,
    );

    if (allocatedAmount > params.baseAmount) {
      throw new Error('allocated split amount cannot be greater than baseAmount');
    }

    return calculatedRecipients;
  }

  private calculatePercentageAmount(
    baseAmount: number,
    percentage: number,
  ): number {
    const basisPoints = Math.round(percentage * 100);

    return Math.floor((baseAmount * basisPoints) / 10000);
  }

  private applyRoundingResidueWhenNeeded(params: {
    baseAmount: number;
    percentageTotal: number;
    fixedAmountTotal: number;
    recipients: CalculatedPaymentSplitRecipientDtoOut[];
  }): void {
    if (params.fixedAmountTotal !== 0) {
      return;
    }

    if (Math.round(params.percentageTotal * 100) !== 10000) {
      return;
    }

    const allocatedAmount = params.recipients.reduce(
      (total, recipient) => total + recipient.amount,
      0,
    );

    const residue = params.baseAmount - allocatedAmount;

    if (residue <= 0) {
      return;
    }

    const recipientToReceiveResidue = params.recipients.find(
      (recipient) => recipient.percentage !== null,
    );

    if (!recipientToReceiveResidue) {
      return;
    }

    recipientToReceiveResidue.amount += residue;
  }

  private validateAmount(value: number, field: string): void {
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

  private toNullableNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      throw new Error(`invalid number value: ${String(value)}`);
    }

    return numberValue;
  }

  private toNumber(value: unknown, fallback: number): number {
    const nullable = this.toNullableNumber(value);

    return nullable === null ? fallback : nullable;
  }

  private toBoolean(value: unknown, fallback: boolean): boolean {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    const normalized = String(value).toLowerCase().trim();

    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  private toNullableObject(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }
}
