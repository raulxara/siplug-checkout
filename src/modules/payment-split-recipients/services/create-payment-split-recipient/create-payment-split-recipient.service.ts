import { Inject, Injectable } from '@nestjs/common';

import { PaymentSplitRecipientEntity } from '../../entities/payment-split-recipient.entity';
import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { PAYMENT_SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/payment-split-recipients.tokens';
import { CreatePaymentSplitRecipientDtoIn } from './dtos/create-payment-split-recipient.dto-in';
import { CreatePaymentSplitRecipientDtoOut } from './dtos/create-payment-split-recipient.dto-out';

import { FindSplitRecipientByUniqueIdDtoIn } from '../../../split-recipients/services/find-split-recipient-by-unique-id/dtos/find-split-recipient-by-unique-id.dto-in';
import { FindSplitRecipientByUniqueIdService } from '../../../split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';

@Injectable()
export class CreatePaymentSplitRecipientService {
  constructor(
    @Inject(PAYMENT_SPLIT_RECIPIENTS_REPOSITORY)
    private readonly paymentSplitRecipientsRepository: IPaymentSplitRecipientsRepository,

    private readonly findSplitRecipientByUniqueIdService: FindSplitRecipientByUniqueIdService,
  ) {}

  async exec(
    dtoIn: CreatePaymentSplitRecipientDtoIn,
  ): Promise<CreatePaymentSplitRecipientDtoOut> {
    const splitRecipient =
      await this.findSplitRecipientByUniqueIdService.exec(
        new FindSplitRecipientByUniqueIdDtoIn(dtoIn.splitRecipientId),
      );

    const splitRecipientData = splitRecipient.splitRecipient as Record<
      string,
      unknown
    >;

    const resolvedGatewayRecipientId =
      this.toNullableString(dtoIn.gatewayRecipientId) ??
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

    const entity = new PaymentSplitRecipientEntity(
      this.paymentSplitRecipientsRepository,
    );

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
            stripeAccountId: resolvedGatewayRecipientId,
          }
        : {}),
    };

    entity.config = {
      ...(dtoIn.config ?? {}),
      ...(resolvedGatewayRecipientId !== null
        ? {
            gatewayRecipientId: resolvedGatewayRecipientId,
            stripeAccountId: resolvedGatewayRecipientId,
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

    return new CreatePaymentSplitRecipientDtoOut({
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

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private extractStringFromObject(value: unknown, key: string): string | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return this.toNullableString((value as Record<string, unknown>)[key]);
  }
}
