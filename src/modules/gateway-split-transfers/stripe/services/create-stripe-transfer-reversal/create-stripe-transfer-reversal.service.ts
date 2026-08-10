import { Injectable } from '@nestjs/common';

import { CreateStripeTransferReversalDtoIn } from './dtos/create-stripe-transfer-reversal.dto-in';
import { CreateStripeTransferReversalDtoOut } from './dtos/create-stripe-transfer-reversal.dto-out';

@Injectable()
export class CreateStripeTransferReversalService {
  async exec(
    dtoIn: CreateStripeTransferReversalDtoIn,
  ): Promise<CreateStripeTransferReversalDtoOut> {
    const body = new URLSearchParams();

    body.set('amount', String(dtoIn.amount));

    for (const [key, value] of Object.entries(dtoIn.metadata)) {
      if (value === undefined || value === null) {
        continue;
      }

      body.set(`metadata[${key}]`, String(value));
    }

    const providerRequest = {
      provider: 'stripe',
      endpoint: 'POST /v1/transfers/:id/reversals',
      transferId: dtoIn.transferId,
      amount: dtoIn.amount,
      currency: dtoIn.currency,
      idempotencyKey: dtoIn.idempotencyKey,
      metadata: dtoIn.metadata,
    };

    const response = await fetch(
      `https://api.stripe.com/v1/transfers/${encodeURIComponent(
        dtoIn.transferId,
      )}/reversals`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${dtoIn.providerToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Idempotency-Key': dtoIn.idempotencyKey,
        },
        body,
      },
    );

    const responseText = await response.text();
    const responseBody = this.parseJson(responseText);

    const providerResponse = {
      provider: 'stripe',
      endpoint: 'POST /v1/transfers/:id/reversals',
      transferId: dtoIn.transferId,
      statusCode: response.status,
      ok: response.ok,
      body: responseBody,
    };

    if (!response.ok) {
      return new CreateStripeTransferReversalDtoOut(
        false,
        response.status,
        null,
        providerRequest,
        providerResponse,
        this.extractStripeErrorMessage(responseBody) ??
          'error on create stripe transfer reversal',
      );
    }

    return new CreateStripeTransferReversalDtoOut(
      true,
      response.status,
      responseBody,
      providerRequest,
      providerResponse,
      null,
    );
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

  private extractStripeErrorMessage(
    object: Record<string, unknown> | null,
  ): string | null {
    if (!object) {
      return null;
    }

    const error = object.error;

    if (!error || typeof error !== 'object' || Array.isArray(error)) {
      return null;
    }

    const message = (error as Record<string, unknown>).message;

    if (message === undefined || message === null) {
      return null;
    }

    const normalized = String(message).trim();

    return normalized === '' ? null : normalized;
  }
}