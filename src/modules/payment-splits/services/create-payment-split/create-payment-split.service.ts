import { Inject, Injectable } from '@nestjs/common';

import { PaymentSplitEntity } from '../../entities/payment-split.entity';
import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { PAYMENT_SPLITS_REPOSITORY } from '../../tokens/payment-splits.tokens';
import { CreatePaymentSplitDtoIn } from './dtos/create-payment-split.dto-in';
import { CreatePaymentSplitDtoOut } from './dtos/create-payment-split.dto-out';

@Injectable()
export class CreatePaymentSplitService {
  constructor(
    @Inject(PAYMENT_SPLITS_REPOSITORY)
    private readonly paymentSplitsRepository: IPaymentSplitsRepository,
  ) {}

  async exec(dtoIn: CreatePaymentSplitDtoIn): Promise<CreatePaymentSplitDtoOut> {
    const entity = new PaymentSplitEntity(this.paymentSplitsRepository);

    entity.officeId = dtoIn.officeId;
    entity.clientId = dtoIn.clientId;
    entity.checkoutSessionId = dtoIn.checkoutSessionId;
    entity.paymentTransactionId = dtoIn.paymentTransactionId;
    entity.subscriptionId = dtoIn.subscriptionId;
    entity.subscriptionInvoiceId = dtoIn.subscriptionInvoiceId;
    entity.splitRuleId = dtoIn.splitRuleId;

    entity.gatewayProvider = dtoIn.gatewayProvider;
    entity.gatewaySplitId = dtoIn.gatewaySplitId;

    entity.amount = dtoIn.amount;
    entity.currency = dtoIn.currency;

    entity.providerPayload = dtoIn.providerPayload;
    entity.providerResponse = dtoIn.providerResponse;
    entity.gatewayResponse = dtoIn.gatewayResponse;
    entity.metadata = dtoIn.metadata;
    entity.config = dtoIn.config;

    entity.changesHistory = [
      {
        source: 'CreatePaymentSplitService',
        action: 'created',
        createdAt: new Date().toISOString(),
      },
    ];

    entity.status = dtoIn.status ?? 'created';

    const created = await entity.create();

    return new CreatePaymentSplitDtoOut({
      id: created.id,
      _id: created._id,

      officeId: created.officeId,
      clientId: created.clientId,
      checkoutSessionId: created.checkoutSessionId,
      paymentTransactionId: created.paymentTransactionId,
      subscriptionId: created.subscriptionId,
      subscriptionInvoiceId: created.subscriptionInvoiceId,
      splitRuleId: created.splitRuleId,

      gatewayProvider: created.gatewayProvider,
      gatewaySplitId: created.gatewaySplitId,

      amount: created.amount,
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
