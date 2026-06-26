import { Injectable } from '@nestjs/common';

import {
  NormalizedPaymentWebhookEventDto,
  type PaymentWebhookCanonicalStatus,
} from '../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { NormalizePagSeguroWebhookDtoIn } from './dtos/normalize-pagseguro-webhook.dto-in';
import { NormalizePagSeguroWebhookDtoOut } from './dtos/normalize-pagseguro-webhook.dto-out';

@Injectable()
export class NormalizePagSeguroWebhookService {
  exec(
    dtoIn: NormalizePagSeguroWebhookDtoIn,
  ): NormalizePagSeguroWebhookDtoOut {
    if (this.isSubscriptionPayload(dtoIn.payload, dtoIn.headers)) {
      return this.normalizeSubscriptionEvent(dtoIn);
    }

    return this.normalizeOrderOrChargeEvent(dtoIn);
  }

  private normalizeOrderOrChargeEvent(
    dtoIn: NormalizePagSeguroWebhookDtoIn,
  ): NormalizePagSeguroWebhookDtoOut {
    const orderId = this.getString(dtoIn.payload, 'id');
    const referenceId = this.getString(dtoIn.payload, 'reference_id');

    const charges = this.getObjectsArray(dtoIn.payload, 'charges');
    const primaryCharge = this.resolvePrimaryCharge(charges);

    const chargeId = this.getString(primaryCharge, 'id');
    const chargeStatus = this.getString(primaryCharge, 'status');
    const chargeReferenceId = this.getString(primaryCharge, 'reference_id');

    const orderStatus = this.getString(dtoIn.payload, 'status');
    const status = chargeStatus ?? orderStatus ?? 'UNKNOWN';

    const paymentMethod = this.getObject(primaryCharge, 'payment_method');
    const paymentMethodType = this.getString(paymentMethod, 'type');

    const gatewayTransactionId = this.resolveGatewayTransactionId({
      orderId,
      chargeId,
      paymentMethodType,
    });

    const eventId = this.resolveEventId({
      orderId,
      chargeId,
      status,
      referenceId: chargeReferenceId ?? referenceId,
      xProductId: this.getString(dtoIn.headers, 'x-product-id'),
    });

    const amount = this.resolveAmount(primaryCharge, dtoIn.payload);
    const currency = this.resolveCurrency(primaryCharge, dtoIn.payload);

    const normalizedEvent = new NormalizedPaymentWebhookEventDto({
      provider: 'pagseguro',
      eventId,
      eventType: this.resolveEventType({ orderId, chargeId }),
      eventAction: this.resolveEventAction({ chargeId, status }),

      canonicalStatus: this.resolvePaymentCanonicalStatus(status),

      gatewayTransactionId,
      gatewayPaymentIntentId: orderId,
      gatewayChargeId: chargeId,
      gatewaySubscriptionId: null,
      gatewayInvoiceId: null,

      paymentTransactionId: null,
      checkoutSessionId: null,
      subscriptionId: null,
      subscriptionInvoiceId: null,

      externalReference: chargeReferenceId ?? referenceId,

      amount,
      currency,

      rawPayload: {
        pagseguro: dtoIn.payload,
      },

      headers: dtoIn.headers,
    });

    return new NormalizePagSeguroWebhookDtoOut(normalizedEvent);
  }

  private normalizeSubscriptionEvent(
    dtoIn: NormalizePagSeguroWebhookDtoIn,
  ): NormalizePagSeguroWebhookDtoOut {
    const resource =
      this.getObject(dtoIn.payload, 'resource') ?? dtoIn.payload;

    const providerEvent = this.getString(dtoIn.payload, 'event');

    const subscription = this.getObject(resource, 'subscription');
    const invoice = this.getObject(resource, 'invoice');

    const gatewaySubscriptionId =
      this.resolveGatewaySubscriptionId(resource);

    const referenceId =
      this.getString(resource, 'reference_id') ??
      this.getString(resource, 'referenceId') ??
      this.getString(subscription, 'reference_id') ??
      this.getString(subscription, 'referenceId');

    const charges = this.getObjectsArray(resource, 'charges');
    const primaryCharge = this.resolvePrimaryCharge(charges);

    const chargeId = this.getString(primaryCharge, 'id');
    const chargeStatus = this.getString(primaryCharge, 'status');
    const chargeReferenceId = this.getString(primaryCharge, 'reference_id');

    const invoiceId =
      this.getString(resource, 'invoice_id') ??
      this.getString(resource, 'invoiceId') ??
      this.getString(invoice, 'id');

    const subscriptionStatus =
      this.getString(resource, 'status') ??
      this.getString(subscription, 'status');

    const status = chargeStatus ?? subscriptionStatus ?? 'UNKNOWN';

    const eventType =
      chargeId !== null ? 'subscription_charge' : 'subscription';

    const eventAction =
      providerEvent ?? `${eventType}.${status.toLowerCase()}`;

    const eventId = this.resolveSubscriptionEventId({
      gatewaySubscriptionId,
      invoiceId,
      chargeId,
      status,
      referenceId: chargeReferenceId ?? referenceId,
      xProductId: this.getString(dtoIn.headers, 'x-product-id'),
    });

    const gatewayTransactionId =
      chargeId ?? invoiceId ?? gatewaySubscriptionId;

    const amount = this.resolveAmount(primaryCharge, resource);
    const currency = this.resolveCurrency(primaryCharge, resource);

    const normalizedEvent = new NormalizedPaymentWebhookEventDto({
      provider: 'pagseguro',
      eventId,
      eventType,
      eventAction,

      canonicalStatus:
        chargeId !== null
          ? this.resolvePaymentCanonicalStatus(status)
          : this.resolveSubscriptionCanonicalStatus(status),

      gatewayTransactionId,
      gatewayPaymentIntentId: invoiceId ?? gatewaySubscriptionId,
      gatewayChargeId: chargeId,
      gatewaySubscriptionId,
      gatewayInvoiceId: invoiceId,

      paymentTransactionId: null,
      checkoutSessionId: null,
      subscriptionId: null,
      subscriptionInvoiceId: null,

      externalReference: chargeReferenceId ?? referenceId,

      amount,
      currency,

      rawPayload: {
        pagseguro: dtoIn.payload,
      },

      headers: dtoIn.headers,
    });

    return new NormalizePagSeguroWebhookDtoOut(normalizedEvent);
  }

  private isSubscriptionPayload(
    payload: Record<string, unknown>,
    headers: Record<string, unknown>,
  ): boolean {
    const event = this.getString(payload, 'event');

    if (event !== null && this.normalize(event).startsWith('subscription_')) {
      return true;
    }

    const resource = this.getObject(payload, 'resource');

    if (resource !== null) {
      const resourceId = this.getString(resource, 'id');

      if (
        resourceId !== null &&
        this.normalize(resourceId).startsWith('subs_')
      ) {
        return true;
      }
    }

    const productOrigin = this.getString(headers, 'x-product-origin');
    const productId = this.getString(headers, 'x-product-id');

    if (
      productOrigin !== null &&
      this.normalize(productOrigin).includes('subscription')
    ) {
      return true;
    }

    if (
      productId !== null &&
      this.normalize(productId).startsWith('subs_')
    ) {
      return true;
    }

    const payloadId = this.getString(payload, 'id');

    if (
      payloadId !== null &&
      this.normalize(payloadId).startsWith('subs_')
    ) {
      return true;
    }

    if (
      this.getString(payload, 'subscription_id') !== null ||
      this.getString(payload, 'subscriptionId') !== null
    ) {
      return true;
    }

    if (this.getObject(payload, 'subscription') !== null) {
      return true;
    }

    if (this.getObject(payload, 'plan') !== null) {
      return true;
    }

    return false;
  }

  private resolveGatewaySubscriptionId(
    payload: Record<string, unknown>,
  ): string | null {
    const subscription = this.getObject(payload, 'subscription');

    const directId = this.getString(payload, 'id');

    if (
      directId !== null &&
      this.normalize(directId).startsWith('subs_')
    ) {
      return directId;
    }

    return (
      this.getString(payload, 'subscription_id') ??
      this.getString(payload, 'subscriptionId') ??
      this.getString(subscription, 'id') ??
      directId
    );
  }

  private resolvePrimaryCharge(
    charges: Record<string, unknown>[],
  ): Record<string, unknown> | null {
    if (charges.length === 0) {
      return null;
    }

    const paidCharge = charges.find(
      (charge) => this.getString(charge, 'status') === 'PAID',
    );

    return paidCharge ?? charges[0];
  }

  private resolveGatewayTransactionId(params: {
    orderId: string | null;
    chargeId: string | null;
    paymentMethodType: string | null;
  }): string | null {
    const method = String(params.paymentMethodType ?? '').toUpperCase();

    if (method === 'PIX' && params.orderId !== null) {
      return params.orderId;
    }

    if (params.chargeId !== null) {
      return params.chargeId;
    }

    return params.orderId;
  }

  private resolveEventId(params: {
    orderId: string | null;
    chargeId: string | null;
    status: string;
    referenceId: string | null;
    xProductId: string | null;
  }): string {
    const base =
      params.xProductId ??
      params.chargeId ??
      params.orderId ??
      params.referenceId ??
      'unknown';

    return `${base}:${params.status}`;
  }

  private resolveSubscriptionEventId(params: {
    gatewaySubscriptionId: string | null;
    invoiceId: string | null;
    chargeId: string | null;
    status: string;
    referenceId: string | null;
    xProductId: string | null;
  }): string {
    const base =
      params.xProductId ??
      params.chargeId ??
      params.invoiceId ??
      params.gatewaySubscriptionId ??
      params.referenceId ??
      'unknown';

    return `${base}:${params.status}`;
  }

  private resolveEventType(params: {
    orderId: string | null;
    chargeId: string | null;
  }): string {
    if (params.chargeId !== null) {
      return 'charge';
    }

    if (params.orderId?.startsWith('CHEC_')) {
      return 'checkout';
    }

    return 'order';
  }

  private resolveEventAction(params: {
    chargeId: string | null;
    status: string;
  }): string {
    const status = params.status.toLowerCase();

    return params.chargeId !== null ? `charge.${status}` : `order.${status}`;
  }

  private resolvePaymentCanonicalStatus(
    status: string | null,
  ): PaymentWebhookCanonicalStatus {
    const normalized = String(status ?? '').trim().toUpperCase();

    switch (normalized) {
      case 'PAID':
        return 'paid';

      case 'AUTHORIZED':
        return 'authorized';

      case 'WAITING':
      case 'IN_ANALYSIS':
      case 'ACTIVE':
      case 'CREATED':
      case 'PENDING':
        return 'pending';

      case 'CANCELED':
      case 'CANCELLED':
        return 'canceled';

      case 'DECLINED':
      case 'FAILED':
        return 'failed';

      case 'EXPIRED':
        return 'expired';

      case 'REFUNDED':
        return 'refunded';

      case 'CHARGEBACK':
        return 'chargeback';

      default:
        return 'ignored';
    }
  }

  private resolveSubscriptionCanonicalStatus(
    status: string | null,
  ): PaymentWebhookCanonicalStatus {
    const normalized = String(status ?? '').trim().toUpperCase();

    switch (normalized) {
      case 'ACTIVE':
      case 'AUTHORIZED':
      case 'TRIALING':
        return 'subscription_active';

      case 'PAID':
        return 'paid';

      case 'WAITING':
      case 'IN_ANALYSIS':
      case 'CREATED':
      case 'PENDING':
      case 'OVERDUE':
        return 'pending';

      case 'CANCELED':
      case 'CANCELLED':
      case 'SUSPENDED':
      case 'INACTIVE':
      case 'UNPAID':
        return 'subscription_canceled';

      case 'DECLINED':
      case 'FAILED':
        return 'failed';

      case 'EXPIRED':
        return 'expired';

      case 'REFUNDED':
        return 'refunded';

      case 'CHARGEBACK':
        return 'chargeback';

      default:
        return 'ignored';
    }
  }

  private resolveAmount(
    charge: Record<string, unknown> | null,
    payload: Record<string, unknown>,
  ): number | null {
    const chargeAmount = this.getObject(charge, 'amount');
    const payloadAmount = this.getObject(payload, 'amount');

    return (
      this.getNumber(chargeAmount, 'value') ??
      this.getNumber(payloadAmount, 'value') ??
      this.getNumber(payload, 'amount')
    );
  }

  private resolveCurrency(
    charge: Record<string, unknown> | null,
    payload: Record<string, unknown>,
  ): string | null {
    const chargeAmount = this.getObject(charge, 'amount');
    const payloadAmount = this.getObject(payload, 'amount');

    const currency =
      this.getString(chargeAmount, 'currency') ??
      this.getString(payloadAmount, 'currency') ??
      this.getString(payload, 'currency');

    return currency ? currency.toUpperCase() : null;
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

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '_')
      .replace(/\s+/g, '_');
  }
}