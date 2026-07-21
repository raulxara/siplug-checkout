import { Injectable } from '@nestjs/common';

import {
  GatewaySplitTransferDtoIn,
  GatewaySplitTransferRecipientDto,
} from '../../../dtos/gateway-split-transfer.dto-in';
import { GatewaySplitTransferDtoOut } from '../../../dtos/gateway-split-transfer.dto-out';

@Injectable()
export class DispatchStripeSplitTransferService {
  async exec(
    dtoIn: GatewaySplitTransferDtoIn,
  ): Promise<GatewaySplitTransferDtoOut> {
    if (!dtoIn.providerToken.startsWith('sk_')) {
      throw new Error('Stripe provider token must start with sk_');
    }

    if (!dtoIn.sourceTransactionId.startsWith('ch_')) {
      throw new Error('Stripe sourceTransactionId must start with ch_');
    }

    const transfers: Array<Record<string, unknown>> = [];
    const providerRequests: Array<Record<string, unknown>> = [];
    const providerResponses: Array<Record<string, unknown>> = [];

    for (const recipient of dtoIn.recipients) {
      const result = await this.createTransfer({
        dtoIn,
        recipient,
      });

      transfers.push(result.transfer);
      providerRequests.push(result.providerRequest);
      providerResponses.push(result.providerResponse);
    }

    const successTransfers = transfers.filter(
      (transfer) => transfer.success === true,
    );

    const failedTransfers = transfers.filter(
      (transfer) => transfer.success !== true,
    );

    const gatewaySplitId =
      successTransfers.length > 0
        ? String(successTransfers[0].gatewayTransferId ?? '')
        : null;

    const status =
      failedTransfers.length === 0
        ? 'transferred'
        : successTransfers.length > 0
          ? 'partially_transferred'
          : 'failed';

    return new GatewaySplitTransferDtoOut(
      successTransfers.length > 0,
      'stripe',
      status,
      gatewaySplitId && gatewaySplitId.trim() !== '' ? gatewaySplitId : null,
      transfers,
      {
        provider: 'stripe',
        endpoint: 'POST /v1/transfers',
        requests: providerRequests,
      },
      {
        provider: 'stripe',
        transfers: providerResponses,
      },
      {
        provider: 'stripe',
        status,
        successCount: successTransfers.length,
        failedCount: failedTransfers.length,
        transfers,
      },
      failedTransfers.length > 0
        ? 'one or more Stripe split transfers failed'
        : null,
    );
  }

  private async createTransfer(params: {
    dtoIn: GatewaySplitTransferDtoIn;
    recipient: GatewaySplitTransferRecipientDto;
  }): Promise<{
    transfer: Record<string, unknown>;
    providerRequest: Record<string, unknown>;
    providerResponse: Record<string, unknown>;
  }> {
    const { dtoIn, recipient } = params;

    const idempotencyKey = [
      dtoIn.idempotencyKey,
      recipient.paymentSplitRecipientId,
    ].join(':');

    const body = new URLSearchParams();

    body.set('amount', String(recipient.amount));
    body.set('currency', recipient.currency.toLowerCase());
    body.set('destination', recipient.destinationAccountId);
    body.set('source_transaction', dtoIn.sourceTransactionId);
    body.set('transfer_group', dtoIn.paymentSplitId);

    const metadata = {
      paymentSplitId: dtoIn.paymentSplitId,
      paymentSplitRecipientId: recipient.paymentSplitRecipientId,
      paymentTransactionId: dtoIn.paymentTransactionId,
      paymentWebhookEventId: dtoIn.paymentWebhookEventId,
      splitRecipientId: recipient.splitRecipientId,
      role: recipient.role,
      source: 'DispatchStripeSplitTransferService',
    };

    for (const [key, value] of Object.entries(metadata)) {
      if (value === undefined || value === null) {
        continue;
      }

      body.set(`metadata[${key}]`, String(value));
    }

    const providerRequest = {
      amount: recipient.amount,
      currency: recipient.currency.toLowerCase(),
      destination: recipient.destinationAccountId,
      sourceTransaction: dtoIn.sourceTransactionId,
      transferGroup: dtoIn.paymentSplitId,
      idempotencyKey,
      metadata,
    };

    const response = await fetch('https://api.stripe.com/v1/transfers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${dtoIn.providerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': idempotencyKey,
      },
      body,
    });

    const responseText = await response.text();
    const responseBody = this.parseJson(responseText);

    const gatewayTransferId = this.extractString(responseBody, 'id');

    const providerResponse = {
      statusCode: response.status,
      ok: response.ok,
      body: responseBody,
    };

    if (!response.ok) {
      return {
        transfer: {
          success: false,
          paymentSplitRecipientId: recipient.paymentSplitRecipientId,
          splitRecipientId: recipient.splitRecipientId,
          gatewayTransferId,
          destinationAccountId: recipient.destinationAccountId,
          amount: recipient.amount,
          currency: recipient.currency,
          statusCode: response.status,
          response: responseBody,
        },
        providerRequest,
        providerResponse,
      };
    }

    return {
      transfer: {
        success: true,
        paymentSplitRecipientId: recipient.paymentSplitRecipientId,
        splitRecipientId: recipient.splitRecipientId,
        gatewayTransferId,
        destinationAccountId: recipient.destinationAccountId,
        amount: recipient.amount,
        currency: recipient.currency,
        statusCode: response.status,
        response: responseBody,
      },
      providerRequest,
      providerResponse,
    };
  }

  private parseJson(value: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(value);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }

      return parsed as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private extractString(
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