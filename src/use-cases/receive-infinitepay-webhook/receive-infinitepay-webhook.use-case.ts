import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { NormalizeInfinitePayWebhookDtoIn } from '../../modules/payment-webhook-gateways/infinitepay/services/normalize-infinitepay-webhook/dtos/normalize-infinitepay-webhook.dto-in';
import { NormalizeInfinitePayWebhookService } from '../../modules/payment-webhook-gateways/infinitepay/services/normalize-infinitepay-webhook/normalize-infinitepay-webhook.service';

import { NormalizedPaymentWebhookEventDto } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { RegisterPaymentWebhookEventDtoIn } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';

import type { PaymentTransactionRow } from '../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';

import { ProcessPaymentWebhookEventDtoIn } from '../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';

import { ReceiveInfinitePayWebhookDtoIn } from './dtos/receive-infinitepay-webhook.dto-in';
import { ReceiveInfinitePayWebhookDtoOut } from './dtos/receive-infinitepay-webhook.dto-out';

@Injectable()
export class ReceiveInfinitePayWebhookUseCase {
  constructor(
    private readonly normalizeInfinitePayWebhookService: NormalizeInfinitePayWebhookService,
    private readonly registerPaymentWebhookEventService: RegisterPaymentWebhookEventService,
    private readonly processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceiveInfinitePayWebhookDtoIn,
  ): Promise<ReceiveInfinitePayWebhookDtoOut> {
    try {
      const normalizedDtoOut = this.normalizeInfinitePayWebhookService.exec(
        new NormalizeInfinitePayWebhookDtoIn({
          payload: dtoIn.payload,
          headers: dtoIn.headers,
        }),
      );

      const normalizedEvent =
        await this.enrichNormalizedEventWithPaymentTransactionData(
          normalizedDtoOut.normalizedEvent,
        );

      const registeredDtoOut =
        await this.registerPaymentWebhookEventService.exec(
          new RegisterPaymentWebhookEventDtoIn({
            provider: normalizedEvent.provider,
            eventId: normalizedEvent.eventId,
            eventType: normalizedEvent.eventType,
            eventAction: normalizedEvent.eventAction,
            canonicalStatus: normalizedEvent.canonicalStatus,

            gatewayTransactionId: normalizedEvent.gatewayTransactionId,
            gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
            gatewayChargeId: normalizedEvent.gatewayChargeId,
            gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
            gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,

            paymentTransactionId: normalizedEvent.paymentTransactionId,
            checkoutSessionId: normalizedEvent.checkoutSessionId,
            subscriptionId: normalizedEvent.subscriptionId,
            subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId,
            externalReference: normalizedEvent.externalReference,

            amount: normalizedEvent.amount,
            currency: normalizedEvent.currency,

            headers: normalizedEvent.headers,
            payload: normalizedEvent.rawPayload,
            normalizedPayload: {
              provider: normalizedEvent.provider,
              eventId: normalizedEvent.eventId,
              eventType: normalizedEvent.eventType,
              eventAction: normalizedEvent.eventAction,
              canonicalStatus: normalizedEvent.canonicalStatus,

              gatewayTransactionId: normalizedEvent.gatewayTransactionId,
              gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
              gatewayChargeId: normalizedEvent.gatewayChargeId,
              gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
              gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,

              paymentTransactionId: normalizedEvent.paymentTransactionId,
              checkoutSessionId: normalizedEvent.checkoutSessionId,
              subscriptionId: normalizedEvent.subscriptionId,
              subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId,
              externalReference: normalizedEvent.externalReference,

              amount: normalizedEvent.amount,
              currency: normalizedEvent.currency,
            },

            metadata: {
              source: 'ReceiveInfinitePayWebhookUseCase',
              apiCredentialId: dtoIn.apiCredentialId,
            },
            config: null,
          }),
        );

      const paymentWebhookEvent =
        registeredDtoOut.paymentWebhookEvent as Record<string, unknown>;

      if (
        registeredDtoOut.wasAlreadyRegistered &&
        String(paymentWebhookEvent.status) === 'processed'
      ) {
        return new ReceiveInfinitePayWebhookDtoOut(
          paymentWebhookEvent,
          null,
          {
            ignored: true,
            reason: 'webhook event already processed',
            provider: normalizedEvent.provider,
            eventId: normalizedEvent.eventId,
          },
          true,
        );
      }

      const paymentWebhookEventId = String(paymentWebhookEvent._id ?? '').trim();

      if (paymentWebhookEventId === '') {
        throw new Error('paymentWebhookEvent._id is required');
      }

      const processedDtoOut =
        await this.processPaymentWebhookEventUseCase.exec(
          new ProcessPaymentWebhookEventDtoIn({
            paymentWebhookEventId,
            normalizedEvent,
          }),
        );

      return new ReceiveInfinitePayWebhookDtoOut(
        processedDtoOut.paymentWebhookEvent,
        processedDtoOut.paymentTransaction,
        processedDtoOut.processingResult,
        registeredDtoOut.wasAlreadyRegistered,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReceiveInfinitePayWebhookUseCase',
          error,
          appFile: __filename,
          context: {
            provider: 'infinitepay',
            apiCredentialId: dtoIn.apiCredentialId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on receive InfinitePay webhook use case';

      throw new Error(message);
    }
  }

  private async enrichNormalizedEventWithPaymentTransactionData(
    event: NormalizedPaymentWebhookEventDto,
  ): Promise<NormalizedPaymentWebhookEventDto> {
    const paymentTransaction = await this.resolvePaymentTransactionFromEvent(
      event,
    );

    if (paymentTransaction === null) {
      return event;
    }

    const paymentTransactionId =
      event.paymentTransactionId ??
      this.toNullableString(paymentTransaction._id);

    const checkoutSessionId =
      event.checkoutSessionId ??
      this.toNullableString(paymentTransaction.checkoutSessionId);

    if (
      paymentTransactionId === event.paymentTransactionId &&
      checkoutSessionId === event.checkoutSessionId
    ) {
      return event;
    }

    return new NormalizedPaymentWebhookEventDto({
      provider: event.provider,
      eventId: event.eventId,
      eventType: event.eventType,
      eventAction: event.eventAction,
      canonicalStatus: event.canonicalStatus,

      gatewayTransactionId: event.gatewayTransactionId,
      gatewayPaymentIntentId: event.gatewayPaymentIntentId,
      gatewayChargeId: event.gatewayChargeId,
      gatewaySubscriptionId: event.gatewaySubscriptionId,
      gatewayInvoiceId: event.gatewayInvoiceId,

      paymentTransactionId,
      checkoutSessionId,
      subscriptionId: event.subscriptionId,
      subscriptionInvoiceId: event.subscriptionInvoiceId,
      externalReference: event.externalReference,

      amount: event.amount,
      currency: event.currency,

      rawPayload: event.rawPayload,
      headers: event.headers,
    });
  }

  private async resolvePaymentTransactionFromEvent(
    event: NormalizedPaymentWebhookEventDto,
  ): Promise<PaymentTransactionRow | null> {
    if (event.paymentTransactionId !== null) {
      const found = await this.findPaymentTransactionByUniqueIdSafe(
        event.paymentTransactionId,
      );

      if (found !== null) {
        return found;
      }
    }

    const lookupValues = [
      event.gatewayTransactionId,
      event.gatewayPaymentIntentId,
      event.gatewayChargeId,
      event.gatewayInvoiceId,
      event.externalReference,
    ].filter((value): value is string => value !== null);

    for (const value of lookupValues) {
      const found =
        await this.findPaymentTransactionByGatewayTransactionIdSafe(value);

      if (found !== null) {
        return found;
      }
    }

    return null;
  }

  private async findPaymentTransactionByUniqueIdSafe(
    paymentTransactionId: string,
  ): Promise<PaymentTransactionRow | null> {
    try {
      const dtoOut = await this.findPaymentTransactionByUniqueIdService.exec(
        new FindPaymentTransactionByUniqueIdDtoIn(paymentTransactionId),
      );

      return dtoOut.paymentTransaction as unknown as PaymentTransactionRow;
    } catch {
      return null;
    }
  }

  private async findPaymentTransactionByGatewayTransactionIdSafe(
    gatewayTransactionId: string,
  ): Promise<PaymentTransactionRow | null> {
    try {
      const dtoOut =
        await this.findPaymentTransactionByGatewayTransactionIdService.exec(
          new FindPaymentTransactionByGatewayTransactionIdDtoIn(
            gatewayTransactionId,
          ),
        );

      return dtoOut.paymentTransaction as unknown as PaymentTransactionRow;
    } catch {
      return null;
    }
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
