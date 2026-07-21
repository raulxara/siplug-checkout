import { Injectable } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

import { ValidatePicPayWebhookDtoIn } from './dtos/validate-picpay-webhook.dto-in';
import { ValidatePicPayWebhookDtoOut } from './dtos/validate-picpay-webhook.dto-out';

@Injectable()
export class ValidatePicPayWebhookService {
  exec(dtoIn: ValidatePicPayWebhookDtoIn): ValidatePicPayWebhookDtoOut {
    if (dtoIn.webhookToken === null) {
      if (dtoIn.authMode === 'optional') {
        return new ValidatePicPayWebhookDtoOut(
          false,
          true,
          'webhookToken was not configured and auth mode is optional',
        );
      }

      throw new Error('PicPay webhookToken is required');
    }

    if (dtoIn.authorization === null) {
      if (dtoIn.authMode === 'optional') {
        return new ValidatePicPayWebhookDtoOut(
          false,
          true,
          'authorization header was not received and auth mode is optional',
        );
      }

      throw new Error('authorization header is required');
    }

    const receivedToken = this.normalizeAuthorizationToken(dtoIn.authorization);
    const expectedToken = this.normalizeAuthorizationToken(dtoIn.webhookToken);

    if (!this.safeCompare(receivedToken, expectedToken)) {
      throw new Error('invalid PicPay webhook authorization token');
    }

    return new ValidatePicPayWebhookDtoOut(true, false, null);
  }

  private normalizeAuthorizationToken(value: string): string {
    const trimmed = value.trim();

    if (trimmed.toLowerCase().startsWith('bearer ')) {
      return trimmed.substring(7).trim();
    }

    return trimmed;
  }

  private safeCompare(valueA: string, valueB: string): boolean {
    const bufferA = Buffer.from(valueA, 'utf8');
    const bufferB = Buffer.from(valueB, 'utf8');

    if (bufferA.length !== bufferB.length) {
      return false;
    }

    return timingSafeEqual(bufferA, bufferB);
  }
}
