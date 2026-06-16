import { Injectable } from '@nestjs/common';

import {
  NormalizedPaymentWebhookEventDto,
  type PaymentWebhookCanonicalStatus,
} from '../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { NormalizeMercadoPagoWebhookDtoIn } from './dtos/normalize-mercado-pago-webhook.dto-in';
import { NormalizeMercadoPagoWebhookDtoOut } from './dtos/normalize-mercado-pago-webhook.dto-out';

@Injectable()
export class NormalizeMercadoPagoWebhookService {
  exec(
    dtoIn: NormalizeMercadoPagoWebhookDtoIn,
  ): NormalizeMercadoPagoWebhookDtoOut {
    const paymentId = this.getString(dtoIn.payment, 'id');

    if (paymentId === null) {
      throw new Error('Mercado Pago payment id is required');
    }

    const metadata = this.getObject(dtoIn.payment, 'metadata') ?? {};
    const payloadData = this.getObject(dtoIn.payload, 'data') ?? {};

    const payloadType =
      this.getString(dtoIn.payload, 'type') ??
      this.getString(dtoIn.queryParams, 'type') ??
      'payment';

    const action =
      this.getString(dtoIn.payload, 'action') ??
      this.getString(dtoIn.queryParams, 'action') ??
      `payment.${this.getString(dtoIn.payment, 'status') ?? 'updated'}`;

    const status = this.getString(dtoIn.payment, 'status');

    const normalizedEvent = new NormalizedPaymentWebhookEventDto({
      provider: 'mercado_pago',

      eventId:
        this.getString(dtoIn.payload, 'id') ??
        this.getString(dtoIn.queryParams, 'id') ??
        this.getString(payloadData, 'id') ??
        `${payloadType}:${paymentId}:${action}:${status ?? 'unknown'}`,

      eventType: payloadType,
      eventAction: action,
      canonicalStatus: this.resolveCanonicalStatus(status),

      gatewayTransactionId: paymentId,
      gatewayPaymentIntentId: null,
      gatewayChargeId: null,
      gatewaySubscriptionId: this.getString(dtoIn.payment, 'preapproval_id'),
      gatewayInvoiceId: null,

      paymentTransactionId:
        this.getString(metadata, 'paymentTransactionId') ??
        this.getString(metadata, 'payment_transaction_id'),

      checkoutSessionId:
        this.getString(metadata, 'checkoutSessionId') ??
        this.getString(metadata, 'checkout_session_id'),

      subscriptionId:
        this.getString(metadata, 'subscriptionId') ??
        this.getString(metadata, 'subscription_id'),

      subscriptionInvoiceId:
        this.getString(metadata, 'subscriptionInvoiceId') ??
        this.getString(metadata, 'subscription_invoice_id'),

      externalReference:
        this.getString(dtoIn.payment, 'external_reference') ??
        this.getString(metadata, 'externalReference') ??
        this.getString(metadata, 'external_reference'),

      amount: this.resolveAmount(dtoIn.payment),
      currency: this.resolveCurrency(dtoIn.payment),

      rawPayload: {
        notification: dtoIn.payload,
        payment: dtoIn.payment,
        queryParams: dtoIn.queryParams,
      },

      headers: dtoIn.headers,
    });

    return new NormalizeMercadoPagoWebhookDtoOut(normalizedEvent);
  }

  private resolveCanonicalStatus(
    status: string | null,
  ): PaymentWebhookCanonicalStatus {
    switch (status) {
      case 'approved':
        return 'paid';

      case 'authorized':
        return 'authorized';

      case 'pending':
      case 'in_process':
        return 'pending';

      case 'rejected':
        return 'failed';

      case 'cancelled':
      case 'canceled':
        return 'canceled';

      case 'refunded':
        return 'refunded';

      case 'charged_back':
        return 'chargeback';

      default:
        return 'ignored';
    }
  }

  private resolveAmount(payment: Record<string, unknown>): number | null {
    const value =
      this.getNumber(payment, 'transaction_amount') ??
      this.getNumber(payment, 'total_paid_amount');

    if (value === null) {
      return null;
    }

    return Math.round(value * 100);
  }

  private resolveCurrency(payment: Record<string, unknown>): string | null {
    const currency = this.getString(payment, 'currency_id');

    return currency ? currency.toUpperCase() : null;
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
