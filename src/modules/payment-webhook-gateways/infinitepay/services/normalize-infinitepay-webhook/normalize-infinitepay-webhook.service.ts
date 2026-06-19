import { Injectable } from '@nestjs/common';

import {
  NormalizedPaymentWebhookEventDto,
  type PaymentWebhookCanonicalStatus,
} from '../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { NormalizeInfinitePayWebhookDtoIn } from './dtos/normalize-infinitepay-webhook.dto-in';
import { NormalizeInfinitePayWebhookDtoOut } from './dtos/normalize-infinitepay-webhook.dto-out';

@Injectable()
export class NormalizeInfinitePayWebhookService {
  exec(
    dtoIn: NormalizeInfinitePayWebhookDtoIn,
  ): NormalizeInfinitePayWebhookDtoOut {
    const payload = this.resolvePayloadRoot(dtoIn.payload);

    const orderNsu =
      this.getString(payload, 'order_nsu') ??
      this.getString(payload, 'orderNsu') ??
      this.getString(payload, 'order_id') ??
      this.getString(payload, 'orderId') ??
      this.getString(payload, 'external_reference') ??
      this.getString(payload, 'externalReference');

    const transactionNsu =
      this.getString(payload, 'transaction_nsu') ??
      this.getString(payload, 'transactionNsu') ??
      this.getString(payload, 'transaction_id') ??
      this.getString(payload, 'transactionId') ??
      this.getString(payload, 'payment_nsu') ??
      this.getString(payload, 'paymentNsu');

    const invoiceSlug =
      this.getString(payload, 'invoice_slug') ??
      this.getString(payload, 'invoiceSlug') ??
      this.getString(payload, 'slug') ??
      this.getString(payload, 'invoice_id') ??
      this.getString(payload, 'invoiceId');

    const fallbackId =
      this.getString(payload, 'id') ??
      this.getString(dtoIn.payload, 'id') ??
      this.getString(dtoIn.payload, 'event_id') ??
      this.getString(dtoIn.payload, 'eventId');

    const gatewayTransactionId =
      orderNsu ?? transactionNsu ?? invoiceSlug ?? fallbackId;

    if (gatewayTransactionId === null) {
      throw new Error(
        `InfinitePay webhook requires an identifiable order or transaction id. Payload: ${JSON.stringify(
          dtoIn.payload,
        )}`,
      );
    }

    const captureMethod =
      this.getString(payload, 'capture_method') ??
      this.getString(payload, 'captureMethod') ??
      this.getString(payload, 'payment_method') ??
      this.getString(payload, 'paymentMethod') ??
      'unknown';

    const eventType =
      this.getString(dtoIn.payload, 'event_type') ??
      this.getString(dtoIn.payload, 'eventType') ??
      this.getString(payload, 'event_type') ??
      this.getString(payload, 'eventType') ??
      'payment.approved';

    const eventId = this.resolveEventId({
      eventType,
      orderNsu: gatewayTransactionId,
      transactionNsu,
      invoiceSlug,
      fallbackId,
    });

    const normalizedEvent = new NormalizedPaymentWebhookEventDto({
      provider: 'infinitepay',

      eventId,
      eventType,
      eventAction: `payment.${captureMethod}.${this.resolveActionSuffix(
        payload,
      )}`,
      canonicalStatus: this.resolveCanonicalStatus(payload),

      gatewayTransactionId,
      gatewayPaymentIntentId: orderNsu ?? gatewayTransactionId,
      gatewayChargeId: transactionNsu,
      gatewaySubscriptionId: null,
      gatewayInvoiceId: invoiceSlug,

      paymentTransactionId: null,
      checkoutSessionId: null,
      subscriptionId: null,
      subscriptionInvoiceId: null,

      externalReference: orderNsu ?? gatewayTransactionId,

      amount: this.resolveAmount(payload),
      currency: this.resolveCurrency(payload),

      rawPayload: dtoIn.payload,
      headers: dtoIn.headers,
    });

    return new NormalizeInfinitePayWebhookDtoOut(normalizedEvent);
  }

  private resolvePayloadRoot(
    payload: Record<string, unknown>,
  ): Record<string, unknown> {
    const possibleRoots = [
      this.getObject(payload, 'data'),
      this.getObject(payload, 'payload'),
      this.getObject(payload, 'resource'),
      this.getObject(payload, 'event'),
      payload,
    ];

    for (const root of possibleRoots) {
      if (root !== null) {
        return root;
      }
    }

    return payload;
  }

  private resolveEventId(params: {
    eventType: string;
    orderNsu: string | null;
    transactionNsu: string | null;
    invoiceSlug: string | null;
    fallbackId: string | null;
  }): string {
    return [
      'infinitepay',
      params.eventType,
      params.orderNsu ?? 'no-order',
      params.transactionNsu ?? params.invoiceSlug ?? params.fallbackId ?? 'no-transaction',
    ].join(':');
  }

  private resolveActionSuffix(payload: Record<string, unknown>): string {
    const canonicalStatus = this.resolveCanonicalStatus(payload);

    if (canonicalStatus === 'paid') {
      return 'approved';
    }

    return canonicalStatus;
  }

  private resolveCanonicalStatus(
    payload: Record<string, unknown>,
  ): PaymentWebhookCanonicalStatus {
    const paid = this.getBoolean(payload, 'paid');

    if (paid === true) {
      return 'paid';
    }

    if (paid === false) {
      return 'pending';
    }

    const status =
      this.getString(payload, 'status') ??
      this.getString(payload, 'payment_status') ??
      this.getString(payload, 'paymentStatus');

    if (status !== null) {
      const normalizedStatus = status.toLowerCase();

      if (
        ['paid', 'approved', 'completed', 'captured', 'confirmed', 'success'].includes(
          normalizedStatus,
        )
      ) {
        return 'paid';
      }

      if (['pending', 'processing', 'created', 'waiting'].includes(normalizedStatus)) {
        return 'pending';
      }

      if (['failed', 'rejected', 'denied', 'error'].includes(normalizedStatus)) {
        return 'failed';
      }

      if (['canceled', 'cancelled', 'voided'].includes(normalizedStatus)) {
        return 'canceled';
      }

      if (['refunded'].includes(normalizedStatus)) {
        return 'refunded';
      }
    }

    return 'paid';
  }

  private resolveAmount(payload: Record<string, unknown>): number | null {
    return (
      this.getNumber(payload, 'amount') ??
      this.getNumber(payload, 'paid_amount') ??
      this.getNumber(payload, 'paidAmount') ??
      this.getNumber(payload, 'value') ??
      this.getNumber(payload, 'total')
    );
  }

  private resolveCurrency(payload: Record<string, unknown>): string | null {
    const currency =
      this.getString(payload, 'currency') ??
      this.getString(payload, 'currency_code') ??
      this.getString(payload, 'currencyCode');

    return currency === null ? 'BRL' : currency.toUpperCase();
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

  private getBoolean(
    object: Record<string, unknown>,
    key: string,
  ): boolean | null {
    const value = object[key];

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();

      if (normalized === 'true') {
        return true;
      }

      if (normalized === 'false') {
        return false;
      }
    }

    return null;
  }
}
