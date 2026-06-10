import { Inject, Injectable } from '@nestjs/common';

import { PaymentSplitRecipientEntity } from '../../entities/payment-split-recipient.entity';
import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { PAYMENT_SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/payment-split-recipients.tokens';
import { CreatePaymentSplitRecipientDtoIn } from './dtos/create-payment-split-recipient.dto-in';
import { CreatePaymentSplitRecipientDtoOut } from './dtos/create-payment-split-recipient.dto-out';

@Injectable()
export class CreatePaymentSplitRecipientService {
  constructor(
    @Inject(PAYMENT_SPLIT_RECIPIENTS_REPOSITORY)
    private readonly paymentSplitRecipientsRepository: IPaymentSplitRecipientsRepository,
  ) {}

  async exec(
    dtoIn: CreatePaymentSplitRecipientDtoIn,
  ): Promise<CreatePaymentSplitRecipientDtoOut> {
    const entity = new PaymentSplitRecipientEntity(
      this.paymentSplitRecipientsRepository,
    );

    entity.paymentSplitId = dtoIn.paymentSplitId;
    entity.splitRecipientId = dtoIn.splitRecipientId;

    entity.gatewayRecipientId = dtoIn.gatewayRecipientId;
    entity.gatewayTransferId = dtoIn.gatewayTransferId;

    entity.role = dtoIn.role;
    entity.amount = dtoIn.amount;
    entity.percentage = dtoIn.percentage;
    entity.currency = dtoIn.currency;

    entity.providerPayload = dtoIn.providerPayload;
    entity.providerResponse = dtoIn.providerResponse;
    entity.gatewayResponse = dtoIn.gatewayResponse;
    entity.metadata = dtoIn.metadata;
    entity.config = dtoIn.config;

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
}
