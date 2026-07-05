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

import { ReceivePagSeguroWebhookDtoIn } from './dtos/receive-pagseguro-webhook.dto-in';
import { ReceivePagSeguroWebhookUseCase } from './receive-pagseguro-webhook.use-case';

@Controller()
export class ReceivePagSeguroShortWebhookController {
  constructor(
    private readonly receivePagSeguroWebhookUseCase: ReceivePagSeguroWebhookUseCase,
  ) {}

  @Post('w/p/:apiCredentialId')
  @HttpCode(200)
  async handle(
    @Param('apiCredentialId') apiCredentialId: string,
    @Body() body: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const dtoOut = await this.receivePagSeguroWebhookUseCase.exec(
      new ReceivePagSeguroWebhookDtoIn({
        apiCredentialId,
        payload: body,
        rawBody: this.resolveRawBody(request, body),
        headers: this.normalizeHeaders(headers),
        xAuthenticityToken: this.resolveHeader(headers, 'x-authenticity-token'),
      }),
    );

    return {
      received: true,
      provider: 'pagseguro',
      eventId: this.extractString(dtoOut.processingResult, 'eventId'),
      processed: true,
      wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
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

  private extractString(
    data: Record<string, unknown>,
    key: string,
  ): string | null {
    const value = data[key];

    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();

    return normalized !== '' ? normalized : null;
  }
}