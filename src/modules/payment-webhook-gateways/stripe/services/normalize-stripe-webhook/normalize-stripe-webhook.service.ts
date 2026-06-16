import { Injectable } from '@nestjs/common';

import {
  NormalizedPaymentWebhookEventDto,
  type PaymentWebhookCanonicalStatus,
} from '../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { NormalizeStripeWebhookDtoIn } from './dtos/normalize-stripe-webhook.dto-in';
import { NormalizeStripeWebhookDtoOut } from './dtos/normalize-stripe-webhook.dto-out';

@Injectable()
export class NormalizeStripeWebhookService {
  exec(dtoIn: NormalizeStripeWebhookDtoIn): NormalizeStripeWebhookDtoOut {
    const eventId = this.getString(dtoIn.payload, 'id');

    if (eventId === null) {
      throw new Error('Stripe event id is required');
    }

    const eventType = this.getString(dtoIn.payload, 'type');
    const data = this.getObject(dtoIn.payload, 'data');
    const object = data ? this.getObject(data, 'object') : null;

    if (eventType === null) {
      throw new Error('Stripe event type is required');
    }

    if (object === null) {
      throw new Error('Stripe event data.object is required');
    }

    const metadata = this.getObject(object, 'metadata') ?? {};

    const normalizedEvent = new NormalizedPaymentWebhookEventDto({
      provider: 'stripe',

      eventId,
      eventType,
      eventAction: eventType,
      canonicalStatus: this.resolveCanonicalStatus({
        eventType,
        object,
      }),

      gatewayTransactionId: this.resolveGatewayTransactionId({
        eventType,
        object,
      }),

      gatewayPaymentIntentId: this.resolveGatewayPaymentIntentId({
        eventType,
        object,
      }),

      gatewayChargeId: this.resolveGatewayChargeId({
        eventType,
        object,
      }),

      gatewaySubscriptionId: this.resolveGatewaySubscriptionId({
        eventType,
        object,
      }),

      gatewayInvoiceId: this.resolveGatewayInvoiceId({
        eventType,
        object,
      }),

      paymentTransactionId: this.getString(metadata, 'paymentTransactionId'),
      checkoutSessionId: this.getString(metadata, 'checkoutSessionId'),
      subscriptionId: this.getString(metadata, 'subscriptionId'),
      subscriptionInvoiceId: this.getString(
        metadata,
        'subscriptionInvoiceId',
      ),

      externalReference:
        this.getString(metadata, 'externalReference') ??
        this.getString(object, 'client_reference_id'),

      amount: this.resolveAmount({
        eventType,
        object,
      }),

      currency: this.resolveCurrency(object),

      rawPayload: dtoIn.payload,
      headers: dtoIn.headers,
    });

    return new NormalizeStripeWebhookDtoOut(normalizedEvent);
  }

  private resolveCanonicalStatus(params: {
    eventType: string;
    object: Record<string, unknown>;
  }): PaymentWebhookCanonicalStatus {
    const status = this.getString(params.object, 'status');
    const paymentStatus = this.getString(params.object, 'payment_status');

    switch (params.eventType) {
      case 'checkout.session.completed':
        return paymentStatus === 'paid' ? 'paid' : 'pending';

      case 'checkout.session.async_payment_succeeded':
      case 'payment_intent.succeeded':
      case 'charge.succeeded':
        return 'paid';

      case 'charge.failed':
      case 'checkout.session.async_payment_failed':
      case 'payment_intent.payment_failed':
        return 'failed';

      case 'payment_intent.processing':
        return 'pending';

      case 'payment_intent.canceled':
        return 'canceled';

      case 'checkout.session.expired':
        return 'expired';

      case 'charge.refunded':
        return 'refunded';

      case 'charge.dispute.created':
        return 'chargeback';

      case 'invoice.paid':
        return 'invoice_paid';

      case 'invoice.payment_failed':
        return 'invoice_payment_failed';

      case 'customer.subscription.updated':
        if (['active', 'trialing'].includes(String(status))) {
          return 'subscription_active';
        }

        if (['canceled', 'unpaid', 'incomplete_expired'].includes(String(status))) {
          return 'subscription_canceled';
        }

        return 'ignored';

      case 'customer.subscription.deleted':
        return 'subscription_canceled';

      default:
        return 'ignored';
    }
  }

  private resolveGatewayTransactionId(params: {
    eventType: string;
    object: Record<string, unknown>;
  }): string | null {
    const objectId = this.getString(params.object, 'id');

    if (params.eventType.startsWith('checkout.session.')) {
      return objectId;
    }

    if (params.eventType.startsWith('payment_intent.')) {
      return objectId;
    }

    if (params.eventType.startsWith('charge.')) {
      return objectId;
    }

    if (params.eventType.startsWith('invoice.')) {
      return objectId;
    }

    return objectId;
  }

  private resolveGatewayPaymentIntentId(params: {
    eventType: string;
    object: Record<string, unknown>;
  }): string | null {
    if (params.eventType.startsWith('payment_intent.')) {
      return this.getString(params.object, 'id');
    }

    return this.getString(params.object, 'payment_intent');
  }

  private resolveGatewayChargeId(params: {
    eventType: string;
    object: Record<string, unknown>;
  }): string | null {
    if (params.eventType.startsWith('charge.')) {
      return this.getString(params.object, 'id');
    }

    return this.getString(params.object, 'latest_charge');
  }

  private resolveGatewaySubscriptionId(params: {
    eventType: string;
    object: Record<string, unknown>;
  }): string | null {
    if (params.eventType.startsWith('customer.subscription.')) {
      return this.getString(params.object, 'id');
    }

    return this.getString(params.object, 'subscription');
  }

  private resolveGatewayInvoiceId(params: {
    eventType: string;
    object: Record<string, unknown>;
  }): string | null {
    if (params.eventType.startsWith('invoice.')) {
      return this.getString(params.object, 'id');
    }

    return this.getString(params.object, 'invoice');
  }

  private resolveAmount(params: {
    eventType: string;
    object: Record<string, unknown>;
  }): number | null {
    return (
      this.getNumber(params.object, 'amount_total') ??
      this.getNumber(params.object, 'amount_paid') ??
      this.getNumber(params.object, 'amount_received') ??
      this.getNumber(params.object, 'amount')
    );
  }

  private resolveCurrency(object: Record<string, unknown>): string | null {
    const currency = this.getString(object, 'currency');

    return currency ? currency.toUpperCase() : null;
  }

  private getObject(
    object: Record<string, unknown>,
    key: string,
  ): Record<string, unknown> | null {
    const value = object[key];

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private getString(
    object: Record<string, unknown>,
    key: string,
  ): string | null {
    const value = object[key];

    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private getNumber(
    object: Record<string, unknown>,
    key: string,
  ): number | null {
    const value = object[key];

    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? null : numberValue;
  }
}
