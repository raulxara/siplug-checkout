import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

import { ValidateMercadoPagoWebhookDtoIn } from './dtos/validate-mercado-pago-webhook.dto-in';
import { ValidateMercadoPagoWebhookDtoOut } from './dtos/validate-mercado-pago-webhook.dto-out';

@Injectable()
export class ValidateMercadoPagoWebhookService {
  exec(
    dtoIn: ValidateMercadoPagoWebhookDtoIn,
  ): ValidateMercadoPagoWebhookDtoOut {
    const parsedSignature = this.parseSignature(dtoIn.xSignature);

    const manifest = this.buildManifest({
      dataId: dtoIn.dataId,
      xRequestId: dtoIn.xRequestId,
      timestamp: parsedSignature.timestamp,
    });

    const expectedSignature = createHmac('sha256', dtoIn.webhookSecret)
      .update(manifest)
      .digest('hex');

    if (!this.safeCompare(parsedSignature.signature, expectedSignature)) {
      throw new Error('invalid Mercado Pago webhook signature');
    }

    return new ValidateMercadoPagoWebhookDtoOut(
      true,
      parsedSignature.timestamp,
    );
  }

  private buildManifest(params: {
    dataId: string | null;
    xRequestId: string;
    timestamp: string;
  }): string {
    const parts: string[] = [];

    if (params.dataId !== null) {
      parts.push(`id:${params.dataId}`);
    }

    if (params.xRequestId.trim() !== '') {
      parts.push(`request-id:${params.xRequestId}`);
    }

    if (params.timestamp.trim() !== '') {
      parts.push(`ts:${params.timestamp}`);
    }

    return `${parts.join(';')};`;
  }

  private parseSignature(signature: string): {
    timestamp: string;
    signature: string;
  } {
    const parts = signature.split(',').map((part) => part.trim());

    const timestampPart = parts.find((part) => part.startsWith('ts='));
    const signaturePart = parts.find((part) => part.startsWith('v1='));

    if (!timestampPart) {
      throw new Error('Mercado Pago signature timestamp not found');
    }

    if (!signaturePart) {
      throw new Error('Mercado Pago v1 signature not found');
    }

    return {
      timestamp: timestampPart.replace('ts=', '').trim(),
      signature: signaturePart.replace('v1=', '').trim(),
    };
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
