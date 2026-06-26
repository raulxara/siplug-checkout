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
    if (dtoIn.preapproval !== null) {
      return new NormalizeMercadoPagoWebhookDtoOut(
        this.normalizePreapproval(dtoIn),
      );
    }

    if (dtoIn.payment !== null) {
      return new NormalizeMercadoPagoWebhookDtoOut(
        this.normalizePayment(dtoIn),
      );
    }

    throw new Error('Mercado Pago payment or preapproval is required');
  }

  private normalizePayment(
    dtoIn: NormalizeMercadoPagoWebhookDtoIn,
  ): NormalizedPaymentWebhookEventDto {
    const payment = dtoIn.payment;

    if (payment === null) {
      throw new Error('Mercado Pago payment is required');
    }

    const paymentId = this.getString(payment, 'id');

    if (paymentId === null) {
      throw new Error('Mercado Pago payment id is required');
    }

    const metadata = this.getObject(payment, 'metadata') ?? {};
    const payloadData = this.getObject(dtoIn.payload, 'data') ?? {};

    const payloadType =
      this.getString(dtoIn.payload, 'type') ??
      this.getString(dtoIn.queryParams, 'type') ??
      'payment';

    const action =
      this.getString(dtoIn.payload, 'action') ??
      this.getString(dtoIn.queryParams, 'action') ??
      `payment.${this.getString(payment, 'status') ?? 'updated'}`;

    const status = this.getString(payment, 'status');

    const gatewaySubscriptionId =
      this.resolvePaymentGatewaySubscriptionId(payment);

    const gatewayInvoiceId =
      this.resolvePaymentGatewayInvoiceId(payment);

    return new NormalizedPaymentWebhookEventDto({
      provider: 'mercado_pago',

      eventId:
        this.getString(dtoIn.payload, 'id') ??
        this.getString(dtoIn.queryParams, 'id') ??
        this.getString(payloadData, 'id') ??
        `${payloadType}:${paymentId}:${action}:${status ?? 'unknown'}`,

      eventType: payloadType,
      eventAction: action,
      canonicalStatus: this.resolvePaymentCanonicalStatus(status),

      gatewayTransactionId: paymentId,
      gatewayPaymentIntentId: null,
      gatewayChargeId: null,
      gatewaySubscriptionId,
      gatewayInvoiceId,

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
        this.getString(payment, 'external_reference') ??
        this.getString(metadata, 'externalReference') ??
        this.getString(metadata, 'external_reference'),

      amount: this.resolveAmount(payment),
      currency: this.resolveCurrency(payment),

      rawPayload: {
        notification: dtoIn.payload,
        payment,
        queryParams: dtoIn.queryParams,
      },

      headers: dtoIn.headers,
    });
  }
  private resolvePaymentGatewaySubscriptionId(
    payment: Record<string, unknown>,
  ): string | null {
    const pointOfInteraction = this.getObject(payment, 'point_of_interaction');
    const transactionData =
      pointOfInteraction !== null
        ? this.getObject(pointOfInteraction, 'transaction_data')
        : null;

    return (
      this.getString(payment, 'preapproval_id') ??
      this.getString(payment, 'subscription_id') ??
      this.getString(transactionData, 'subscription_id')
    );
  }

  private resolvePaymentGatewayInvoiceId(
    payment: Record<string, unknown>,
  ): string | null {
    const pointOfInteraction = this.getObject(payment, 'point_of_interaction');
    const transactionData =
      pointOfInteraction !== null
        ? this.getObject(pointOfInteraction, 'transaction_data')
        : null;

    return (
      this.getString(payment, 'invoice_id') ??
      this.getString(payment, 'statement_descriptor') ??
      this.getString(transactionData, 'invoice_id') ??
      this.findPointOfInteractionReferenceId(payment, 'RECURRING_INVOICE')
    );
  }

  private findPointOfInteractionReferenceId(
    payment: Record<string, unknown>,
    referenceType: string,
  ): string | null {
    const pointOfInteraction = this.getObject(payment, 'point_of_interaction');

    if (pointOfInteraction === null) {
      return null;
    }

    const references = pointOfInteraction.references;

    if (!Array.isArray(references)) {
      return null;
    }

    for (const reference of references) {
      if (!reference || typeof reference !== 'object' || Array.isArray(reference)) {
        continue;
      }

      const referenceObject = reference as Record<string, unknown>;

      const type = this.getString(referenceObject, 'type');
      const id = this.getString(referenceObject, 'id');

      if (type === referenceType && id !== null) {
        return id;
      }
    }

    return null;
  }

  private normalizePreapproval(
    dtoIn: NormalizeMercadoPagoWebhookDtoIn,
  ): NormalizedPaymentWebhookEventDto {
    const preapproval = dtoIn.preapproval;

    if (preapproval === null) {
      throw new Error('Mercado Pago preapproval is required');
    }

    const preapprovalId = this.getString(preapproval, 'id');

    if (preapprovalId === null) {
      throw new Error('Mercado Pago preapproval id is required');
    }

    const metadata = this.getObject(preapproval, 'metadata') ?? {};
    const autoRecurring = this.getObject(preapproval, 'auto_recurring') ?? {};
    const payloadData = this.getObject(dtoIn.payload, 'data') ?? {};

    const payloadType =
      this.getString(dtoIn.payload, 'type') ??
      this.getString(dtoIn.queryParams, 'type') ??
      'preapproval';

    const status = this.getString(preapproval, 'status');

    const action =
      this.getString(dtoIn.payload, 'action') ??
      this.getString(dtoIn.queryParams, 'action') ??
      `preapproval.${status ?? 'updated'}`;

    return new NormalizedPaymentWebhookEventDto({
      provider: 'mercado_pago',

      eventId:
        this.getString(dtoIn.payload, 'id') ??
        this.getString(dtoIn.queryParams, 'id') ??
        this.getString(payloadData, 'id') ??
        `${payloadType}:${preapprovalId}:${action}:${status ?? 'unknown'}`,

      eventType: payloadType,
      eventAction: action,
      canonicalStatus: this.resolvePreapprovalCanonicalStatus(status),

      gatewayTransactionId: preapprovalId,
      gatewayPaymentIntentId: null,
      gatewayChargeId: null,
      gatewaySubscriptionId: preapprovalId,
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
        this.getString(preapproval, 'external_reference') ??
        this.getString(metadata, 'externalReference') ??
        this.getString(metadata, 'external_reference'),

      amount: this.resolveAmount(autoRecurring),
      currency: this.resolveCurrency(autoRecurring),

      rawPayload: {
        notification: dtoIn.payload,
        preapproval,
        queryParams: dtoIn.queryParams,
      },

      headers: dtoIn.headers,
    });
  }

  private resolvePaymentCanonicalStatus(
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

  private resolvePreapprovalCanonicalStatus(
    status: string | null,
  ): PaymentWebhookCanonicalStatus {
    switch (status) {
      case 'authorized':
        return 'subscription_active';

      case 'pending':
        return 'pending';

      case 'paused':
        return 'pending';

      case 'cancelled':
      case 'canceled':
        return 'subscription_canceled';

      default:
        return 'ignored';
    }
  }

  private resolveAmount(object: Record<string, unknown>): number | null {
    const value =
      this.getNumber(object, 'transaction_amount') ??
      this.getNumber(object, 'total_paid_amount');

    if (value === null) {
      return null;
    }

    return Math.round(value * 100);
  }

  private resolveCurrency(object: Record<string, unknown>): string | null {
    const currency =
      this.getString(object, 'currency_id') ??
      this.getString(object, 'currency');

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