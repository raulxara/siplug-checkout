import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { ReceivePicPayWebhookDtoIn } from './dtos/receive-picpay-webhook.dto-in';
import { ReceivePicPayWebhookUseCase } from './receive-picpay-webhook.use-case';

@Controller('webhooks/gateways')
export class ReceivePicPayWebhookController {
  constructor(
    private readonly receivePicPayWebhookUseCase: ReceivePicPayWebhookUseCase,
  ) {}

  @Post('picpay/:apiCredentialId')
  @HttpCode(200)
  async handle(
    @Param('apiCredentialId') apiCredentialId: string,
    @Body() body: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const dtoOut = await this.receivePicPayWebhookUseCase.exec(
      new ReceivePicPayWebhookDtoIn({
        apiCredentialId,
        payload: body,
        rawBody: this.resolveRawBody(request, body),
        headers: this.normalizeHeaders(headers),
        authorization: this.resolveHeader(headers, 'authorization'),
        eventTypeHeader:
          this.resolveHeader(headers, 'event_type') ??
          this.resolveHeader(headers, 'event-type'),
      }),
    );

    return {
      status: 'success',
      message: 'picpay webhook received successfully',
      data: {
        paymentWebhookEvent: dtoOut.paymentWebhookEvent,
        paymentTransaction: dtoOut.paymentTransaction,
        processingResult: dtoOut.processingResult,
        wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
      },
    };
  }

  private resolveRawBody(
    request: RawBodyRequest<Request>,
    body: Record<string, unknown>,
  ): string {
    if (request.rawBody instanceof Buffer) {
      return request.rawBody.toString('utf8');
    }

    return JSON.stringify(body);
  }

  private resolveHeader(
    headers: Record<string, string | string[] | undefined>,
    key: string,
  ): string | null {
    const value = headers[key];

    if (Array.isArray(value)) {
      return String(value[0] ?? '').trim() || null;
    }

    return String(value ?? '').trim() || null;
  }

  private normalizeHeaders(
    headers: Record<string, string | string[] | undefined>,
  ): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(headers)) {
      normalized[key] = Array.isArray(value) ? value[0] : value;
    }

    return normalized;
  }
}
