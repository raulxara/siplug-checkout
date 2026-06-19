import { Injectable } from '@nestjs/common';

import {
  NormalizedPaymentWebhookEventDto,
  type PaymentWebhookCanonicalStatus,
} from '../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { NormalizePicPayWebhookDtoIn } from './dtos/normalize-picpay-webhook.dto-in';
import { NormalizePicPayWebhookDtoOut } from './dtos/normalize-picpay-webhook.dto-out';

@Injectable()
export class NormalizePicPayWebhookService {
  exec(dtoIn: NormalizePicPayWebhookDtoIn): NormalizePicPayWebhookDtoOut {
    const data = this.resolveDataPayload(dtoIn.payload);
    const transactions = this.resolveTransactions(data, dtoIn.payload);
    const primaryTransaction = this.resolvePrimaryTransaction(transactions);

    const merchantChargeId =
      this.getString(data, 'merchantChargeId') ??
      this.getString(dtoIn.payload, 'merchantChargeId');

    const smartCheckoutId =
      this.getString(data, 'smartCheckoutId') ??
      this.getString(dtoIn.payload, 'smartCheckoutId');

    const rootEventId = this.getString(dtoIn.payload, 'id');

    const transactionId =
      this.getString(primaryTransaction, 'transactionId') ??
      this.getString(primaryTransaction, 'id');

    const transactionStatus =
      this.getString(primaryTransaction, 'status') ??
      this.getString(primaryTransaction, 'transactionStatus');

    const chargeStatus =
      transactionStatus ??
      this.getString(data, 'status') ??
      this.getString(dtoIn.payload, 'chargeStatus') ??
      this.getString(dtoIn.payload, 'status');

    const status = chargeStatus ?? 'UNKNOWN';

    const paymentType =
      this.getString(primaryTransaction, 'paymentType') ??
      this.getString(data, 'paymentType');

    const gatewayTransactionId =
      merchantChargeId ?? transactionId ?? rootEventId;

    const eventId = this.resolveEventId({
      rootEventId,
      merchantChargeId,
      transactionId,
      status,
    });

    const amount =
      this.getNumber(primaryTransaction, 'amount') ??
      this.getNumber(data, 'amount') ??
      this.getNumber(dtoIn.payload, 'amount');

    const normalizedEvent = new NormalizedPaymentWebhookEventDto({
      provider: 'picpay',
      eventId,
      eventType: this.resolveEventType(dtoIn.eventTypeHeader),
      eventAction: this.resolveEventAction(status),
      canonicalStatus: this.resolveCanonicalStatus(status),

      gatewayTransactionId,
      gatewayPaymentIntentId: smartCheckoutId,
      gatewayChargeId: transactionId,
      gatewaySubscriptionId: null,
      gatewayInvoiceId: null,

      paymentTransactionId: null,
      checkoutSessionId: null,
      subscriptionId: null,
      subscriptionInvoiceId: null,

      externalReference: merchantChargeId,

      amount,
      currency: 'BRL',

      rawPayload: {
        picpay: dtoIn.payload,
      },

      headers: dtoIn.headers,
    });

    return new NormalizePicPayWebhookDtoOut(normalizedEvent);
  }

  private resolveDataPayload(
    payload: Record<string, unknown>,
  ): Record<string, unknown> {
    const data = this.getObject(payload, 'data');

    return data ?? payload;
  }

  private resolveTransactions(
    data: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): Record<string, unknown>[] {
    const dataTransactions = this.getObjectsArray(data, 'transactions');

    if (dataTransactions.length > 0) {
      return dataTransactions;
    }

    return this.getObjectsArray(payload, 'transactions');
  }

  private resolvePrimaryTransaction(
    transactions: Record<string, unknown>[],
  ): Record<string, unknown> | null {
    if (transactions.length === 0) {
      return null;
    }

    const paidTransaction = transactions.find((transaction) => {
      const status =
        this.getString(transaction, 'status') ??
        this.getString(transaction, 'transactionStatus');

      return ['CAPTURED', 'PAID'].includes(String(status ?? '').toUpperCase());
    });

    return paidTransaction ?? transactions[0];
  }

  private resolveEventId(params: {
    rootEventId: string | null;
    merchantChargeId: string | null;
    transactionId: string | null;
    status: string;
  }): string {
    if (params.rootEventId !== null) {
      return params.rootEventId;
    }

    const base =
      params.merchantChargeId ?? params.transactionId ?? 'unknown-picpay-event';

    return `${base}:${params.status}`;
  }

  private resolveEventType(eventTypeHeader: string | null): string {
    if (eventTypeHeader !== null) {
      return eventTypeHeader;
    }

    return 'charge';
  }

  private resolveEventAction(status: string): string {
    return `charge.${status.toLowerCase()}`;
  }

  private resolveCanonicalStatus(
    status: string | null,
  ): PaymentWebhookCanonicalStatus {
    const normalized = String(status ?? '').trim().toUpperCase();

    switch (normalized) {
      case 'CAPTURED':
      case 'PAID':
        return 'paid';

      case 'AUTHORIZED':
      case 'PRE_AUTHORIZED':
        return 'authorized';

      case 'PENDING':
      case 'CREATED':
      case 'PROCESSING':
        return 'pending';

      case 'DENIED':
      case 'ERROR':
      case 'FAILED':
        return 'failed';

      case 'CANCELED':
      case 'CANCELLED':
        return 'canceled';

      case 'EXPIRED':
        return 'expired';

      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
      case 'PARTIAL':
        return 'refunded';

      case 'CHARGEBACK':
        return 'chargeback';

      default:
        return 'ignored';
    }
  }

  private getObjectsArray(
    object: Record<string, unknown>,
    key: string,
  ): Record<string, unknown>[] {
    const value = object[key];

    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === 'object' && !Array.isArray(item),
    );
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
    object: Record<string, unknown> | null,
    key: string,
  ): number | null {
    if (object === null) {
      return null;
    }

    const value = object[key];

    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? null : numberValue;
  }
}
