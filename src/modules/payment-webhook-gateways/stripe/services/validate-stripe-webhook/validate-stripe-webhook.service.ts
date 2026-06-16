import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

import { ValidateStripeWebhookDtoIn } from './dtos/validate-stripe-webhook.dto-in';
import { ValidateStripeWebhookDtoOut } from './dtos/validate-stripe-webhook.dto-out';

@Injectable()
export class ValidateStripeWebhookService {
  exec(dtoIn: ValidateStripeWebhookDtoIn): ValidateStripeWebhookDtoOut {
    const parsedSignature = this.parseStripeSignature(dtoIn.stripeSignature);

    this.validateTimestamp({
      timestamp: parsedSignature.timestamp,
      toleranceInSeconds: dtoIn.toleranceInSeconds,
    });

    const signedPayload = `${parsedSignature.timestamp}.${dtoIn.rawBody}`;

    const expectedSignature = createHmac('sha256', dtoIn.endpointSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    const isValid = parsedSignature.signatures.some((signature) =>
      this.safeCompare(signature, expectedSignature),
    );

    if (!isValid) {
      throw new Error('invalid Stripe webhook signature');
    }

    return new ValidateStripeWebhookDtoOut(true, parsedSignature.timestamp);
  }

  private parseStripeSignature(signatureHeader: string): {
    timestamp: number;
    signatures: string[];
  } {
    const parts = signatureHeader.split(',').map((part) => part.trim());

    const timestampPart = parts.find((part) => part.startsWith('t='));
    const signatureParts = parts.filter((part) => part.startsWith('v1='));

    if (!timestampPart) {
      throw new Error('Stripe signature timestamp not found');
    }

    if (signatureParts.length === 0) {
      throw new Error('Stripe v1 signature not found');
    }

    const timestamp = Number(timestampPart.replace('t=', ''));

    if (Number.isNaN(timestamp)) {
      throw new Error('Stripe signature timestamp is invalid');
    }

    return {
      timestamp,
      signatures: signatureParts.map((part) => part.replace('v1=', '')),
    };
  }

  private validateTimestamp(params: {
    timestamp: number;
    toleranceInSeconds: number;
  }): void {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const difference = Math.abs(currentTimestamp - params.timestamp);

    if (difference > params.toleranceInSeconds) {
      throw new Error('Stripe webhook timestamp is outside tolerance');
    }
  }

  private safeCompare(valueA: string, valueB: string): boolean {
    const bufferA = Buffer.from(valueA, 'hex');
    const bufferB = Buffer.from(valueB, 'hex');

    if (bufferA.length !== bufferB.length) {
      return false;
    }

    return timingSafeEqual(bufferA, bufferB);
  }
}
