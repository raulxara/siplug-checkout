import { Injectable } from '@nestjs/common';

import {
  NormalizedPaymentWebhookEventDto,
  type PaymentWebhookCanonicalStatus,
} from '../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { NormalizePayPalWebhookDtoIn } from './dtos/normalize-paypal-webhook.dto-in';
import { NormalizePayPalWebhookDtoOut } from './dtos/normalize-paypal-webhook.dto-out';

@Injectable()
export class NormalizePayPalWebhookService {
  exec(dtoIn: NormalizePayPalWebhookDtoIn): NormalizePayPalWebhookDtoOut {
    const eventId = this.getString(dtoIn.payload, 'id');
    const eventType = this.getString(dtoIn.payload, 'event_type');
    const resource = this.getObject(dtoIn.payload, 'resource');

    if (eventId === null) {
      throw new Error('PayPal webhook id is required');
    }

    if (eventType === null) {
      throw new Error('PayPal webhook event_type is required');
    }

    if (resource === null) {
      throw new Error('PayPal webhook resource is required');
    }

    const gatewayTransactionId = this.resolveGatewayTransactionId({
      eventType,
      resource,
    });

    const gatewayChargeId = this.resolveGatewayChargeId({
      eventType,
      resource,
    });

    const amount = this.resolveAmount(resource);
    const currency = this.resolveCurrency(resource);

    const normalizedEvent = new NormalizedPaymentWebhookEventDto({
      provider: 'paypal',

      eventId,
      eventType,
      eventAction: eventType,
      canonicalStatus: this.resolveCanonicalStatus({
        eventType,
        resource,
      }),

      gatewayTransactionId,
      gatewayPaymentIntentId: gatewayTransactionId,
      gatewayChargeId,
      gatewaySubscriptionId: this.resolveGatewaySubscriptionId({
        eventType,
        resource,
      }),
      gatewayInvoiceId: null,

      paymentTransactionId: this.resolvePaymentTransactionId(resource),
      checkoutSessionId: null,
      subscriptionId: null,
      subscriptionInvoiceId: null,

      externalReference:
        this.getString(resource, 'invoice_id') ??
        this.getString(resource, 'custom_id') ??
        gatewayTransactionId,

      amount,
      currency,

      rawPayload: dtoIn.payload,
      headers: dtoIn.headers,
    });

    return new NormalizePayPalWebhookDtoOut(normalizedEvent);
  }

  private resolveCanonicalStatus(params: {
    eventType: string;
    resource: Record<string, unknown>;
  }): PaymentWebhookCanonicalStatus {
    const eventType = params.eventType.toUpperCase().trim();
    const status = this.getString(params.resource, 'status')?.toUpperCase();

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        return 'pending';

      case 'CHECKOUT.ORDER.COMPLETED':
        return 'paid';

      case 'CHECKOUT.PAYMENT-APPROVAL.REVERSED':
        return 'canceled';

      case 'PAYMENT.CAPTURE.COMPLETED':
        return 'paid';

      case 'PAYMENT.CAPTURE.PENDING':
        return 'pending';

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED':
      case 'PAYMENT.CAPTURE.FAILED':
        return 'failed';

      case 'PAYMENT.CAPTURE.REFUNDED':
      case 'PAYMENT.CAPTURE.PARTIALLY_REFUNDED':
        return 'refunded';

      case 'PAYMENT.CAPTURE.REVERSED':
        return 'chargeback';

      default:
        if (status === 'COMPLETED') {
          return 'paid';
        }

        if (status === 'PENDING') {
          return 'pending';
        }

        if (status === 'DENIED' || status === 'FAILED') {
          return 'failed';
        }

        return 'ignored';
    }
  }

  private resolveGatewayTransactionId(params: {
    eventType: string;
    resource: Record<string, unknown>;
  }): string | null {
    const eventType = params.eventType.toUpperCase().trim();

    if (eventType.startsWith('CHECKOUT.ORDER.')) {
      return this.getString(params.resource, 'id');
    }

    const supplementaryData = this.getObject(
      params.resource,
      'supplementary_data',
    );
    const relatedIds = supplementaryData
      ? this.getObject(supplementaryData, 'related_ids')
      : null;

    return (
      this.getString(relatedIds, 'order_id') ??
      this.getString(params.resource, 'order_id') ??
      this.getString(params.resource, 'id')
    );
  }

  private resolveGatewayChargeId(params: {
    eventType: string;
    resource: Record<string, unknown>;
  }): string | null {
    const eventType = params.eventType.toUpperCase().trim();

    if (eventType.startsWith('PAYMENT.CAPTURE.')) {
      return this.getString(params.resource, 'id');
    }

    return null;
  }

  private resolveGatewaySubscriptionId(params: {
    eventType: string;
    resource: Record<string, unknown>;
  }): string | null {
    const eventType = params.eventType.toUpperCase().trim();

    if (eventType.includes('BILLING.SUBSCRIPTION')) {
      return this.getString(params.resource, 'id');
    }

    return null;
  }

  private resolvePaymentTransactionId(
    resource: Record<string, unknown>,
  ): string | null {
    return (
      this.getString(resource, 'custom_id') ??
      this.getString(resource, 'custom')
    );
  }

  private resolveAmount(resource: Record<string, unknown>): number | null {
    const amount = this.getObject(resource, 'amount');
    const value = this.getString(amount, 'value');

    if (value === null) {
      return null;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return null;
    }

    return Math.round(parsed * 100);
  }

  private resolveCurrency(resource: Record<string, unknown>): string | null {
    const amount = this.getObject(resource, 'amount');

    return this.getString(amount, 'currency_code');
  }

  private getObject(
    object: Record<string, unknown> | null,
    key: string,
  ): Record<string, unknown> | null {
    if (object === null) {
      return null;
    }

    const value = object[key];

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private getString(
    object: Record<string, unknown> | null,
    key: string,
  ): string | null {
    if (object === null) {
      return null;
    }

    const value = object[key];

    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
