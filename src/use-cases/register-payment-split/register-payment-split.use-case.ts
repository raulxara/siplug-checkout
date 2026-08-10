import { Injectable } from '@nestjs/common';

import { CreatePaymentSplitRecipientDtoIn } from '../../modules/payment-split-recipients/services/create-payment-split-recipient/dtos/create-payment-split-recipient.dto-in';
import { CreatePaymentSplitRecipientService } from '../../modules/payment-split-recipients/services/create-payment-split-recipient/create-payment-split-recipient.service';
import { CreatePaymentSplitDtoIn } from '../../modules/payment-splits/services/create-payment-split/dtos/create-payment-split.dto-in';
import { CreatePaymentSplitService } from '../../modules/payment-splits/services/create-payment-split/create-payment-split.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { CalculatePaymentSplitDtoIn as CalculatePaymentSplitServiceDtoIn } from '../../modules/split-calculations/services/calculate-payment-split/dtos/calculate-payment-split.dto-in';
import { CalculatePaymentSplitService } from '../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service';

import { RegisterPaymentSplitDtoIn } from './dtos/register-payment-split.dto-in';
import { RegisterPaymentSplitDtoOut } from './dtos/register-payment-split.dto-out';

@Injectable()
export class RegisterPaymentSplitUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly calculatePaymentSplitService: CalculatePaymentSplitService,
    private readonly createPaymentSplitService: CreatePaymentSplitService,
    private readonly createPaymentSplitRecipientService: CreatePaymentSplitRecipientService,
  ) {}

  async exec(
    dtoIn: RegisterPaymentSplitDtoIn,
  ): Promise<RegisterPaymentSplitDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'paymentSplit',
      requiredAction: 'registerPaymentSplit',
    });

    const calculation = await this.calculatePaymentSplitService.exec(
      new CalculatePaymentSplitServiceDtoIn(
        dtoIn.splitRuleId,
        dtoIn.grossAmount,
        dtoIn.gatewayFeeAmount,
        dtoIn.netAmount,
        dtoIn.currency,
        dtoIn.metadata,
      ),
    );

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

    const paymentSplitDtoOut = await this.createPaymentSplitService.exec(
      new CreatePaymentSplitDtoIn(
        String(splitRule.officeId),
        String(splitRule.clientId),
        dtoIn.checkoutSessionId,
        dtoIn.paymentTransactionId,
        dtoIn.subscriptionId,
        dtoIn.subscriptionInvoiceId,
        dtoIn.splitRuleId,

        dtoIn.gatewayProvider,
        null,

        calculation.allocatedAmount,
        calculation.currency,

        null,
        null,
        null,
        dtoIn.metadata,
        paymentSplitConfig,

        'created',
      ),
    );

    const paymentSplitId = String(paymentSplitDtoOut.paymentSplit._id);

    const paymentSplitRecipients: Array<Record<string, unknown>> = [];

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

      const paymentSplitRecipientDtoOut =
        await this.createPaymentSplitRecipientService.exec(
          new CreatePaymentSplitRecipientDtoIn(
            paymentSplitId,
            recipient.splitRecipientId,

            null,
            null,

            recipient.role,
            recipient.amount,
            recipient.percentage,
            recipient.currency,

            null,
            null,
            null,
            recipientMetadata,
            recipientConfig,

            'created',
          ),
        );

      paymentSplitRecipients.push(
        paymentSplitRecipientDtoOut.paymentSplitRecipient,
      );
    }

    return new RegisterPaymentSplitDtoOut(
      paymentSplitDtoOut.paymentSplit,
      paymentSplitRecipients,
    );
  }

  private shouldRetainRecipientOnPlatform(params: {
    role: unknown;
    metadata: unknown;
    config: unknown;
  }): boolean {
    const metadata = this.toObject(params.metadata);
    const config = this.toObject(params.config);

    const explicitTransferToGateway =
      this.extractBoolean(config, 'transferToGateway') ??
      this.extractBoolean(config, 'transfer_to_gateway') ??
      this.extractBoolean(metadata, 'transferToGateway') ??
      this.extractBoolean(metadata, 'transfer_to_gateway');

    if (explicitTransferToGateway === true) {
      return false;
    }

    const explicitRetainOnPlatform =
      this.extractBoolean(config, 'retainOnPlatform') ??
      this.extractBoolean(config, 'retain_on_platform') ??
      this.extractBoolean(metadata, 'retainOnPlatform') ??
      this.extractBoolean(metadata, 'retain_on_platform');

    if (explicitRetainOnPlatform !== null) {
      return explicitRetainOnPlatform;
    }

    const role = String(params.role ?? '').trim().toLowerCase();

    return ['platform', 'commission', 'application_fee'].includes(role);
  }

  private toObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private extractBoolean(
    object: Record<string, unknown> | null,
    key: string,
  ): boolean | null {
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
}
