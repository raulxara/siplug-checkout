import { Inject, Injectable } from '@nestjs/common';

import { PaymentWebhookEventEntity } from '../../entities/payment-webhook-event.entity';
import type { IPaymentWebhookEventsRepository } from '../../entities/payment-webhook-events-repository.interface';
import { PAYMENT_WEBHOOK_EVENTS_REPOSITORY } from '../../tokens/payment-webhook-events.tokens';
import { RegisterPaymentWebhookEventDtoIn } from './dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventDtoOut } from './dtos/register-payment-webhook-event.dto-out';

@Injectable()
export class RegisterPaymentWebhookEventService {
  constructor(
    @Inject(PAYMENT_WEBHOOK_EVENTS_REPOSITORY)
    private readonly repository: IPaymentWebhookEventsRepository,
  ) {}

  async exec(
    dtoIn: RegisterPaymentWebhookEventDtoIn,
  ): Promise<RegisterPaymentWebhookEventDtoOut> {
    const current = await this.repository.findByProviderAndEventId({
      provider: dtoIn.provider,
      eventId: dtoIn.eventId,
    });

    if (current !== null) {
      return new RegisterPaymentWebhookEventDtoOut(
        current as unknown as Record<string, unknown>,
        true,
      );
    }

    const entity = new PaymentWebhookEventEntity(this.repository, {
      provider: dtoIn.provider,
      eventId: dtoIn.eventId,
      eventType: dtoIn.eventType,
      eventAction: dtoIn.eventAction,
      canonicalStatus: dtoIn.canonicalStatus,

      gatewayTransactionId: dtoIn.gatewayTransactionId,
      gatewayPaymentIntentId: dtoIn.gatewayPaymentIntentId,
      gatewayChargeId: dtoIn.gatewayChargeId,
      gatewaySubscriptionId: dtoIn.gatewaySubscriptionId,
      gatewayInvoiceId: dtoIn.gatewayInvoiceId,

      paymentTransactionId: dtoIn.paymentTransactionId,
      checkoutSessionId: dtoIn.checkoutSessionId,
      subscriptionId: dtoIn.subscriptionId,
      subscriptionInvoiceId: dtoIn.subscriptionInvoiceId,
      externalReference: dtoIn.externalReference,

      amount: dtoIn.amount,
      currency: dtoIn.currency,

      headers: dtoIn.headers,
      payload: dtoIn.payload,
      normalizedPayload: dtoIn.normalizedPayload,
      processingResult: null,

      errorMessage: null,

      receivedAt: new Date().toISOString(),
      processedAt: null,

      metadata: dtoIn.metadata,
      config: dtoIn.config,
      changesHistory: [
        {
          action: 'created',
          source: 'RegisterPaymentWebhookEventService',
          createdAt: new Date().toISOString(),
        },
      ],

      status: 'received',
    });

    const created = await entity.create();

    return new RegisterPaymentWebhookEventDtoOut(
      created as unknown as Record<string, unknown>,
      false,
    );
  }
}
