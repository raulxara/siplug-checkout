import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';

import { ValidatePagSeguroWebhookDtoIn } from './dtos/validate-pagseguro-webhook.dto-in';
import { ValidatePagSeguroWebhookDtoOut } from './dtos/validate-pagseguro-webhook.dto-out';

@Injectable()
export class ValidatePagSeguroWebhookService {
  exec(dtoIn: ValidatePagSeguroWebhookDtoIn): ValidatePagSeguroWebhookDtoOut {
    if (dtoIn.xAuthenticityToken === null) {
      if (dtoIn.signatureMode === 'optional') {
        return new ValidatePagSeguroWebhookDtoOut(
          false,
          true,
          'x-authenticity-token was not received and signature mode is optional',
        );
      }

      throw new Error('x-authenticity-token header is required');
    }

    const expectedSignature = createHash('sha256')
      .update(`${dtoIn.token}-${dtoIn.rawBody}`)
      .digest('hex');

    if (!this.safeCompare(dtoIn.xAuthenticityToken, expectedSignature)) {
      throw new Error('invalid PagSeguro webhook signature');
    }

    return new ValidatePagSeguroWebhookDtoOut(true, false, null);
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
