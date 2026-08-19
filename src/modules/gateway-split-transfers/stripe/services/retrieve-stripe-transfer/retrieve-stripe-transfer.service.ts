import { Injectable } from '@nestjs/common';

import { RetrieveStripeTransferDtoIn } from './dtos/retrieve-stripe-transfer.dto-in';
import { RetrieveStripeTransferDtoOut } from './dtos/retrieve-stripe-transfer.dto-out';

@Injectable()
export class RetrieveStripeTransferService {
  async exec(
    dtoIn: RetrieveStripeTransferDtoIn,
  ): Promise<RetrieveStripeTransferDtoOut> {
    const response = await fetch(
      `https://api.stripe.com/v1/transfers/${encodeURIComponent(
        dtoIn.transferId,
      )}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${dtoIn.providerToken}`,
        },
      },
    );

    const responseText = await response.text();
    const responseBody = this.parseJson(responseText);

    const providerResponse = {
      provider: 'stripe',
      endpoint: 'GET /v1/transfers/:id',
      transferId: dtoIn.transferId,
      statusCode: response.status,
      ok: response.ok,
      body: responseBody,
    };

    if (!response.ok) {
      return new RetrieveStripeTransferDtoOut(
        false,
        response.status,
        null,
        providerResponse,
        this.extractStripeErrorMessage(responseBody) ??
          'error on retrieve stripe transfer',
      );
    }

    return new RetrieveStripeTransferDtoOut(
      true,
      response.status,
      responseBody,
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