import { Injectable } from '@nestjs/common';

import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn } from '../../../payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../../payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { UpdatePaymentSplitRecipientDtoIn } from '../../../payment-split-recipients/services/update-payment-split-recipient/dtos/update-payment-split-recipient.dto-in';
import { UpdatePaymentSplitRecipientService } from '../../../payment-split-recipients/services/update-payment-split-recipient/update-payment-split-recipient.service';

import { FindPaymentSplitByUniqueIdDtoIn } from '../find-payment-split-by-unique-id/dtos/find-payment-split-by-unique-id.dto-in';
import { FindPaymentSplitByUniqueIdService } from '../find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';
import { UpdatePaymentSplitDtoIn } from '../update-payment-split/dtos/update-payment-split.dto-in';
import { UpdatePaymentSplitService } from '../update-payment-split/update-payment-split.service';

import { MarkNativePaymentSplitAsTransferredDtoIn } from './dtos/mark-native-payment-split-as-transferred.dto-in';
import { MarkNativePaymentSplitAsTransferredDtoOut } from './dtos/mark-native-payment-split-as-transferred.dto-out';

@Injectable()
export class MarkNativePaymentSplitAsTransferredService {
  constructor(
    private readonly findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService,
    private readonly updatePaymentSplitService: UpdatePaymentSplitService,

    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    private readonly updatePaymentSplitRecipientService: UpdatePaymentSplitRecipientService,
  ) {}

  async exec(
    dtoIn: MarkNativePaymentSplitAsTransferredDtoIn,
  ): Promise<MarkNativePaymentSplitAsTransferredDtoOut> {
    const paymentSplitDtoOut =
      await this.findPaymentSplitByUniqueIdService.exec(
        new FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId),
      );

    const paymentSplit = paymentSplitDtoOut.paymentSplit as Record<
      string,
      unknown
    >;

    const currentStatus = String(paymentSplit.status ?? '').trim();

    if (!this.isSupportedNativeProvider(dtoIn.provider)) {
      return new MarkNativePaymentSplitAsTransferredDtoOut(
        false,
        false,
        `native split settlement is not implemented for provider: ${dtoIn.provider}`,
        paymentSplit,
        [],
        dtoIn.paymentSplitId,
        dtoIn.sourceTransactionId,
        {
          provider: dtoIn.provider,
          mode: dtoIn.settlementMode,
          status: currentStatus,
          skipped: true,
          reason: 'unsupported native provider',
        },
      );
    }

    if (!this.providerMatches(paymentSplit.gatewayProvider, dtoIn.provider)) {
      return new MarkNativePaymentSplitAsTransferredDtoOut(
        false,
        false,
        'payment split gateway provider does not match native settlement provider',
        paymentSplit,
        [],
        dtoIn.paymentSplitId,
        dtoIn.sourceTransactionId,
        {
          provider: dtoIn.provider,
          mode: dtoIn.settlementMode,
          status: currentStatus,
          skipped: true,
          reason: 'provider mismatch',
        },
      );
    }

    if (
      String(paymentSplit.paymentTransactionId ?? '').trim() !==
      dtoIn.paymentTransactionId
    ) {
      return new MarkNativePaymentSplitAsTransferredDtoOut(
        false,
        false,
        'payment split does not belong to payment transaction',
        paymentSplit,
        [],
        dtoIn.paymentSplitId,
        dtoIn.sourceTransactionId,
        {
          provider: dtoIn.provider,
          mode: dtoIn.settlementMode,
          status: currentStatus,
          skipped: true,
          reason: 'payment split transaction mismatch',
        },
      );
    }

    const recipients = await this.getRecipients(dtoIn.paymentSplitId);

    if (recipients.length === 0) {
      return new MarkNativePaymentSplitAsTransferredDtoOut(
        false,
        false,
        'payment split must have at least one recipient',
        paymentSplit,
        [],
        dtoIn.paymentSplitId,
        dtoIn.sourceTransactionId,
        {
          provider: dtoIn.provider,
          mode: dtoIn.settlementMode,
          status: currentStatus,
          skipped: true,
          reason: 'recipients not found',
        },
      );
    }

    if (currentStatus === 'transferred') {
      return new MarkNativePaymentSplitAsTransferredDtoOut(
        true,
        true,
        'payment split already native settled',
        paymentSplit,
        recipients,
        dtoIn.paymentSplitId,
        dtoIn.sourceTransactionId,
        {
          provider: dtoIn.provider,
          mode: dtoIn.settlementMode,
          status: 'transferred',
          alreadySettled: true,
          sourceTransactionId: dtoIn.sourceTransactionId,
        },
      );
    }

    const allowedStatuses = [
      'created',
      'pending_gateway',
      'processing_gateway',
      'failed',
      'gateway_failed_retryable',
      'partially_transferred',
    ];

    if (!allowedStatuses.includes(currentStatus)) {
      return new MarkNativePaymentSplitAsTransferredDtoOut(
        false,
        false,
        `payment split status does not allow native settlement: ${currentStatus}`,
        paymentSplit,
        recipients,
        dtoIn.paymentSplitId,
        dtoIn.sourceTransactionId,
        {
          provider: dtoIn.provider,
          mode: dtoIn.settlementMode,
          status: currentStatus,
          skipped: true,
          reason: 'status does not allow native settlement',
          allowedStatuses,
        },
      );
    }

    const settledAt = new Date().toISOString();

    const nativeSettlement = this.buildNativeSettlement({
      dtoIn,
      settledAt,
    });

    const updatedRecipients: Array<Record<string, unknown>> = [];

    for (const recipient of recipients) {
      const updatedRecipient = await this.markRecipientAsNativeTransferred({
        recipient,
        provider: dtoIn.provider,
        settlementMode: dtoIn.settlementMode,
        sourceTransactionId: dtoIn.sourceTransactionId,
        settledAt,
      });

      updatedRecipients.push(updatedRecipient);
    }

    const finalSplitDtoOut = await this.updatePaymentSplitService.exec(
      new UpdatePaymentSplitDtoIn({
        _id: dtoIn.paymentSplitId,

        gatewaySplitId:
          this.toNullableString(paymentSplit.gatewaySplitId) ??
          dtoIn.sourceTransactionId,

        providerPayload: {
          ...(this.toObject(paymentSplit.providerPayload) ?? {}),
          nativeSettlement,
        },

        providerResponse: {
          ...(this.toObject(paymentSplit.providerResponse) ?? {}),
          nativeSettlement,
        },

        gatewayResponse: {
          ...(this.toObject(paymentSplit.gatewayResponse) ?? {}),
          nativeSettlement,
        },

        metadata: {
          ...(this.toObject(paymentSplit.metadata) ?? {}),
          lastNativeSplitSettlement: nativeSettlement,
        },

        status: 'transferred',

        source: dtoIn.source,
      }),
    );

    return new MarkNativePaymentSplitAsTransferredDtoOut(
      true,
      false,
      `${dtoIn.provider} native split settled internally`,
      finalSplitDtoOut.paymentSplit as Record<string, unknown>,
      updatedRecipients,
      dtoIn.paymentSplitId,
      dtoIn.sourceTransactionId,
      {
        provider: dtoIn.provider,
        mode: dtoIn.settlementMode,
        status: 'transferred',
        sourceTransactionId: dtoIn.sourceTransactionId,
        settledAt,
      },
    );
  }

  private async getRecipients(
    paymentSplitId: string,
  ): Promise<Array<Record<string, unknown>>> {
    const dtoOut =
      await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(
        new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(paymentSplitId),
      );

    const response = dtoOut as {
      paymentSplitRecipients?: Array<Record<string, unknown>>;
      recipients?: Array<Record<string, unknown>>;
      items?: Array<Record<string, unknown>>;
      data?: Array<Record<string, unknown>>;
    };

    return (
      response.paymentSplitRecipients ??
      response.recipients ??
      response.items ??
      response.data ??
      []
    );
  }

  private async markRecipientAsNativeTransferred(params: {
    recipient: Record<string, unknown>;
    provider: string;
    settlementMode: string;
    sourceTransactionId: string | null;
    settledAt: string;
  }): Promise<Record<string, unknown>> {
    const recipientId = this.requiredString(
      params.recipient._id,
      'paymentSplitRecipient._id',
    );

    if (String(params.recipient.status ?? '').trim() === 'transferred') {
      return params.recipient;
    }

    const role = String(params.recipient.role ?? 'recipient')
      .trim()
      .toLowerCase();

    const gatewayTransferId = this.buildNativeRecipientReference({
      provider: params.provider,
      sourceTransactionId: params.sourceTransactionId,
      role,
      recipientId,
    });

    const recipientSettlement = {
      provider: params.provider,
      mode: params.settlementMode,
      role,
      status: 'transferred',
      gatewayTransferId,
      settledAt: params.settledAt,
      description:
        role === 'platform'
          ? 'marketplace fee collected by native split'
          : 'recipient settled by native split',
    };

    const updatedDtoOut =
      await this.updatePaymentSplitRecipientService.exec(
        new UpdatePaymentSplitRecipientDtoIn({
          _id: recipientId,

          gatewayTransferId,

          providerResponse: {
            ...(this.toObject(params.recipient.providerResponse) ?? {}),
            nativeSettlement: recipientSettlement,
          },

          gatewayResponse: {
            ...(this.toObject(params.recipient.gatewayResponse) ?? {}),
            nativeSettlement: recipientSettlement,
          },

          metadata: {
            ...(this.toObject(params.recipient.metadata) ?? {}),
            lastNativeSplitSettlement: recipientSettlement,
          },

          status: 'transferred',

          source:
            'MarkNativePaymentSplitAsTransferredService.markRecipientAsNativeTransferred',
        }),
      );

    return updatedDtoOut.paymentSplitRecipient as Record<string, unknown>;
  }

  private buildNativeSettlement(params: {
    dtoIn: MarkNativePaymentSplitAsTransferredDtoIn;
    settledAt: string;
  }): Record<string, unknown> {
    return {
      provider: params.dtoIn.provider,
      mode: params.dtoIn.settlementMode,
      status: 'transferred',
      reason:
        'native split was already executed by the payment gateway fee mechanism',

      paymentSplitId: params.dtoIn.paymentSplitId,
      paymentTransactionId: params.dtoIn.paymentTransactionId,
      paymentWebhookEventId: params.dtoIn.paymentWebhookEventId,

      eventId: params.dtoIn.eventId,
      eventType: params.dtoIn.eventType,
      eventAction: params.dtoIn.eventAction,
      canonicalStatus: params.dtoIn.canonicalStatus,

      sourceTransactionId: params.dtoIn.sourceTransactionId,
      gatewayTransactionId: params.dtoIn.sourceTransactionId,

      marketplaceFeeAmount: this.extractMarketplaceFee(params.dtoIn.rawPayload),
      collectorId: this.extractStringFromPath(params.dtoIn.rawPayload, [
        'payment',
        'collector_id',
      ]),
      marketplaceOwner: this.extractStringFromPath(params.dtoIn.rawPayload, [
        'payment',
        'marketplace_owner',
      ]),

      settledAt: params.settledAt,
    };
  }

  private buildNativeRecipientReference(params: {
    provider: string;
    sourceTransactionId: string | null;
    role: string;
    recipientId: string;
  }): string {
    return [
      `${params.provider}-native`,
      params.sourceTransactionId ?? 'unknown-payment',
      params.role,
      params.recipientId,
    ].join(':');
  }

  private extractMarketplaceFee(
    rawPayload: Record<string, unknown> | null,
  ): number | null {
    const payment = this.extractObjectFromPath(rawPayload, ['payment']);

    const feeDetails = payment?.fee_details;

    if (Array.isArray(feeDetails)) {
      const applicationFee = feeDetails.find((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          return false;
        }

        return String((item as Record<string, unknown>).type ?? '') ===
          'application_fee';
      }) as Record<string, unknown> | undefined;

      if (applicationFee !== undefined) {
        const amount = Number(applicationFee.amount);

        return Number.isFinite(amount) ? amount : null;
      }
    }

    const chargesDetails = payment?.charges_details;

    if (Array.isArray(chargesDetails)) {
      const marketplaceCharge = chargesDetails.find((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          return false;
        }

        return String((item as Record<string, unknown>).name ?? '') ===
          'third_payment';
      }) as Record<string, unknown> | undefined;

      const amount = this.extractNumberFromPath(marketplaceCharge ?? null, [
        'amounts',
        'original',
      ]);

      if (amount !== null) {
        return amount;
      }
    }

    return null;
  }

  private isSupportedNativeProvider(provider: unknown): boolean {
    return (
      this.isMercadoPagoProvider(provider) ||
      this.isPagSeguroProvider(provider) ||
      this.isStripeProvider(provider)
    );
  }

  private providerMatches(
    splitProvider: unknown,
    settlementProvider: unknown,
  ): boolean {
    if (
      this.isMercadoPagoProvider(splitProvider) &&
      this.isMercadoPagoProvider(settlementProvider)
    ) {
      return true;
    }

    return (
      String(splitProvider ?? '').trim().toLowerCase() ===
      String(settlementProvider ?? '').trim().toLowerCase()
    );
  }

  private isMercadoPagoProvider(provider: unknown): boolean {
    return ['mercado_pago', 'mercadopago', 'mercado-pago'].includes(
      String(provider ?? '').trim().toLowerCase(),
    );
  }

  private isPagSeguroProvider(provider: unknown): boolean {
    return ['pagseguro', 'pagbank', 'pag_bank', 'pag-seguro'].includes(
      String(provider ?? '').trim().toLowerCase(),
    );
  }

  private isStripeProvider(provider: unknown): boolean {
    return ['stripe'].includes(String(provider ?? '').trim().toLowerCase());
  }

  private requiredString(value: unknown, field: string): string {
    const stringValue = this.toNullableString(value);

    if (stringValue === null) {
      throw new Error(`${field} is required`);
    }

    return stringValue;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private extractObjectFromPath(
    object: Record<string, unknown> | null,
    path: string[],
  ): Record<string, unknown> | null {
    let current: unknown = object;

    for (const key of path) {
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        return null;
      }

      current = (current as Record<string, unknown>)[key];
    }

    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return null;
    }

    return current as Record<string, unknown>;
  }

  private extractStringFromPath(
    object: Record<string, unknown> | null,
    path: string[],
  ): string | null {
    const value = this.extractValueFromPath(object, path);

    return this.toNullableString(value);
  }

  private extractNumberFromPath(
    object: Record<string, unknown> | null,
    path: string[],
  ): number | null {
    const value = this.extractValueFromPath(object, path);
    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : null;
  }

  private extractValueFromPath(
    object: Record<string, unknown> | null,
    path: string[],
  ): unknown {
    let current: unknown = object;

    for (const key of path) {
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        return null;
      }

      current = (current as Record<string, unknown>)[key];
    }

    return current;
  }
}
