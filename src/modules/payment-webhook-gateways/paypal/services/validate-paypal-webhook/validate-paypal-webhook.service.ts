import { Injectable } from '@nestjs/common';

import { ValidatePayPalWebhookDtoIn } from './dtos/validate-paypal-webhook.dto-in';
import { ValidatePayPalWebhookDtoOut } from './dtos/validate-paypal-webhook.dto-out';

type PayPalVerifySignatureResponse = {
  verification_status?: string;
  message?: string;
  name?: string;
  details?: unknown;
  [key: string]: unknown;
};

@Injectable()
export class ValidatePayPalWebhookService {
  async exec(
    dtoIn: ValidatePayPalWebhookDtoIn,
  ): Promise<ValidatePayPalWebhookDtoOut> {
    const webhookId = dtoIn.webhookId;

    if (webhookId === null && dtoIn.authMode === 'optional') {
      return new ValidatePayPalWebhookDtoOut(
        false,
        true,
        'paypal webhookId was not configured and auth mode is optional',
        null,
      );
    }

    if (webhookId === null) {
      throw new Error('PayPal webhookId is required to validate webhook signature');
    }

    const transmissionId = this.getHeader(dtoIn.headers, 'paypal-transmission-id');
    const transmissionTime = this.getHeader(
      dtoIn.headers,
      'paypal-transmission-time',
    );
    const transmissionSig = this.getHeader(dtoIn.headers, 'paypal-transmission-sig');
    const certUrl = this.getHeader(dtoIn.headers, 'paypal-cert-url');
    const authAlgo = this.getHeader(dtoIn.headers, 'paypal-auth-algo');

    const missingHeaders = [
      ['paypal-transmission-id', transmissionId],
      ['paypal-transmission-time', transmissionTime],
      ['paypal-transmission-sig', transmissionSig],
      ['paypal-cert-url', certUrl],
      ['paypal-auth-algo', authAlgo],
    ].filter(([, value]) => value === null);

    if (missingHeaders.length > 0 && dtoIn.authMode === 'optional') {
      return new ValidatePayPalWebhookDtoOut(
        false,
        true,
        `missing PayPal signature headers: ${missingHeaders
          .map(([key]) => key)
          .join(', ')}`,
        null,
      );
    }

    if (missingHeaders.length > 0) {
      throw new Error(
        `missing PayPal signature headers: ${missingHeaders
          .map(([key]) => key)
          .join(', ')}`,
      );
    }

    const requestPayload = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: dtoIn.payload,
    };

    const response = await fetch(
      `${dtoIn.baseUrl}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${dtoIn.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      },
    );

    const responseBody = (await response.json().catch(() => ({
      message: 'PayPal returned a non JSON verify signature response',
    }))) as PayPalVerifySignatureResponse;

    if (!response.ok) {
      throw new Error(
        this.toNullableString(responseBody.message) ??
          this.toNullableString(responseBody.name) ??
          `PayPal verify webhook signature failed with status ${response.status}`,
      );
    }

    const verificationStatus = this.toNullableString(
      responseBody.verification_status,
    );

    if (verificationStatus !== 'SUCCESS') {
      throw new Error(
        `PayPal webhook signature is invalid: ${verificationStatus ?? 'unknown'}`,
      );
    }

    return new ValidatePayPalWebhookDtoOut(
      true,
      false,
      null,
      responseBody as Record<string, unknown>,
    );
  }

  private getHeader(
    headers: Record<string, unknown>,
    key: string,
  ): string | null {
    const direct = this.toNullableString(headers[key]);

    if (direct !== null) {
      return direct;
    }

    const lowerKey = key.toLowerCase();

    for (const [headerKey, value] of Object.entries(headers)) {
      if (headerKey.toLowerCase() === lowerKey) {
        return this.toNullableString(value);
      }
    }

    return null;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
